import React from 'react';
import { Timeline } from 'react-event-timeline';
import { Row, Col } from 'rsuite';

import { useSiteMetadata } from '../../../utils/hooks';
import IconListItem from '../../IconListItem';
import TimelineItem from '../../TimelineItem';

import * as styles from './homePage.module.less';

const generateInterest = (data) => (
  <IconListItem icon={data.icon} size="lg" title={data.title} />
);

const Experience = () => {
  const siteMetadata = useSiteMetadata();
  const previousTimeLineData = siteMetadata.education.slice(0, siteMetadata.education.length - 1);
  const lastTimeLineData = siteMetadata.education.slice(siteMetadata.education.length - 1);

  return (
    <div className={styles.homepageSection}>
      {/* First section for Education */}
      <Row type="flex" style={{ marginBottom: '2rem' }}>
        <Col xs={24}>
          <h2 style={{ marginBottom: '0' }}>Education</h2>
          {siteMetadata.education.length > 1 ? (
            <Timeline lineStyle={{ top: '20px' }} lineColor="#44566C" style={{ width: '100%' }}>
              {previousTimeLineData.map(TimelineItem)}
            </Timeline>
          ) : null}
          {siteMetadata.education.length > 0 ? (
            <Timeline
              lineStyle={{ display: 'none' }}
              style={{
                top: '-30px',
                width: '100%',
              }}
            >
              {lastTimeLineData.map(TimelineItem)}
            </Timeline>
          ) : null}
        </Col>
      </Row>

      {/* Second section for Interests */}
      <Row type="flex">
        <Col xs={24}>
          <h2 style={{ marginBottom: '0.8rem' }} className="interests">Interests</h2>
          <div>
            {siteMetadata.interests.map(generateInterest)}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Experience;
