"""Daily profile monitor CLI for social, citation, and website analytics.

This script intentionally uses only the Python standard library so it can run
inside a plain Codex automation environment without installing project
dependencies.
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import pathlib
import re
import sys
import textwrap
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


GITHUB_API = "https://api.github.com"
X_API = "https://api.x.com/2"
CLOUDFLARE_GRAPHQL_API = "https://api.cloudflare.com/client/v4/graphql"
SCHOLAR_PROFILE_URL = "https://scholar.google.com/citations"


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments for the monitor CLI."""
    parser = argparse.ArgumentParser(description="Produce a daily profile monitor report.")
    parser.add_argument(
        "--config",
        default="scripts/profile_monitor/config.local.json",
        help="Path to the JSON monitor configuration.",
    )
    parser.add_argument(
        "--env",
        default=".env",
        help="Path to a dotenv-style file to load before collecting metrics.",
    )
    parser.add_argument(
        "--state-dir",
        default=None,
        help="Override the snapshot state directory.",
    )
    parser.add_argument(
        "--date",
        default=None,
        help="Report date in YYYY-MM-DD format. Defaults to today.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Collect and report without writing a new snapshot.",
    )
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Skip network calls and emit source-level skipped statuses.",
    )
    return parser.parse_args()


def load_dotenv(path: pathlib.Path) -> dict[str, str]:
    """Load simple KEY=VALUE entries from a dotenv file into the environment."""
    loaded: dict[str, str] = {}
    if not path.exists():
        return loaded
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = value
            loaded[key] = value
    return loaded


def load_config(path: pathlib.Path) -> dict[str, Any]:
    """Read the monitor JSON configuration file."""
    if not path.exists():
        raise FileNotFoundError(
            f"Config not found: {path}. Copy scripts/profile_monitor/config.example.json "
            "to scripts/profile_monitor/config.local.json first."
        )
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def today_from_args(date_text: str | None) -> dt.date:
    """Return the report date requested by the user or the local current date."""
    if date_text:
        return dt.date.fromisoformat(date_text)
    return dt.datetime.now().date()


def request_json(
    url: str,
    headers: dict[str, str] | None = None,
    body: dict[str, Any] | None = None,
    timeout: int = 30,
) -> Any:
    """Request a JSON endpoint and return the decoded response body."""
    data = None
    request_headers = {
        "Accept": "application/json",
        "User-Agent": "huskydoge-profile-monitor/1.0",
    }
    if headers:
        request_headers.update(headers)
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        request_headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=request_headers)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        payload = response.read().decode("utf-8")
    return json.loads(payload)


def request_text(url: str, headers: dict[str, str] | None = None, timeout: int = 30) -> str:
    """Request a text endpoint and return the decoded response body."""
    request_headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 profile-monitor",
    }
    if headers:
        request_headers.update(headers)
    request = urllib.request.Request(url, headers=request_headers)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def source_error(source: str, error: Exception) -> dict[str, Any]:
    """Convert an exception into a reportable source error payload."""
    if isinstance(error, urllib.error.HTTPError):
        detail = f"HTTP {error.code}: {error.reason}"
    elif isinstance(error, urllib.error.URLError):
        detail = f"URL error: {error.reason}"
    else:
        detail = f"{type(error).__name__}: {error}"
    return {"status": "error", "source": source, "error": detail}


def skipped_source(source: str, reason: str) -> dict[str, Any]:
    """Create a reportable skipped-source payload."""
    return {"status": "skipped", "source": source, "reason": reason}


def github_headers() -> dict[str, str]:
    """Build GitHub REST API headers from the optional environment token."""
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def collect_github(config: dict[str, Any], offline: bool = False) -> dict[str, Any]:
    """Collect GitHub followers and configured repository star counts."""
    if offline:
        return skipped_source("github", "offline mode enabled")
    username = config.get("username")
    repos = config.get("repos", [])
    if not username:
        return skipped_source("github", "missing github.username in config")
    try:
        followers: list[dict[str, Any]] = []
        page = 1
        headers = github_headers()
        while True:
            url = f"{GITHUB_API}/users/{urllib.parse.quote(username)}/followers?per_page=100&page={page}"
            batch = request_json(url, headers=headers)
            if not batch:
                break
            followers.extend({"login": item.get("login"), "id": item.get("id")} for item in batch)
            if len(batch) < 100:
                break
            page += 1

        repo_metrics: dict[str, dict[str, Any]] = {}
        for repo in repos:
            repo_url = f"{GITHUB_API}/repos/{repo}"
            repo_data = request_json(repo_url, headers=headers)
            repo_metrics[repo] = {
                "stars": repo_data.get("stargazers_count"),
                "forks": repo_data.get("forks_count"),
                "open_issues": repo_data.get("open_issues_count"),
            }
        return {"status": "ok", "followers": followers, "repos": repo_metrics}
    except Exception as error:  # noqa: BLE001 - command-line monitor must report all source failures.
        return source_error("github", error)


def strip_tags(markup: str) -> str:
    """Remove HTML tags and decode entities from a short markup fragment."""
    without_tags = re.sub(r"<[^>]+>", "", markup)
    return html.unescape(without_tags).strip()


def normalize_title(title: str) -> str:
    """Normalize a paper title for resilient matching across sources."""
    lowered = title.lower()
    return re.sub(r"[^a-z0-9]+", " ", lowered).strip()


def parse_scholar_rows(markup: str) -> list[dict[str, Any]]:
    """Parse paper citation rows from a Google Scholar public profile page."""
    if not markup.strip():
        raise RuntimeError("Google Scholar returned an empty response body")
    if "unusual traffic" in markup.lower() or "captcha" in markup.lower():
        raise RuntimeError("Google Scholar returned a CAPTCHA or unusual-traffic page")

    rows = re.findall(
        r'<tr[^>]*class="[^"]*\bgsc_a_tr\b[^"]*"[^>]*>(.*?)</tr>',
        markup,
        flags=re.DOTALL,
    )
    papers: list[dict[str, Any]] = []
    for row in rows:
        title_match = re.search(
            r'<a[^>]*class="[^"]*\bgsc_a_at\b[^"]*"[^>]*>(.*?)</a>',
            row,
            flags=re.DOTALL,
        )
        if not title_match:
            continue
        citation_cell = re.search(
            r'<td[^>]*class="[^"]*\bgsc_a_c\b[^"]*"[^>]*>(.*?)</td>',
            row,
            flags=re.DOTALL,
        )
        citation_text = strip_tags(citation_cell.group(1)) if citation_cell else ""
        citation_match = re.search(r"\d+", citation_text)
        year_match = re.search(
            r'<td[^>]*class="[^"]*\bgsc_a_y\b[^"]*"[^>]*>.*?<span[^>]*>(.*?)</span>',
            row,
            flags=re.DOTALL,
        )
        papers.append(
            {
                "title": strip_tags(title_match.group(1)),
                "citations": int(citation_match.group(0)) if citation_match else 0,
                "year": strip_tags(year_match.group(1)) if year_match else "",
            }
        )
    if not papers:
        raise RuntimeError("No Scholar paper rows found in profile page")
    return papers


def filter_scholar_papers(
    parsed_papers: list[dict[str, Any]], configured_papers: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Return parsed Scholar rows matched to configured papers when a list is provided."""
    if not configured_papers:
        return parsed_papers
    parsed_by_normalized = {normalize_title(item["title"]): item for item in parsed_papers}
    matched: list[dict[str, Any]] = []
    for paper in configured_papers:
        target = normalize_title(paper.get("title", ""))
        match = parsed_by_normalized.get(target)
        if match is None:
            match = next(
                (
                    candidate
                    for key, candidate in parsed_by_normalized.items()
                    if target and (target in key or key in target)
                ),
                None,
            )
        if match is None:
            matched.append(
                {
                    "title": paper.get("title", "untitled"),
                    "citations": None,
                    "year": "",
                    "status": "missing",
                }
            )
        else:
            enriched = dict(match)
            enriched.update({"doi": paper.get("doi", ""), "arxiv": paper.get("arxiv", "")})
            matched.append(enriched)
    return matched


def collect_scholar(config: dict[str, Any], offline: bool = False) -> dict[str, Any]:
    """Collect Google Scholar citation counts from the public profile page."""
    if offline:
        return skipped_source("scholar", "offline mode enabled")
    profile_id = config.get("profile_id")
    if not profile_id:
        return skipped_source("scholar", "missing scholar.profile_id in config")
    try:
        query = urllib.parse.urlencode(
            {"user": profile_id, "hl": "en", "pagesize": "100", "view_op": "list_works"}
        )
        markup = request_text(f"{SCHOLAR_PROFILE_URL}?{query}")
        parsed_papers = parse_scholar_rows(markup)
        papers = filter_scholar_papers(parsed_papers, config.get("papers", []))
        total = sum(item.get("citations") or 0 for item in parsed_papers)
        return {"status": "ok", "total_citations": total, "papers": papers}
    except Exception as error:  # noqa: BLE001 - source failures should not stop the digest.
        return source_error("scholar", error)


def cloudflare_date_window(report_date: dt.date) -> tuple[str, str]:
    """Return the UTC-style date window strings used by Cloudflare GraphQL filters."""
    start = report_date.isoformat()
    end = (report_date + dt.timedelta(days=1)).isoformat()
    return start, end


def collect_cloudflare(
    config: dict[str, Any], report_date: dt.date, offline: bool = False
) -> dict[str, Any]:
    """Collect Cloudflare Web Analytics or zone analytics for one day."""
    if offline:
        return skipped_source("cloudflare", "offline mode enabled")
    token = os.environ.get(config.get("api_token_env", "CLOUDFLARE_API_TOKEN"))
    account_id = os.environ.get(config.get("account_id_env", "CLOUDFLARE_ACCOUNT_ID"))
    site_tag = os.environ.get(
        config.get("web_analytics_site_tag_env", "CLOUDFLARE_WEB_ANALYTICS_SITE_TAG")
    )
    zone_tag = os.environ.get(config.get("zone_tag_env", "CLOUDFLARE_ZONE_TAG"))
    if not token or not account_id:
        return skipped_source(
            "cloudflare",
            "missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID",
        )
    if site_tag:
        return collect_cloudflare_web_analytics(token, account_id, site_tag, report_date)
    if not zone_tag:
        return skipped_source(
            "cloudflare",
            "missing CLOUDFLARE_WEB_ANALYTICS_SITE_TAG or CLOUDFLARE_ZONE_TAG",
        )
    return collect_cloudflare_zone_analytics(token, account_id, zone_tag, report_date)


def collect_cloudflare_web_analytics(
    token: str, account_id: str, site_tag: str, report_date: dt.date
) -> dict[str, Any]:
    """Collect Cloudflare Web Analytics page views, visits, and country groups."""
    start_date, end_date = cloudflare_date_window(report_date)
    query = """
    query ProfileMonitorCloudflareRum($accountTag: string!, $siteTag: string!, $start: Date!, $end: Date!) {
      viewer {
        accounts(filter: {accountTag: $accountTag}) {
          rumPageloadEventsAdaptiveGroups(
            limit: 100,
            filter: {siteTag: $siteTag, date_geq: $start, date_lt: $end, bot: 0},
            orderBy: [count_DESC]
          ) {
            count
            dimensions {
              countryName
            }
            sum {
              visits
            }
          }
        }
      }
    }
    """
    try:
        payload = request_json(
            CLOUDFLARE_GRAPHQL_API,
            headers={"Authorization": f"Bearer {token}"},
            body={
                "query": query,
                "variables": {
                    "accountTag": account_id,
                    "siteTag": site_tag,
                    "start": start_date,
                    "end": end_date,
                },
            },
        )
        if payload.get("errors"):
            return {
                "status": "error",
                "source": "cloudflare",
                "error": json.dumps(payload["errors"], ensure_ascii=False),
            }
        groups = (
            payload.get("data", {})
            .get("viewer", {})
            .get("accounts", [{}])[0]
            .get("rumPageloadEventsAdaptiveGroups", [])
        )
        countries: list[dict[str, Any]] = []
        totals = {"page_views": 0, "visits": 0, "uniques": None}
        for group in groups:
            dimensions = group.get("dimensions", {})
            sums = group.get("sum", {})
            page_views = group.get("count") or 0
            visits = sums.get("visits") or 0
            totals["page_views"] += page_views
            totals["visits"] += visits
            countries.append(
                {
                    "country": dimensions.get("countryName") or "Unknown",
                    "page_views": page_views,
                    "visits": visits,
                }
            )
        return {"status": "ok", "mode": "web_analytics", "totals": totals, "countries": countries}
    except Exception as error:  # noqa: BLE001 - source failures should be in the report.
        return source_error("cloudflare", error)


def collect_cloudflare_zone_analytics(
    token: str, account_id: str, zone_tag: str, report_date: dt.date
) -> dict[str, Any]:
    """Collect fallback Cloudflare zone request, page view, and country analytics."""
    start_date, end_date = cloudflare_date_window(report_date)
    query = """
    query ProfileMonitorCloudflareZone($accountTag: string!, $zoneTag: string!, $start: Date!, $end: Date!) {
      viewer {
        accounts(filter: {accountTag: $accountTag}) {
          httpRequestsAdaptiveGroups(
            limit: 100,
            filter: {zoneTag: $zoneTag, date_geq: $start, date_lt: $end},
            orderBy: [sum_requests_DESC]
          ) {
            dimensions {
              clientCountryName
            }
            sum {
              requests
              pageViews
            }
            uniq {
              uniques
            }
          }
        }
      }
    }
    """
    try:
        payload = request_json(
            CLOUDFLARE_GRAPHQL_API,
            headers={"Authorization": f"Bearer {token}"},
            body={
                "query": query,
                "variables": {
                    "accountTag": account_id,
                    "zoneTag": zone_tag,
                    "start": start_date,
                    "end": end_date,
                },
            },
        )
        if payload.get("errors"):
            return {
                "status": "error",
                "source": "cloudflare",
                "error": json.dumps(payload["errors"], ensure_ascii=False),
            }
        groups = (
            payload.get("data", {})
            .get("viewer", {})
            .get("accounts", [{}])[0]
            .get("httpRequestsAdaptiveGroups", [])
        )
        countries: list[dict[str, Any]] = []
        totals = {"requests": 0, "page_views": 0, "uniques": 0}
        for group in groups:
            dimensions = group.get("dimensions", {})
            sums = group.get("sum", {})
            uniq = group.get("uniq", {})
            requests = sums.get("requests") or 0
            page_views = sums.get("pageViews") or 0
            uniques = uniq.get("uniques") or 0
            totals["requests"] += requests
            totals["page_views"] += page_views
            totals["uniques"] += uniques
            countries.append(
                {
                    "country": dimensions.get("clientCountryName") or "Unknown",
                    "requests": requests,
                    "page_views": page_views,
                    "uniques": uniques,
                }
            )
        return {"status": "ok", "mode": "zone_analytics", "totals": totals, "countries": countries}
    except Exception as error:  # noqa: BLE001 - source failures should be in the report.
        return source_error("cloudflare", error)


def x_headers(config: dict[str, Any]) -> dict[str, str] | None:
    """Build X API headers from the configured bearer-token environment variable."""
    token = os.environ.get(config.get("bearer_token_env", "X_BEARER_TOKEN"))
    if not token:
        return None
    return {"Authorization": f"Bearer {token}"}


def resolve_x_user_id(config: dict[str, Any], headers: dict[str, str]) -> str:
    """Resolve an X username to a numeric user id when the id is not configured."""
    if config.get("user_id"):
        return str(config["user_id"])
    username = config.get("username")
    if not username:
        raise RuntimeError("missing x.username or x.user_id in config")
    url = f"{X_API}/users/by/username/{urllib.parse.quote(username)}?user.fields=public_metrics"
    payload = request_json(url, headers=headers)
    user_id = payload.get("data", {}).get("id")
    if not user_id:
        raise RuntimeError(f"unable to resolve X username: {username}")
    return str(user_id)


def collect_x(config: dict[str, Any], offline: bool = False) -> dict[str, Any]:
    """Collect X followers and profile follower count."""
    if offline:
        return skipped_source("x", "offline mode enabled")
    headers = x_headers(config)
    if not headers:
        return skipped_source("x", "missing X_BEARER_TOKEN")
    try:
        user_id = resolve_x_user_id(config, headers)
        followers: list[dict[str, Any]] = []
        next_token = None
        while True:
            params = {
                "max_results": "1000",
                "user.fields": "username,name,public_metrics",
            }
            if next_token:
                params["pagination_token"] = next_token
            query = urllib.parse.urlencode(params)
            payload = request_json(f"{X_API}/users/{user_id}/followers?{query}", headers=headers)
            for item in payload.get("data", []):
                followers.append(
                    {
                        "id": item.get("id"),
                        "username": item.get("username"),
                        "name": item.get("name"),
                    }
                )
            next_token = payload.get("meta", {}).get("next_token")
            if not next_token:
                break
        return {"status": "ok", "user_id": user_id, "followers": followers}
    except Exception as error:  # noqa: BLE001 - source failures should be in the report.
        return source_error("x", error)


def collect_linkedin(config: dict[str, Any]) -> dict[str, Any]:
    """Read an optional LinkedIn invitation summary produced from Gmail notifications."""
    summary_env = config.get("summary_json_env", "LINKEDIN_SUMMARY_JSON")
    summary_path = os.environ.get(summary_env)
    if not summary_path:
        return skipped_source(
            "linkedin",
            f"Gmail connector summary not provided; suggested query: {config.get('gmail_query', '')}",
        )
    path = pathlib.Path(summary_path).expanduser()
    if not path.exists():
        return skipped_source("linkedin", f"summary file does not exist: {path}")
    try:
        with path.open("r", encoding="utf-8") as handle:
            summary = json.load(handle)
        return {"status": "ok", **summary}
    except Exception as error:  # noqa: BLE001 - malformed optional summary should be reported.
        return source_error("linkedin", error)


def state_directory(args: argparse.Namespace) -> pathlib.Path:
    """Resolve the snapshot state directory from CLI args, env, or local default."""
    if args.state_dir:
        return pathlib.Path(args.state_dir).expanduser()
    if os.environ.get("PROFILE_MONITOR_STATE_DIR"):
        return pathlib.Path(os.environ["PROFILE_MONITOR_STATE_DIR"]).expanduser()
    return pathlib.Path("scripts/profile_monitor/state")


def load_previous_snapshot(state_dir: pathlib.Path) -> dict[str, Any] | None:
    """Load the latest saved snapshot if one exists."""
    latest_path = state_dir / "latest.json"
    if not latest_path.exists():
        return None
    with latest_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_snapshot(state_dir: pathlib.Path, snapshot: dict[str, Any], report_date: dt.date) -> None:
    """Persist the current snapshot, latest pointer, and chart-friendly history."""
    state_dir.mkdir(parents=True, exist_ok=True)
    dated_path = state_dir / f"{report_date.isoformat()}.json"
    latest_path = state_dir / "latest.json"
    content = json.dumps(snapshot, indent=2, ensure_ascii=False, sort_keys=True)
    dated_path.write_text(content + "\n", encoding="utf-8")
    latest_path.write_text(content + "\n", encoding="utf-8")
    save_metrics_history(state_dir, snapshot)


def build_metrics_history_row(snapshot: dict[str, Any]) -> dict[str, Any]:
    """Build one compact daily metrics row for charting profile trends."""
    github = current_source(snapshot, "github")
    scholar = current_source(snapshot, "scholar")
    cloudflare = current_source(snapshot, "cloudflare")
    x_source = current_source(snapshot, "x")
    cloudflare_totals = cloudflare.get("totals", {})
    return {
        "date": snapshot["date"],
        "collected_at": snapshot["collected_at"],
        "github_followers": len(github.get("followers", [])) if github.get("status") == "ok" else None,
        "github_repo_stars": {
            repo: metrics.get("stars") for repo, metrics in github.get("repos", {}).items()
        },
        "scholar_total_citations": scholar.get("total_citations")
        if scholar.get("status") == "ok"
        else None,
        "scholar_paper_citations": {
            paper.get("title", "untitled"): paper.get("citations")
            for paper in scholar.get("papers", [])
        },
        "cloudflare_mode": cloudflare.get("mode"),
        "cloudflare_page_views": cloudflare_totals.get("page_views"),
        "cloudflare_visits": cloudflare_totals.get("visits"),
        "cloudflare_uniques": cloudflare_totals.get("uniques"),
        "x_followers": len(x_source.get("followers", [])) if x_source.get("status") == "ok" else None,
    }


def save_metrics_history(state_dir: pathlib.Path, snapshot: dict[str, Any]) -> None:
    """Upsert the compact daily metrics row used for plotting over time."""
    history_path = state_dir / "metrics_history.json"
    row = build_metrics_history_row(snapshot)
    if history_path.exists():
        with history_path.open("r", encoding="utf-8") as handle:
            history = json.load(handle)
    else:
        history = []
    history_by_date = {item["date"]: item for item in history if "date" in item}
    history_by_date[row["date"]] = row
    ordered_history = [history_by_date[key] for key in sorted(history_by_date)]
    history_path.write_text(
        json.dumps(ordered_history, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def index_by_key(items: list[dict[str, Any]], key: str) -> dict[str, dict[str, Any]]:
    """Index a list of dictionaries by a key when the key is present."""
    return {str(item[key]): item for item in items if item.get(key) is not None}


def count_delta(current: int | None, previous: int | None) -> str:
    """Format a signed count delta for report display."""
    if current is None or previous is None:
        return "n/a"
    delta = current - previous
    sign = "+" if delta >= 0 else ""
    return f"{sign}{delta}"


def diff_followers(
    current: list[dict[str, Any]], previous: list[dict[str, Any]], label_key: str
) -> dict[str, list[str]]:
    """Compute added and removed followers using id as identity and labels for display."""
    current_by_id = index_by_key(current, "id")
    previous_by_id = index_by_key(previous, "id")
    added_ids = sorted(set(current_by_id) - set(previous_by_id))
    removed_ids = sorted(set(previous_by_id) - set(current_by_id))
    return {
        "added": [str(current_by_id[item].get(label_key) or item) for item in added_ids],
        "removed": [str(previous_by_id[item].get(label_key) or item) for item in removed_ids],
    }


def previous_source(previous: dict[str, Any] | None, source: str) -> dict[str, Any]:
    """Return a previous source snapshot or an empty payload."""
    if not previous:
        return {}
    return previous.get("sources", {}).get(source, {})


def current_source(snapshot: dict[str, Any], source: str) -> dict[str, Any]:
    """Return a current source snapshot or an empty payload."""
    return snapshot.get("sources", {}).get(source, {})


def format_name_list(names: list[str], limit: int = 8) -> str:
    """Format a bounded comma-separated list for the daily report."""
    if not names:
        return "无"
    visible = names[:limit]
    suffix = "" if len(names) <= limit else f" 等 {len(names)} 个"
    return ", ".join(visible) + suffix


def render_status_line(payload: dict[str, Any]) -> str | None:
    """Render a skipped or errored source as a one-line Chinese status."""
    if payload.get("status") == "skipped":
        return f"跳过：{payload.get('reason', '未说明原因')}"
    if payload.get("status") == "error":
        return f"读取失败：{payload.get('error', '未知错误')}"
    return None


def render_github(snapshot: dict[str, Any], previous: dict[str, Any] | None) -> list[str]:
    """Render the GitHub section of the daily report."""
    current = current_source(snapshot, "github")
    status_line = render_status_line(current)
    if status_line:
        return ["## GitHub", f"- {status_line}"]
    previous_github = previous_source(previous, "github")
    current_followers = current.get("followers", [])
    previous_followers = previous_github.get("followers", [])
    follower_diff = diff_followers(current_followers, previous_followers, "login") if previous else None
    lines = ["## GitHub"]
    lines.append(f"- Followers: {len(current_followers)}")
    if follower_diff is not None:
        lines.append(f"- 新增 followers: {format_name_list(follower_diff['added'])}")
        lines.append(f"- 流失 followers: {format_name_list(follower_diff['removed'])}")
    else:
        lines.append("- 新增/流失 followers: 首次记录，作为 baseline")
    repos = current.get("repos", {})
    previous_repos = previous_github.get("repos", {})
    for repo, metrics in repos.items():
        prev_stars = previous_repos.get(repo, {}).get("stars")
        lines.append(f"- {repo}: {metrics.get('stars')} stars ({count_delta(metrics.get('stars'), prev_stars)})")
    return lines


def render_scholar(snapshot: dict[str, Any], previous: dict[str, Any] | None) -> list[str]:
    """Render the Google Scholar section of the daily report."""
    current = current_source(snapshot, "scholar")
    status_line = render_status_line(current)
    if status_line:
        return ["## Google Scholar", f"- {status_line}"]
    previous_scholar = previous_source(previous, "scholar")
    previous_papers = {
        normalize_title(item.get("title", "")): item for item in previous_scholar.get("papers", [])
    }
    lines = ["## Google Scholar", f"- 总 citations: {current.get('total_citations')}"]
    for paper in current.get("papers", []):
        title = paper.get("title", "untitled")
        citations = paper.get("citations")
        prev = previous_papers.get(normalize_title(title), {})
        delta = count_delta(citations, prev.get("citations")) if previous else "baseline"
        if citations is None:
            lines.append(f"- {title}: 未在 Scholar 页面匹配到")
        else:
            lines.append(f"- {title}: {citations} citations ({delta})")
    return lines


def render_cloudflare(snapshot: dict[str, Any], previous: dict[str, Any] | None) -> list[str]:
    """Render the Cloudflare analytics section of the daily report."""
    current = current_source(snapshot, "cloudflare")
    status_line = render_status_line(current)
    if status_line:
        return ["## Cloudflare", f"- {status_line}"]
    previous_cf = previous_source(previous, "cloudflare")
    totals = current.get("totals", {})
    previous_totals = previous_cf.get("totals", {})
    lines = ["## Cloudflare"]
    if current.get("mode") == "web_analytics":
        lines.append(
            f"- Page views: {totals.get('page_views', 0)} "
            f"({count_delta(totals.get('page_views'), previous_totals.get('page_views'))})"
        )
        lines.append(
            f"- Visits: {totals.get('visits', 0)} "
            f"({count_delta(totals.get('visits'), previous_totals.get('visits'))})"
        )
        lines.append("- Unique visitors: Cloudflare Web Analytics GraphQL RUM dataset 未直接暴露该字段")
        countries = sorted(
            current.get("countries", []), key=lambda item: item.get("page_views", 0), reverse=True
        )[:8]
        country_text = ", ".join(
            f"{item['country']} {item.get('page_views', 0)} PV/{item.get('visits', 0)} visits"
            for item in countries
        ) or "无"
    else:
        lines.append(
            f"- Requests: {totals.get('requests', 0)} "
            f"({count_delta(totals.get('requests'), previous_totals.get('requests'))})"
        )
        lines.append(
            f"- Page views: {totals.get('page_views', 0)} "
            f"({count_delta(totals.get('page_views'), previous_totals.get('page_views'))})"
        )
        lines.append(
            f"- Unique visitors: {totals.get('uniques', 0)} "
            f"({count_delta(totals.get('uniques'), previous_totals.get('uniques'))})"
        )
        countries = sorted(current.get("countries", []), key=lambda item: item.get("requests", 0), reverse=True)[:8]
        country_text = ", ".join(f"{item['country']} {item.get('requests', 0)}" for item in countries) or "无"
    lines.append(f"- 国家/地区 Top: {country_text}")
    return lines


def render_x(snapshot: dict[str, Any], previous: dict[str, Any] | None) -> list[str]:
    """Render the X/Twitter section of the daily report."""
    current = current_source(snapshot, "x")
    status_line = render_status_line(current)
    if status_line:
        return ["## X / Twitter", f"- {status_line}"]
    previous_x = previous_source(previous, "x")
    current_followers = current.get("followers", [])
    previous_followers = previous_x.get("followers", [])
    follower_diff = diff_followers(current_followers, previous_followers, "username") if previous else None
    lines = ["## X / Twitter", f"- Followers: {len(current_followers)}"]
    if follower_diff is not None:
        lines.append(f"- 新增 followers: {format_name_list(follower_diff['added'])}")
        lines.append(f"- 流失 followers: {format_name_list(follower_diff['removed'])}")
    else:
        lines.append("- 新增/流失 followers: 首次记录，作为 baseline")
    return lines


def render_linkedin(snapshot: dict[str, Any]) -> list[str]:
    """Render the LinkedIn invitation section of the daily report."""
    current = current_source(snapshot, "linkedin")
    status_line = render_status_line(current)
    if status_line:
        return ["## LinkedIn", f"- {status_line}"]
    count = current.get("count", 0)
    senders = current.get("senders", [])
    notes = current.get("notes")
    lines = ["## LinkedIn", f"- 新 invitation 邮件: {count}", f"- 来源: {format_name_list(senders)}"]
    if notes:
        lines.append(f"- 备注: {notes}")
    return lines


def render_report(
    snapshot: dict[str, Any], previous: dict[str, Any] | None, dry_run: bool
) -> str:
    """Render the full Markdown report in Chinese."""
    report_date = snapshot["date"]
    lines = [
        f"# Profile 日报 - {report_date}",
        "",
        f"- 生成时间: {snapshot['collected_at']}",
        f"- 模式: {'dry-run，不写入快照' if dry_run else '已写入快照'}",
        "",
    ]
    sections = [
        render_github(snapshot, previous),
        render_scholar(snapshot, previous),
        render_cloudflare(snapshot, previous),
        render_linkedin(snapshot),
        render_x(snapshot, previous),
    ]
    for section in sections:
        lines.extend(section)
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def collect_all(config: dict[str, Any], report_date: dt.date, offline: bool) -> dict[str, Any]:
    """Collect all configured monitor sources into one snapshot payload."""
    return {
        "date": report_date.isoformat(),
        "collected_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "profile": config.get("profile", {}),
        "sources": {
            "github": collect_github(config.get("github", {}), offline=offline),
            "scholar": collect_scholar(config.get("scholar", {}), offline=offline),
            "cloudflare": collect_cloudflare(config.get("cloudflare", {}), report_date, offline=offline),
            "linkedin": collect_linkedin(config.get("linkedin", {})),
            "x": collect_x(config.get("x", {}), offline=offline),
        },
    }


def main() -> int:
    """Run the profile monitor and print the Markdown report."""
    args = parse_args()
    load_dotenv(pathlib.Path(args.env))
    try:
        config = load_config(pathlib.Path(args.config))
    except Exception as error:  # noqa: BLE001 - CLI should present config issues cleanly.
        print(f"Config error: {error}", file=sys.stderr)
        return 2

    report_date = today_from_args(args.date)
    state_dir = state_directory(args)
    previous = load_previous_snapshot(state_dir)
    snapshot = collect_all(config, report_date, offline=args.offline)
    if not args.dry_run:
        save_snapshot(state_dir, snapshot, report_date)
    print(render_report(snapshot, previous, args.dry_run))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
