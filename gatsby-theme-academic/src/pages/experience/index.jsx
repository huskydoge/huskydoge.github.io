import React from 'react';
import { Timeline } from 'react-event-timeline';

import SEO from '../../components/Seo';
import ExperienceTimeline from '../../components/ExperienceTimeline';
import { useSiteMetadata } from '../../utils/hooks';
import TimelineItem from '../../components/TimelineItem';

const Experience = () => {
  const siteMetadata = useSiteMetadata();
  const experienceSections = (siteMetadata.experience || [])
    .filter((section) => (section.data || []).length > 0);

  const previousTimeLineData = (siteMetadata.education || []).slice(0, (siteMetadata.education || []).length - 1);
  const lastTimeLineData = (siteMetadata.education || []).slice((siteMetadata.education || []).length - 1);

  return (
    <>
      <SEO
        title="Experience"
        description="This page consists of various Tags on various technologies that I'll be using
          to write blogs. You can check the blogs related to the tags by clicking on any of the tags below."
        path="experience"
      />
      <div className="marginTopTitle">
        <h1 className="titleSeparate">Experience</h1>
      </div>
      {experienceSections.map((section, idx) => (
        <section
          // eslint-disable-next-line react/no-array-index-key
          key={`${section.title || 'section'}-${idx}`}
          style={{ marginTop: idx === 0 ? 0 : '2.2rem' }}
        >
          {section.title ? (
            <h2 style={{ margin: '0 0 1rem 0', color: 'var(--app-text-primary)' }}>
              {section.title}
            </h2>
          ) : null}
          <ExperienceTimeline
            items={(section.data || []).map((item) => ({
              ...item,
              subtitle: item.subtitle,
              description: item.description,
            }))}
          />
        </section>
      ))}

      <div className="marginTopTitle" style={{ marginTop: '3rem' }}>
        <h1 className="titleSeparate">Education</h1>
      </div>
      <div>
        {(siteMetadata.education || []).length > 1
          ? (
            <Timeline
              lineStyle={{ top: '20px' }}
              lineColor="rgba(31, 31, 31, 0.18)"
              style={{ width: '100%' }}
            >
              {previousTimeLineData.map(TimelineItem)}
            </Timeline>
          ) : null}
        {(siteMetadata.education || []).length > 0
          ? (
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
      </div>
    </>
  );
};

export default Experience;
