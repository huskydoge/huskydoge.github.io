/** Home page biography section with compact profile links. */
import React from 'react';

import { useSiteMetadata } from '../../../utils/hooks';
import Utils from '../../../utils/pageUtils';
import FlipAvatar from '../../FlipAvatar';
import Icon from '../../Icon';
import * as styles from './homePage.module.less';

/** Render the small action links that sit beside the About heading. */
const QuickLinks = () => (
  <div className={styles.quickLinks}>
    <a
      href="https://twitter.com/intent/follow?screen_name=huskydogewoof"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.quickLink}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
      Twitter
    </a>
    <a
      href="https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Fhuskydoge"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.quickLink}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
      GitHub
    </a>
    <a
      href="/calendar"
      className={styles.quickLink}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
      </svg>
      Calendar
    </a>
  </div>
);

/** Render the local profile block used by the single-column about hero. */
const AboutProfile = ({ siteMetadata }) => (
  <aside className={styles.aboutHeroProfile} aria-label="Profile">
    <FlipAvatar
      className={styles.aboutHeroAvatar}
      frontSrc={Utils.generateFullUrl(siteMetadata, siteMetadata.avatar)}
      backSrc={siteMetadata.avatarBack ? Utils.generateFullUrl(siteMetadata, siteMetadata.avatarBack) : null}
      alt={siteMetadata.authorAlternative || siteMetadata.author}
    />
    <div className={styles.aboutHeroIdentity}>
      <h1>{siteMetadata.authorAlternative || siteMetadata.author}</h1>
    </div>
    <div className={styles.aboutHeroBadges}>
      {siteMetadata.professions.map((profession) => {
        const name = typeof profession === 'string' ? profession : profession.name;
        const url = typeof profession === 'string' ? null : profession.url;
        const content = <span className={styles.aboutHeroBadge}>{name}</span>;
        return url ? (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        ) : (
          <span key={name}>{content}</span>
        );
      })}
    </div>
    <div className={styles.aboutHeroSocial}>
      {siteMetadata.social.map((social, index) => (
        <a
          key={`${social.url}-${index}`}
          href={social.url}
          target={social.url.startsWith('mailto:') ? undefined : '_blank'}
          rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          aria-label={social.url}
        >
          <Icon fixedWidth icon={social.icon} />
        </a>
      ))}
    </div>
    {siteMetadata.location ? (
      <div className={styles.aboutHeroLocation}>
        <Icon size="sm" fixedWidth icon="map-marker-alt" />
        <span>{siteMetadata.location}</span>
      </div>
    ) : null}
  </aside>
);

/** Render the markdown introduction and primary profile destinations. */
const AboutMe = () => {
  const siteMetadata = useSiteMetadata();
  const description = siteMetadata.introduction.join('\n\n');
  const markdown = Utils.parseMarkDown(description);
  // console.log(markdown);
  const aboutCopy = (
    <div className={styles.aboutHeroCopy}>
      <div className={styles.aboutHeader}>
        <h2>About Me</h2>
        <QuickLinks />
      </div>
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: markdown }} />
    </div>
  );

  return (
    <div className={`${styles.homepageSection} ${styles.aboutHeroSection}`}>
      <div className={styles.aboutHeroGrid}>
        <AboutProfile siteMetadata={siteMetadata} />
        {aboutCopy}
      </div>

      {/*      <Row gutter={[20, 20]}>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="location.png"
            height={60}
            alt="location image"
            textH4="Born and bought up in"
            textH3="Mangalore, KA, India"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="coffee.png"
            alt="coffee image"
            textH4="Love Coffee"
            textH3="Coffee + Me = Happiness"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="meeting.png"
            alt="meeting image"
            textH4="Socially Awkward"
            textH3="At times"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="motorcycle.png"
            alt="motorcycle image"
            textH4="Love Riding"
            textH3="Biker for life"
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="web.png"
            alt="web image"
            textH4="Self Taught Programmer"
            textH3="Thanks to the Web Resources"
            height={60}
            width={60}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={8}>
          <AboutTile
            img="graduation.png"
            alt="graduation image"
            textH4="Pursued B.Tech in"
            textH3="Computer Science"
            height={60}
            width={60}
          />
        </Col>
      </Row> */}
    </div>
  );
};
export default AboutMe;
