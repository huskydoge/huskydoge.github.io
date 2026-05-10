/** Click-to-cycle avatar component for profile images. */
import classnames from 'classnames';
import React, { useState } from 'react';

import * as style from './flipAvatar.module.less';

/** Return the configured avatar sources while preserving the legacy two-image API. */
const getAvatarSources = (imageSrcs, frontSrc, backSrc) => {
  const configuredSources = Array.isArray(imageSrcs) && imageSrcs.length
    ? imageSrcs
    : [frontSrc, backSrc];

  return configuredSources.filter(Boolean);
};

/** Render an accessible profile avatar that cycles through one or more images. */
const FlipAvatar = ({
  frontSrc,
  backSrc,
  imageSrcs,
  alt,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const avatarSources = getAvatarSources(imageSrcs, frontSrc, backSrc);
  const visibleIndex = avatarSources.length ? activeIndex % avatarSources.length : 0;

  if (avatarSources.length <= 1) {
    return <img className={className} src={avatarSources[0] || frontSrc} alt={alt} />;
  }

  return (
    <button
      type="button"
      className={classnames(style.flipAvatar, className)}
      onClick={() => setActiveIndex((current) => (current + 1) % avatarSources.length)}
      aria-label="Show next profile avatar"
      title="Show next avatar"
    >
      <span className={style.flipInner}>
        {avatarSources.map((src, index) => (
          <img
            key={`${src}-${index}`}
            className={classnames(style.flipImage, {
              [style.activeImage]: index === visibleIndex,
            })}
            src={src}
            alt={index === visibleIndex ? alt : ''}
            aria-hidden={index !== visibleIndex}
          />
        ))}
      </span>
    </button>
  );
};

export default FlipAvatar;
