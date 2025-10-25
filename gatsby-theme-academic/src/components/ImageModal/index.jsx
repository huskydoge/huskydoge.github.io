import React from 'react';
import { Modal } from 'rsuite';
import Img from 'gatsby-image';

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
      overflow={false}
    >
      <Modal.Body className={style.modalBody}>
        <div 
          className={style.imageContainer}
          onClick={onClose}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClose();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <Img fluid={fluid} alt={title} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;
