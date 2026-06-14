# Daily Profile Monitor

This folder contains the local script used by the daily Codex automation to produce a Chinese profile-status digest.

## Setup

1. Copy `scripts/profile_monitor/config.example.json` to `scripts/profile_monitor/config.local.json`.
2. Edit `config.local.json` with the GitHub repos, Scholar papers, Cloudflare identifiers, and X account you want to monitor.
3. Add secrets to the repo-local `.env` file. The script reads `.env` automatically and never needs secrets in tracked files.

Required environment variables:

```sh
GITHUB_TOKEN=optional_for_public_data
CLOUDFLARE_API_TOKEN=cloudflare_read_analytics_token
CLOUDFLARE_ACCOUNT_ID=cloudflare_account_id
CLOUDFLARE_WEB_ANALYTICS_SITE_TAG=cloudflare_web_analytics_site_tag
X_BEARER_TOKEN=x_api_bearer_token
PROFILE_MONITOR_STATE_DIR=/Users/husky/.codex/automations/profile-monitor/state
```

`CLOUDFLARE_ZONE_TAG` is optional and only used as a fallback for zone traffic analytics. For this personal site, prefer `CLOUDFLARE_WEB_ANALYTICS_SITE_TAG`.

Optional LinkedIn summary input:

```sh
LINKEDIN_SUMMARY_JSON=/path/to/linkedin-summary.json
```

The LinkedIn JSON file should look like:

```json
{
  "count": 1,
  "senders": ["Example Person"],
  "query": "from:(linkedin.com) invitation newer_than:1d",
  "notes": "Collected from Gmail notifications."
}
```

## Running

Dry run without writing a snapshot:

```sh
python3 scripts/profile_monitor/monitor.py --config scripts/profile_monitor/config.local.json --dry-run
```

Normal daily run:

```sh
python3 scripts/profile_monitor/monitor.py --config scripts/profile_monitor/config.local.json
```

Offline smoke test:

```sh
python3 scripts/profile_monitor/monitor.py --config scripts/profile_monitor/config.example.json --offline --dry-run
```

## Output

The script prints a Markdown report in Chinese and stores snapshots in `PROFILE_MONITOR_STATE_DIR` or `scripts/profile_monitor/state`.

State files:

- `YYYY-MM-DD.json`: full daily snapshot, including GitHub and X follower lists plus per-paper Scholar citation counts.
- `latest.json`: latest full snapshot used for added/removed follower and citation diffs.
- `metrics_history.json`: compact daily time series for plotting followers, stars, citations, page views, and visits.
