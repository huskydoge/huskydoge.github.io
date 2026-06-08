/** Minimal site footer with contact identity and social destinations. */
import React from 'react';

import { useSiteMetadata } from '../../../utils/hooks';
import SocialIconLink from '../../SocialIconLink';

import * as styles from './footer.module.less';

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

  return (
    <footer className={styles.footerShell}>
      <div className={styles.footerIdentity}>
        <strong>{siteMetadata.authorAlternative || siteMetadata.author}</strong>
        {emailDisplay ? <span>{emailDisplay}</span> : null}
      </div>
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
