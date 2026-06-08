/** Shared social icon action that supports normal links and QR-code dialogs. */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { useSiteMetadata } from '../../utils/hooks';
import Utils from '../../utils/pageUtils';
import Icon from '../Icon';

import * as styles from './socialIconLink.module.less';

/** Return the most readable label available for a social destination. */
const getSocialLabel = (social) => social.label || social.title || social.url || 'Social link';

/** Return whether a social URL should open in the current tab. */
const isSameContextUrl = (url) => !url || url.startsWith('#');

/** Return whether a social entry should generate an email action on click. */
const hasEmailParts = (social) => Boolean(social.emailUser && social.emailDomain);

/** Build the email address lazily so it is not present in static HTML. */
const buildEmailAddress = (social) => `${social.emailUser}@${social.emailDomain}`;

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

/** Render a copyable email panel without exposing a direct mailto link. */
const EmailDialog = ({ social, onClose }) => {
  const [copyLabel, setCopyLabel] = useState('Copy');
  const inputRef = useRef(null);
  const label = getSocialLabel(social);
  const emailAddress = buildEmailAddress(social);

  useEffect(() => {
    if (copyLabel !== 'Copied') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopyLabel('Copy'), 1600);
    return () => window.clearTimeout(timeoutId);
  }, [copyLabel]);

  /** Copy the generated email address with the legacy selection fallback. */
  const copyWithSelectionFallback = () => {
    if (!inputRef.current) {
      return false;
    }

    inputRef.current.focus();
    inputRef.current.select();
    return document.execCommand('copy');
  };

  /** Copy the generated email address to the clipboard. */
  const copyEmailAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(emailAddress);
      } else if (!copyWithSelectionFallback()) {
        throw new Error('Clipboard API unavailable');
      }
      setCopyLabel('Copied');
    } catch (error) {
      setCopyLabel(copyWithSelectionFallback() ? 'Copied' : 'Select');
    }
  };

  return (
    <div
      className={styles.wechatQrOverlay}
      role="presentation"
    >
      <button
        type="button"
        className={styles.wechatQrBackdrop}
        aria-label="Close email address"
        onClick={onClose}
      />
      <section
        className={styles.emailPanel}
        role="dialog"
        aria-modal="true"
        aria-label={`${label} address`}
      >
        <button
          type="button"
          className={styles.wechatQrClose}
          aria-label="Close email address"
          onClick={onClose}
        >
          <Icon fixedWidth icon="times" />
        </button>
        <h2 className={styles.wechatQrTitle}>{label}</h2>
        <div className={styles.emailAddressRow}>
          <input
            ref={inputRef}
            className={styles.emailAddressInput}
            type="text"
            value={emailAddress}
            readOnly
            aria-label="Email address"
            onFocus={(event) => event.target.select()}
          />
          <button
            type="button"
            className={styles.emailCopyButton}
            onClick={copyEmailAddress}
          >
            {copyLabel}
          </button>
        </div>
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
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const label = getSocialLabel(social);
  const actionClassName = classNames(styles.socialIconAction, className);

  useEffect(() => {
    if (!isQrVisible && !isEmailVisible) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsQrVisible(false);
        setIsEmailVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQrVisible, isEmailVisible]);

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
    if (hasEmailParts(social)) {
      return (
        <>
          <button
            type="button"
            className={actionClassName}
            aria-label={label}
            data-social-label={label}
            aria-haspopup="dialog"
            aria-expanded={isEmailVisible}
            onClick={() => setIsEmailVisible(true)}
          >
            <Icon fixedWidth size={iconSize} icon={social.icon} />
          </button>
          {isEmailVisible ? (
            <EmailDialog
              social={social}
              onClose={() => setIsEmailVisible(false)}
            />
          ) : null}
        </>
      );
    }

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
