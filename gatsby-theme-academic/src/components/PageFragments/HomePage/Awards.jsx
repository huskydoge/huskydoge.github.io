/** Home page awards timeline with mobile-safe title rows. */
import { Col, Row, FlexboxGrid } from 'rsuite';
import React, { useState } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline';

import { useSiteMetadata } from '../../../utils/hooks';
import Icon from '../../Icon';

import * as styles from './homePage.module.less';

/** Render one award entry with a wrapping title and date. */
const AwardItem = ({ title: awardTitle, date, iconSize, icon }) => {
  const title = (
    <FlexboxGrid className={styles.awardTitleGrid} justify="space-between">
      <FlexboxGrid.Item className={styles.awardTitleText} as={Col} xs={24} sm={17} md={16} lg={17}>
        <h6>{awardTitle}</h6>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item className={styles.awardDate} as={Col} xs={24} sm={7} md={8} lg={7}>
        {date}
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
  return (
    <TimelineEvent
      title={title}
      style={{
        paddingBottom: '0.1rem',
        paddingTop: '0.3rem',
        color: 'var(--app-text-secondary)',
      }}
      icon={<Icon size={iconSize || 'lg'} fixedWidth icon={icon || 'award'} />}
      iconStyle={{ cursor: 'default', background: 'rgba(232, 166, 139, 0.18)', borderRadius: 'var(--app-radius-sm)' }}
      iconColor="#d68d6b"
      // bubbleStyle={{ background: 'none', border: '0' }}
    />
  );
};

/** Build a stable key for awards that do not carry an explicit id. */
const getAwardKey = award => `${award.date || 'undated'}-${award.title}`;

/** Render visible awards and the optional collapsed older-awards group. */
const Awards = () => {
  const siteMetadata = useSiteMetadata();
  const [showHidden, setShowHidden] = useState(false);
  
  // Separate visible and hidden awards
  const visibleAwards = siteMetadata.awards.filter(award => award.show === true);
  const hiddenAwards = siteMetadata.awards.filter(award => award.show === false);
  
  const hasHiddenAwards = hiddenAwards.length > 0;
  

  
  return (
    <div className={styles.homepageSection}>
      <h2 style={{ marginBottom: '0rem' }}>Awards & Scholarships</h2>
      <Row>
        <Col xs={24} style={{ marginBottom: '0.1rem' }}>

          
          <Timeline lineStyle={{ display: 'none' }} style={{ width: '100%', marginBottom: '0rem', paddingBottom: '0rem' }}>
            {visibleAwards.map(award => (
              <AwardItem key={getAwardKey(award)} {...award} />
            ))}
          </Timeline>
          
          {/* Toggle button for hidden awards */}
          {hasHiddenAwards && (
            <div className={styles.awardsDivider}>
              <button
                onClick={() => setShowHidden(!showHidden)}
                className={styles.awardsToggleButton}
              >
                <Icon 
                  icon={showHidden ? 'chevron-up' : 'chevron-down'} 
                  style={{ fontSize: '14px' }} 
                />
                {showHidden ? 'Close' : ``}
              </button>
            </div>
          )}
          
          {/* Hidden awards section with smooth animation */}
          {hasHiddenAwards && (
            <div 
              className={styles.hiddenAwardsContainer}
              style={{
                maxHeight: showHidden ? '500px' : '0px',
                opacity: showHidden ? 1 : 0,
                marginTop: showHidden ? '0.5rem' : '0',
              }}
            >
              <Timeline lineStyle={{ display: 'none' }} style={{ width: '100%' }}>
                {hiddenAwards.map(award => (
                  <AwardItem key={getAwardKey(award)} {...award} />
                ))}
              </Timeline>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Awards;
