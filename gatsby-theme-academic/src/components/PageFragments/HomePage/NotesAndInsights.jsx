/** Home page short-form writing feed for external notes and ideas. */
import React, { useMemo, useState } from 'react';

import * as styles from './homePage.module.less';

const insightItems = [
  {
    date: '2026/06/18',
    year: '2026',
    name: 'Weight-Tied Iterative Models: Promise, Hype, and the Missing Evidence in 2026',
    url: 'https://x.com/huskydogewoof/status/2067520786001530964?s=20',
    tldr: 'Weight-tied iterative models are exciting, but the field still lacks solid evidence that they beat strong feedforward baselines under matched training and inference budgets.',
  },
  {
    date: '2026/05/21',
    year: '2026',
    name: 'Rethinking Hierarchy in Iterative Reasoning Models',
    url: 'https://x.com/huskydogewoof/status/2058082328744993013?s=20',
    tldr: 'Early EqR/TRM observations suggest low-level latents may be better than high-level solution states for adaptive halting, hinting at value-like signals about progress, confidence, or residual error.',
  },
  {
    date: '2026/05/01',
    year: '2026',
    name: 'The Road to Flow Equivariant World Models: Memory for Partially Observed Dynamic Environments',
    url: 'https://x.com/huskydogewoof/status/2050073906636038325?s=20',
    tldr: 'A reflection on how FlowM grew from industrial world-modeling intuition, failed attempts with Minecraft, 3D memory, and SSMs, and a cleaner question about latent memory for hidden dynamics.',
  },
];

/** Render one short-form note with its date, title, and compact summary. */
const InsightItem = ({ item }) => (
  <li className={styles.insightItem}>
    <span className={styles.insightDate}>{item.date}</span>
    <a
      className={styles.insightLink}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.insightTitle}>{item.name}</span>
      <span className={styles.insightTldr}>
        <strong>TL;DR</strong>
        {item.tldr}
      </span>
    </a>
  </li>
);

/** Render the home page section for short posts, notes, and public thoughts. */
const NotesAndInsights = () => {
  const years = useMemo(
    () => Array.from(new Set(insightItems.map((item) => item.year))).sort((a, b) => Number(b) - Number(a)),
    [],
  );
  const [activeYear, setActiveYear] = useState(years[0]);
  const visibleItems = insightItems.filter((item) => item.year === activeYear);

  return (
    <div className={styles.homepageSection}>
      <div className={styles.sectionHeading}>
        <h2>Notes & Thoughts</h2>
        <p>Short posts, ideas, and quick public notes.</p>
      </div>
      <div className={styles.insightToolbar} aria-label="Post years">
        <div className={styles.insightYearPager}>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              className={`${styles.insightYearButton} ${year === activeYear ? styles.insightYearButtonActive : ''}`}
              aria-pressed={year === activeYear}
              onClick={() => setActiveYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
        <span className={styles.insightCount}>
          {visibleItems.length}
          {' '}
          {visibleItems.length === 1 ? 'post' : 'posts'}
        </span>
      </div>
      <ul className={styles.insightList}>
        {visibleItems.map((item) => (
          <InsightItem key={item.url} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default NotesAndInsights;
