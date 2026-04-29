/** Home page experience and education timeline section. */
import React from 'react';

import Utils from '../../../utils/pageUtils';
import { useSiteMetadata } from '../../../utils/hooks';
import * as styles from './homePage.module.less';

const monthIndex = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

/** Convert a timeline date range into a sortable start timestamp. */
const getDateStart = (date = '') => {
  const [start = ''] = date.split(/[-–—~]/);
  const yearMatch = start.match(/\b(20\d{2}|19\d{2})\b/);
  const monthMatch = start
    .toLowerCase()
    .replace(/\./g, '')
    .match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/);
  const year = yearMatch ? Number(yearMatch[1]) : 0;
  const month = monthMatch ? monthIndex[monthMatch[1]] || 0 : 0;

  return year * 12 + month;
};

/** Convert a timeline date range into sortable start and end timestamps. */
const getDateRange = (date = '') => {
  const [start = '', rawEnd = ''] = date.split(/[-–—~]/);
  const end = rawEnd || start;
  const startValue = getDateStart(start);
  const endValue = /present/i.test(end) ? 99999 : getDateStart(end);

  return {
    start: startValue,
    end: endValue || startValue,
  };
};

/** Test whether a smaller timeline item belongs inside an education range. */
const isContainedByEducation = (item, education) => {
  const itemRange = getDateRange(item.date);
  const educationRange = getDateRange(education.date);

  return (
    itemRange.start >= educationRange.start
    && itemRange.start <= educationRange.end
  );
};

/** Render a minimal content block for an internship entry. */
const ExperienceEntryContent = ({ item }) => {
  const titleHtml = Utils.parseMarkDown((item.title || '').trim(), true);
  const meta = [item.location].filter(Boolean).join(' · ');
  const descriptionHtml = item.description
    ? Utils.parseMarkDown(item.description, true)
    : '';

  return (
    <div className={styles.rangeExperienceContent}>
      <div className={styles.rangeExperienceDate}>{item.date}</div>
      <div
        className={styles.rangeExperienceTitle}
        // Links in markdown are intentional in timeline titles.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: titleHtml }}
      />
      {meta ? <div className={styles.rangeExperienceMeta}>{meta}</div> : null}
      {descriptionHtml ? (
        <div
          className={styles.rangeExperienceDescription}
          // Timeline descriptions may include markdown links.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ) : null}
    </div>
  );
};

/** Render an education range and the internships contained in that range. */
const EducationRange = ({ education, experiences }) => {
  const titleHtml = Utils.parseMarkDown((education.title || '').trim(), true);

  return (
    <article className={styles.rangeTimelineGroup}>
      <div className={styles.rangeEducation}>
        <div className={styles.rangeKicker}>Education</div>
        <div className={styles.rangeEducationDate}>{education.date}</div>
        <div
          className={styles.rangeEducationTitle}
          // Education titles can use markdown in site config.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />
        {education.location ? (
          <div className={styles.rangeEducationMeta}>{education.location}</div>
        ) : null}
      </div>
      <div className={styles.rangeRail} aria-hidden="true">
        <span />
      </div>
      <div className={styles.rangeExperiences}>
        {experiences.length > 0 ? experiences.map((item, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.date || 'date'}-${item.title || 'title'}-${index}`}
            className={styles.rangeExperience}
          >
            <ExperienceEntryContent item={item} />
          </div>
        )) : null}
      </div>
    </article>
  );
};

/** Render education ranges with contained internship periods. */
const Experience = () => {
  const siteMetadata = useSiteMetadata();
  const experienceItems = (siteMetadata.experience || [])
    .flatMap((section) => (section.data || []).map((item) => ({
      ...item,
      groupLabel: section.title || 'Experience',
    })));

  const educationItems = (siteMetadata.education || [])
    .filter((item) => item && (item.title || item.location || item.date))
    .sort((a, b) => getDateStart(b.date) - getDateStart(a.date));
  const orphanExperiences = [];
  const educationGroups = educationItems.map((education) => ({
    education,
    experiences: experienceItems
      .filter((item) => item && isContainedByEducation(item, education))
      .sort((a, b) => getDateStart(b.date) - getDateStart(a.date)),
  }));

  experienceItems.forEach((item) => {
    const belongsToEducation = educationItems.some((education) => isContainedByEducation(item, education));
    if (!belongsToEducation) {
      orphanExperiences.push(item);
    }
  });

  if (educationGroups.length === 0 && orphanExperiences.length === 0) {
    return null;
  }

  return (
    <div className={styles.homepageSection}>
      <div className={styles.sectionHeading}>
        <h2>Experience & Education</h2>
      </div>
      <div className={styles.rangeTimeline}>
        {educationGroups.map(({ education, experiences }, index) => (
          <EducationRange
            // eslint-disable-next-line react/no-array-index-key
            key={`${education.date || 'date'}-${education.title || 'education'}-${index}`}
            education={education}
            experiences={experiences}
          />
        ))}
        {orphanExperiences.length > 0 ? (
          <section className={styles.rangeTimelineOrphans}>
            <div className={styles.rangeKicker}>Other Experience</div>
            {orphanExperiences
              .sort((a, b) => getDateStart(b.date) - getDateStart(a.date))
              .map((item, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${item.date || 'date'}-${item.title || 'title'}-${index}`}
                  className={styles.rangeExperience}
                >
                  <ExperienceEntryContent item={item} />
                </div>
              ))}
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default Experience;
