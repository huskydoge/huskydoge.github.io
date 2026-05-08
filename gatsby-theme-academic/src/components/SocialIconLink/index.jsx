/** Shared social icon action that supports normal links and QR-code dialogs. */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { useSiteMetadata } from '../../utils/hooks';
import Utils from '../../utils/pageUtils';
import Icon from '../Icon';

import * as styles from './socialIconLink.module.less';

/** Return the most readable label available for a social destination. */
const getSocialLabel = (social) => social.label || social.title || social.url || 'Social link';

/** Return whether a social URL should open in the current tab. */
const isSameContextUrl = (url) => !url || url.startsWith('mailto:') || url.startsWith('#');

/** Render the modal QR-code panel for scan-only social destinations. */
const QrDialog = ({ social, onClose }) => {
  const siteMetadata = useSiteMetadata();
  const label = getSocialLabel(social);
  const qrSrc = Utils.generateFullUrl(siteMetadata, social.qrImage);

  return (
    <div
      className={styles.wechatQrOverlay}
      role="presentation"
    >
      <button
        type="button"
        className={styles.wechatQrBackdrop}
        aria-label="Close WeChat QR code"
        onClick={onClose}
      />
      <section
        className={styles.wechatQrPanel}
        role="dialog"
        aria-modal="true"
        aria-label={`${label} QR code`}
      >
        <button
          type="button"
          className={styles.wechatQrClose}
          aria-label="Close WeChat QR code"
          onClick={onClose}
        >
          <Icon fixedWidth icon="times" />
        </button>
        <h2 className={styles.wechatQrTitle}>{label}</h2>
        <img
          className={styles.wechatQrImage}
          src={qrSrc}
          alt={`${label} QR code`}
        />
      </section>
    </div>
  );
};

/** Render one social icon as either an anchor or a QR-code trigger. */
const SocialIconLink = ({
  social,
  iconSize,
  className,
}) => {
  const [isQrVisible, setIsQrVisible] = useState(false);
  const label = getSocialLabel(social);
  const actionClassName = classNames(styles.socialIconAction, className);

  useEffect(() => {
    if (!isQrVisible) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsQrVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQrVisible]);

  if (social.qrImage) {
    return (
      <>
        <button
          type="button"
          className={actionClassName}
          aria-label={label}
          aria-haspopup="dialog"
          aria-expanded={isQrVisible}
          data-social-label={label}
          onClick={() => setIsQrVisible(true)}
        >
          <Icon fixedWidth size={iconSize} icon={social.icon} />
        </button>
        {isQrVisible ? (
          <QrDialog
            social={social}
            onClose={() => setIsQrVisible(false)}
          />
        ) : null}
      </>
    );
  }

  if (!social.url) {
    return null;
  }

  if (isSameContextUrl(social.url)) {
    return (
      <a
        className={actionClassName}
        href={social.url}
        aria-label={label}
        data-social-label={label}
      >
        <Icon fixedWidth size={iconSize} icon={social.icon} />
      </a>
    );
  }

  return (
    <a
      className={actionClassName}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-social-label={label}
    >
      <Icon fixedWidth size={iconSize} icon={social.icon} />
    </a>
  );
};

export default SocialIconLink;
