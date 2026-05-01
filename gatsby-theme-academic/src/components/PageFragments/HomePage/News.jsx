/** Compact home page news feed. */
import React from 'react';
import * as styles from './homePage.module.less';


/** Render the home page news feed. */
const News = () => (
    <div className={styles.homepageSection}>
        <div className={styles.sectionHeading}>
            <h2>News</h2>
        </div>
        <ul className={styles.newsList}>
            <li className={styles.newsItem}>
                <span className={styles.newsDate}>
                    2026/04
                </span>
                <div className={`${styles.newsContent} ${styles.newsContentGrouped}`}>
                    <ul className={styles.newsContentList}>
                        <li>
                            Two papers (<strong>EqR</strong> and <strong>FloWM</strong>) are accepted to <strong>ICML 2026</strong>. See you in Seoul!
                        </li>
                        <li>
                            <strong><a href="https://github.com/huskydoge/Awesome-Loop-Models">Awesome Loop Models</a></strong> is released: a curated list and interactive browser for loop-model papers and technical blogs.
                        </li>
                    </ul>
                </div>
            </li>
            <li className={styles.newsItem}>
                <span className={styles.newsDate}>
                    2026/01
                </span>
                <div className={styles.newsContent}>
                    The code of <strong><a href="https://github.com/hlillemark/flowm">Flow Equivariant World Models</a></strong> is released.
                </div>
            </li>
            <li className={styles.newsItem}>
                <span className={styles.newsDate}>
                    2025/11
                </span>
                <div className={styles.newsContent}>
                    Tech report of <strong><a href="https://panworld.ai/">PAN World Model</a></strong> is released.
                </div>
            </li>
            <li className={styles.newsItem}>
                <span className={styles.newsDate}>
                    2025/07
                </span>
                <div className={styles.newsContent}>
                    <strong><a href="https://blog.dynamicslab.ai/">Magica</a>, a Generative World Engine, </strong> is now available online.
                </div>
            </li>
            <li className={styles.newsItem}>
                <span className={styles.newsDate}>
                    2025/05
                </span>
                <div className={styles.newsContent}>
                    <strong>DCA-Bench</strong> has been accepted to <strong>KDD 2025</strong> DB-Track as an <strong>oral paper</strong>.
                </div>
            </li>
        </ul>
    </div>
);

export default News;
