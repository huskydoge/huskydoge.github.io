import { Row, Col } from 'rsuite';
import React from 'react';
import * as styles from './homePage.module.less';


const News = () => (
    <div className={styles.homepageSection}>
        <h2>News</h2>
        <Row gutter={[20, 20]} type="flex">
            <Col xs={24}>
                <ul style={{ paddingLeft: '1.2em', fontSize: '1rem' }}>
                    <li>
                        2025/05: <strong>DCA-Bench</strong> has been accepted to <strong>KDD 2025</strong> DB-Track as an <strong>oral paper</strong>! See you in Toronto 🎉
                    </li>
                </ul>
            </Col>
        </Row>
    </div>
);

export default News;
