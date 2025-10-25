import React from 'react';
import { Modal } from 'rsuite';

import * as style from './imageModal.module.less';

const ImageModal = ({ open, onClose, fluid, title }) => {
  if (!fluid) return null;

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      className={style.imageModal} 
      size="lg" 
      backdrop="static"
    >
      <Modal.Body className={style.modalBody}>
        <button 
          type="button"
          className={style.imageButton}
          onClick={onClose}
        >
          <img
            src={fluid.src}
            srcSet={fluid.srcSet}
            sizes={fluid.sizes}
            alt={title}
            loading="lazy"
          />
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;
