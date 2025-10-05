import React, { useMemo } from 'react';
import { Button, ButtonToolbar } from 'rsuite';
import { Link } from 'gatsby';
import MasonryGallery from '@/components/MasonryGallery';
import SEO from '@/components/Seo';
import { getMiscData } from '@/utils/miscData';

const items = getMiscData().animations;

export default function AnimationsPage({ location }) {
  const tag = useMemo(() => new URLSearchParams(location.search).get('tag'), [location.search]);
  const filtered = useMemo(() => {
    if (!tag) return items;
    return items.filter((it) => (it.tags || []).includes(tag));
  }, [tag]);

  return (
    <>
      <SEO title="Animation / Movies" description="Works that inspire my visual and narrative sense." path="misc/animations" />
      <div className="marginTopTitle">
        <h1 className="titleSeparate">Animation / Movies</h1>
        <ButtonToolbar style={{ marginTop: '0.5rem' }}>
          <Link to="/misc/"><Button appearance="subtle">← Back to Misc</Button></Link>
          {tag ? <Link to="/misc/animations/"><Button appearance="ghost">Clear tag: {tag}</Button></Link> : null}
        </ButtonToolbar>
      </div>
      <MasonryGallery items={filtered} />
    </>
  );
}


