import React, { useMemo, useState } from 'react';
import { Modal, Tag, FlexboxGrid } from 'rsuite';
import { navigate } from 'gatsby';
import * as style from './masonry.module.less';

/**
 * MasonryGallery renders a responsive masonry grid for visual items.
 * Clicking an item opens a modal with detailed information.
 */
const MasonryGallery = ({ items = [], sectionTitle, showMeta = true }) => {
  const [selected, setSelected] = useState(null);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
  }, [items]);

  const ratioToPadding = (ratio) => {
    switch (ratio) {
      case '1x1':
      case 'square':
        return '100%';
      case '16x9':
        return '56.25%';
      case '4x5':
        return '125%';
      case '3x4':
        return '133.33%';
      case '5x4':
        return '80%';
      default:
        return '56.25%';
    }
  };

  return (
    <div className={style.wrapper}>
      {sectionTitle ? (
        <div className="marginTopTitle">
          <h2 className="titleSeparate">{sectionTitle}</h2>
        </div>
      ) : null}

      <div className={style.masonry}>
        {sortedItems.map((item, idx) => (
          <article
            key={`${item.title || 'item'}-${idx}`}
            className={style.card}
            onClick={() => setSelected(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setSelected(item);
            }}
          >
            <div className={style.imageWrap} style={{ paddingTop: ratioToPadding(item.ratio) }}>
              {item.type === 'pdf' ? (
                <>
                  <iframe className={style.media} src={item.src} title={item.title} />
                  <div className={style.pdfBadge}>PDF</div>
                </>
              ) : (
                <img className={style.media} src={item.image} alt={item.title || 'gallery item'} loading="lazy" />
              )}
            </div>
            {showMeta ? (
              <div className={style.metaOverlay}>
                <div className={style.title}>{item.title}</div>
                {item.tags && item.tags.length ? (
                  <div className={style.tags} onClick={(e) => e.stopPropagation()}>
                    {item.tags.map((t) => (
                      <Tag
                        key={t}
                        size="sm"
                        className={style.tag}
                        onClick={() => navigate(`${window.location.pathname}?tag=${encodeURIComponent(t)}`)}
                      >
                        {t}
                      </Tag>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} size="lg" overflow>
        {selected ? (
          <>
            <Modal.Header>
              <Modal.Title>{selected.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FlexboxGrid>
                <FlexboxGrid.Item colspan={24} style={{ marginBottom: '1rem' }}>
                  <img
                    className={style.modalImage}
                    src={selected.image}
                    alt={selected.title || 'selected item'}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={24}>
                  {selected.tags && selected.tags.length ? (
                    <div style={{ marginBottom: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                      {selected.tags.map((t) => (
                        <Tag
                          key={t}
                          size="sm"
                          className={style.tag}
                          onClick={() => navigate(`${window.location.pathname}?tag=${encodeURIComponent(t)}`)}
                        >
                          {t}
                        </Tag>
                      ))}
                    </div>
                  ) : null}
                  {selected.date ? (
                    <div style={{ color: 'var(--rs-text-secondary)' }}>
                      {new Date(selected.date).toLocaleDateString()}
                    </div>
                  ) : null}
                  {selected.description ? (
                    <p style={{ marginTop: '0.75rem' }}>{selected.description}</p>
                  ) : null}
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </Modal.Body>
          </>
        ) : null}
      </Modal>
    </div>
  );
};

export default MasonryGallery;


