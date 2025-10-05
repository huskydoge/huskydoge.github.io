import React, { useMemo } from 'react';
import { Button, ButtonToolbar } from 'rsuite';
import { Link } from 'gatsby';
import MasonryGallery from '@/components/MasonryGallery';
import SEO from '@/components/Seo';
import { getMiscData } from '@/utils/miscData';

const items = getMiscData().photos;

export default function PhotosPage({ location }) {
  const tag = useMemo(() => new URLSearchParams(location.search).get('tag'), [location.search]);
  const filtered = useMemo(() => {
    if (!tag) return items;
    return items.filter((it) => (it.tags || []).includes(tag));
  }, [tag]);

  return (
    <>
      <SEO title="Photos" description="Snapshots and frames that caught my eye." path="misc/photos" />
      <div className="marginTopTitle">
        <h1 className="titleSeparate">Photos</h1>
        <ButtonToolbar style={{ marginTop: '0.5rem' }}>
          <Link to="/misc/"><Button appearance="subtle">← Back to Misc</Button></Link>
          {tag ? <Link to="/misc/photos/"><Button appearance="ghost">Clear tag: {tag}</Button></Link> : null}
        </ButtonToolbar>
      </div>
      <MasonryGallery items={filtered} />
    </>
  );
}


