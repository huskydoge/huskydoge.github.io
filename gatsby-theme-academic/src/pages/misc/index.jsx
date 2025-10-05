import React, { useMemo } from 'react';
import { Col, FlexboxGrid, Panel } from 'rsuite';
import { Link } from 'gatsby';
import MasonryGallery from '@/components/MasonryGallery';
import SEO from '@/components/Seo';
import { getMiscData } from '@/utils/miscData';

// Content placeholders intentionally empty. Example item shape:
// {
//   title: 'Title',
//   image: '/path.png', // or: type: 'pdf', src: '/file.pdf'
//   ratio: '16x9' | '4x5' | '3x4' | '5x4' | '1x1',
//   tags: ['tag1', 'tag2'],
//   description: 'Optional description',
//   date: '2025-01-01'
// }
const photos = [];
const cooks = [];
const animations = [];

const SectionPanel = ({ title, children }) => (
  <Panel bordered className="cursor-default" style={{ margin: '20px 5px', padding: '0px' }} header={<h3>{title}</h3>}>
    <div style={{ padding: '12px 16px' }}>
      {children}
    </div>
  </Panel>
);

const Misc = () => {
  const heroTitle = useMemo(() => 'Misc', []);
  const heroDesc = useMemo(() => 'In my leisure time, you will probably find me watching animations and pet videos; recently I have also been trying to cook some dishes and travel around.', []);

  return (
    <>
      <SEO title="Misc" description={heroDesc} path="misc" />
      <div className="marginTopTitle">
        <h1 className="titleSeparate">{heroTitle}</h1>
        <p style={{ color: '#000', marginTop: '0.75rem', fontSize: '1.125rem' }}>
          {heroDesc}
          {' '}
          I used to be obsessed with many games, including
          {' '}
          <a href="https://overwatch.blizzard.com/" target="_blank" rel="noreferrer">Overwatch</a>,
          {' '}
          <a href="https://hearthstone.blizzard.com/" target="_blank" rel="noreferrer">Hearthstone</a>,
          {' '}
          <a href="https://www.honorofkings.com/" target="_blank" rel="noreferrer">Honor of Kings</a>,
          {' '}
          and
          {' '}
          <a href="https://www.megacrit.com/" target="_blank" rel="noreferrer">Slay the Spire</a>
          ; but now I do not know why I have become less interested in games (maybe I am getting old now 🥸).
        </p>
      </div>

      <FlexboxGrid gutter={24} style={{ marginBottom: '2rem' }}>
        <FlexboxGrid.Item as={Col} xs={24} md={8}>
          <Link to="/misc/photos/" style={{ textDecoration: 'none' }}>
            <SectionPanel title="📸 Photos">
              <MasonryGallery items={getMiscData().photos.slice(0, 6)} showMeta={false} />
            </SectionPanel>
          </Link>
        </FlexboxGrid.Item>
        {/* <FlexboxGrid.Item as={Col} xs={24} md={8}>
          <Link to="/misc/cooks/" style={{ textDecoration: 'none' }}>
            <SectionPanel title="🍳 Cooks">
              <MasonryGallery items={getMiscData().cooks.slice(0, 6)} showMeta={false} />
            </SectionPanel>
          </Link>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item as={Col} xs={24} md={8}>
          <Link to="/misc/animations/" style={{ textDecoration: 'none' }}>
            <SectionPanel title="🎬 Animation / Movies">
              <MasonryGallery items={getMiscData().animations.slice(0, 6)} showMeta={false} />
            </SectionPanel>
          </Link>
        </FlexboxGrid.Item> */}
      </FlexboxGrid>
    </>
  );
};

export default Misc;


