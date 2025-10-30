import { Row, Col } from 'rsuite';
import React from 'react';
import * as styles from './homePage.module.less';


const News = () => (
    <div className={styles.homepageSection}>
        <h2>News</h2>
        <Row gutter={[20, 20]} type="flex">
            <Col xs={24}>
                <ul style={{ 
                    paddingLeft: '0.4em', 
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    listStyle: 'none'
                }}>
                    <li className={styles.newsItem}>
                        <span className={styles.newsDate}>
                            2025/07
                        </span>
                        <span className={styles.newsContent}>
                            <strong><a href="https://blog.dynamicslab.ai/">Magica</a>, a Generative World Engine, </strong> is now available online! 🎉
                        </span>
                    </li>
                    <li className={styles.newsItem}>
                        <span className={styles.newsDate}>
                            2025/05
                        </span>
                        <span className={styles.newsContent}>
                            <strong>DCA-Bench</strong> has been accepted to <strong>KDD 2025</strong> DB-Track as an <strong>oral paper</strong>! See you in Toronto 🎉
                        </span>
                    </li>
                </ul>
            </Col>
        </Row>
    </div>
);

export default News;
