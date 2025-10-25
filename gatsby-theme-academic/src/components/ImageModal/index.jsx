import React, { useEffect, useCallback } from 'react';
import * as style from './imageModal.module.less';

const ImageModal = ({ open, onClose, fluid, title }) => {
  const escListener = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    document.addEventListener('keydown', escListener);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', escListener);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, escListener]);

  if (!open || !fluid) return null;

  return (
    <div
      className={style.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      tabIndex={-1}
    >
      <div
        className={style.content}
        role="presentation"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={style.closeButton}
          onClick={onClose}
          aria-label="Close image preview"
        >
          ×
        </button>
        <div className={style.imageContainer}>
          <img
            src={fluid.src}
            srcSet={fluid.srcSet}
            sizes={fluid.sizes}
            alt={title}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
