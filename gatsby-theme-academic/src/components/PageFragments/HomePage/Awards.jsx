import { Col, Row, FlexboxGrid, Button } from 'rsuite';
import React, { useState } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline';

import { useSiteMetadata } from '../../../utils/hooks';
import Icon from '../../Icon';

import * as styles from './homePage.module.less';

const AwardItem = (data) => {
  const title = (
    <FlexboxGrid justify="space-between">
      <FlexboxGrid.Item as={Col} md={12} lg={15}>
        <h6>{data.title}</h6>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item as={Col} md={12} lg={9} style={{ fontSize: '12pt' }}>
        {data.date}
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
      icon={<Icon size={data.iconSize || 'lg'} fixedWidth icon={data.icon || 'award'} />}
      iconStyle={{ cursor: 'default', background: 'rgba(232, 166, 139, 0.18)', borderRadius: 'var(--app-radius-sm)' }}
      iconColor="#d68d6b"
      // bubbleStyle={{ background: 'none', border: '0' }}
    />
  );
};

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
            {visibleAwards.map(AwardItem)}
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
                {hiddenAwards.map(AwardItem)}
              </Timeline>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Awards;
