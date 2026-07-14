/** Minimal site footer with contact identity and social destinations. */
import React, { useEffect, useRef } from 'react';

import { useSiteMetadata } from '../../../utils/hooks';
import SocialIconLink from '../../SocialIconLink';

import * as styles from './footer.module.less';

const VISITOR_MAP_SRC = [
  'https://mapmyvisitors.com/map.js?cl=ffffff&w=a&t=n',
  '&d=kSjXsVwrxvK-nD9lnu4jzabJKRSwpsNTQlJDNnAmDRA',
].join('');

/** Return the best email parts from site metadata or social links. */
const getEmailParts = (siteMetadata) => {
  if (siteMetadata.email) {
    const [user, domain] = siteMetadata.email.split('@');
    return user && domain ? { user, domain } : null;
  }

  const emailSocial = siteMetadata.social.find((social) => social.emailUser && social.emailDomain);
  return emailSocial ? { user: emailSocial.emailUser, domain: emailSocial.emailDomain } : null;
};

/** Convert email parts into a low-scrape display string. */
const formatEmailDisplay = (emailParts) => {
  if (!emailParts) {
    return null;
  }

  return `${emailParts.user} [at] ${emailParts.domain.replace(/\./g, ' [dot] ')}`;
};

/** Render the global footer in a compact identity plus social-links layout. */
export default () => {
  const siteMetadata = useSiteMetadata();
  const emailDisplay = formatEmailDisplay(getEmailParts(siteMetadata));
  const visitorMapRef = useRef(null);

  useEffect(() => {
    const visitorMap = visitorMapRef.current;
    const script = window.document.createElement('script');

    script.id = 'mapmyvisitors';
    script.type = 'text/javascript';
    script.src = VISITOR_MAP_SRC;
    visitorMap.appendChild(script);

    return () => {
      visitorMap.textContent = '';
    };
  }, []);

  return (
    <footer className={styles.footerShell}>
      <div className={styles.footerIdentity}>
        <strong>{siteMetadata.authorAlternative || siteMetadata.author}</strong>
        {emailDisplay ? <span>{emailDisplay}</span> : null}
      </div>
      <div
        ref={visitorMapRef}
        className={styles.visitorMap}
        role="region"
        aria-label="Visitor map"
      />
      <nav className={styles.footerSocials} aria-label="Social links">
        {siteMetadata.social.map((social) => (
          <SocialIconLink
            key={social.label || social.url || social.qrImage}
            social={social}
            iconSize="sm"
            className={styles.footerSocialAction}
          />
        ))}
      </nav>
    </footer>
  );
};
