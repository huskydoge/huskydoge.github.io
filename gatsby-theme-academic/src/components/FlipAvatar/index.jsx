/** Click-to-flip avatar component for profile images. */
import classnames from 'classnames';
import React, { useState } from 'react';

import * as style from './flipAvatar.module.less';

/** Render an accessible profile avatar that flips between two images. */
const FlipAvatar = ({
  frontSrc,
  backSrc,
  alt,
  className,
}) => {
  const [flipped, setFlipped] = useState(false);

  if (!backSrc) {
    return <img className={className} src={frontSrc} alt={alt} />;
  }

  return (
    <button
      type="button"
      className={classnames(style.flipAvatar, className, { [style.flipped]: flipped })}
      onClick={() => setFlipped((current) => !current)}
      aria-label="Flip profile avatar"
      aria-pressed={flipped}
      title="Flip avatar"
    >
      <span className={style.flipInner}>
        <img className={`${style.flipImage} ${style.flipFront}`} src={frontSrc} alt={alt} />
        <img className={`${style.flipImage} ${style.flipBack}`} src={backSrc} alt="" aria-hidden="true" />
      </span>
    </button>
  );
};

export default FlipAvatar;
