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
        <span className={style.flipFace}>
          <img className={style.flipImage} src={frontSrc} alt={alt} />
        </span>
        <span className={`${style.flipFace} ${style.flipBack}`} aria-hidden="true">
          <img className={style.flipImage} src={backSrc} alt="" />
        </span>
      </span>
    </button>
  );
};

export default FlipAvatar;
