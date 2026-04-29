import React from 'react';

import Utils from '../../utils/pageUtils';

import * as styles from './experienceTimeline.module.less';

const defaultJoin = (parts) => parts.filter(Boolean).join(' · ');

/**
 * Timeline-style list for Experience entries.
 *
 * Expected item shape (all optional except `date`/`title` are recommended):
 * {
 *   date: string,
 *   title: string (markdown supported),
 *   location?: string,
 *   subtitle?: string,
 *   description?: string (markdown supported)
 * }
 */
const ExperienceTimeline = ({ items = [], metaJoiner = defaultJoin }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`${styles.timeline} ${items.length === 1 ? styles.singleTimeline : ''}`}>
      {items.map((item, idx) => {
        const titleHtml = Utils.parseMarkDown((item.title || '').trim(), true);
        const descriptionHtml = item.description
          ? Utils.parseMarkDown(item.description, true)
          : '';
        const meta = metaJoiner([item.subtitle, item.location]);

        return (
          <article
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.date || 'date'}-${item.title || 'title'}-${idx}`}
            className={styles.item}
          >
            <div className={styles.date}>{(item.date || '').trim()}</div>

            <div className={styles.axis} aria-hidden="true">
              <span className={styles.dot} />
            </div>

            <div className={styles.content}>
              <div
                className={styles.title}
                // Links in markdown are intended here.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: titleHtml }}
              />
              {meta ? <div className={styles.meta}>{meta}</div> : null}
              {descriptionHtml ? (
                <div
                  className={styles.description}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ExperienceTimeline;
