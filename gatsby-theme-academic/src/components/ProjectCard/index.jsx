// import moment from 'moment';
// import { Link } from 'gatsby';
// import { navigate } from '@reach/router';
import classnames from 'classnames';
import Img from 'gatsby-image';
import isRelativeUrl from 'is-relative-url';
import React, { useState } from 'react';
import {
  Row, Col, Panel, Button, FlexboxGrid, Divider, Stack,
} from 'rsuite';

import { useSiteMetadata, useWindowSize } from '../../utils/hooks';
import Utils from '../../utils/pageUtils';
import PostTag from '../PostTag';
import Icon from '../Icon';
import ImageModal from '../ImageModal';

import * as style from './projectCard.module.less';

const ProjectCard = (props) => {
  const {
    data: { node },
    tagsMap,
  } = props;
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [width] = useWindowSize();
  const isMobile = width < 768;
  
  const {
    frontmatter: {
      title,
      authors,
      excerpt,
      path,
      date,
      tags,
      venue,
      cover,
      links,
    },
  } = node;
  const publicURL = cover && cover.publicURL ? cover.publicURL : null;
  const isGif = publicURL && publicURL.toLowerCase().endsWith('.gif');
  const hasImageSharp = cover && cover.childImageSharp && !isGif;
  const fluid = hasImageSharp ? cover.childImageSharp.fluid : null;
  const largeFluid = hasImageSharp && cover.childImageSharp.large ? cover.childImageSharp.large : fluid;
  // console.log(fluid);

  const siteMetadata = useSiteMetadata();
  const url = Utils.resolvePageUrl(path);
  // const handleClick = (e) => {
  //   const tagName = e.target.tagName.toLowerCase();
  //   if (tagName !== 'a' && tagName !== 'span' && url) {
  //     window.location.href = Utils.generateFullUrl(siteMetadata, url);
  //     // navigate(url);
  //   }
  // };

  const generateLink = (link) => {
    let href = '#';
    if (link.url) {
      if (isRelativeUrl(link.url)) {
        href = Utils.generateFullUrl(siteMetadata, link.url);
      } else {
        href = link.url;
      }
    }
    
    // Parse icon from name if it starts with an icon format
    let iconElement = null;
    let displayName = link.name;
    
    if (link.icon) {
      // Direct icon specification
      iconElement = <Icon icon={link.icon} fixedWidth style={{ marginRight: '0.25rem' }} />;
    } else if (typeof link.name === 'string') {
      // Auto-detect icons based on link name
      const lowerName = link.name.toLowerCase().trim();
      
      if (lowerName.includes('github')) {
        iconElement = <Icon icon={['fab', 'github']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName === 'hugging face' || lowerName === 'huggingface' || lowerName === 'hf') {
        // Use a custom emoji or symbol for Hugging Face since FontAwesome doesn't have it
        iconElement = <span style={{ marginRight: '0.25rem', fontSize: '0.9em' }}>🤗</span>;
        displayName = link.name.trim();
      } else if (lowerName === 'arxiv' || lowerName.includes('paper')) {
        iconElement = <Icon icon={['fas', 'file-alt']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('code') || lowerName.includes('source')) {
        iconElement = <Icon icon={['fas', 'code']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('demo') || lowerName.includes('website')) {
        iconElement = <Icon icon={['fas', 'external-link-alt']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('slides') || lowerName.includes('presentation')) {
        iconElement = <Icon icon={['fas', 'presentation']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('poster')) {
        iconElement = <Icon icon={['fas', 'image']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      } else if (lowerName.includes('video')) {
        iconElement = <Icon icon={['fas', 'play-circle']} fixedWidth style={{ marginRight: '0.25rem' }} />;
        displayName = link.name.trim();
      }
    }
    
    return (
      <Button appearance="ghost" href={href} target="_blank" size="xs">
        {iconElement}{displayName}
      </Button>
    );
  };

  const generateAuthor = (author, index) => {
    let markdown = Utils.parseMarkDown(author, true);
    if (index >= 0 && index !== authors.length - 1) {
      markdown += ',&nbsp;';
    }
    return (
      <FlexboxGrid.Item key={index} xs>
        <span dangerouslySetInnerHTML={{ __html: markdown }} />
      </FlexboxGrid.Item>
    );
  };

  let infoLine = [];
  if (date) {
    infoLine = infoLine.concat([
      <div key="date">
        {Utils.formatDate(date)}
      </div>,
    ]);
  }
  if (venue) {
    infoLine = infoLine.concat([
      <div key="venue">
        <span>{venue}</span>
      </div>,
    ]);
  }
  if (tags) {
    infoLine = infoLine.concat([
      <Stack wrap key="tags">
        {tags.map(
          (tag) => (tagsMap[tag] ? <PostTag key={`tag-${tag}`} tag={tagsMap[tag]} /> : null),
        )}
      </Stack>,
    ]);
  }

  const excerptHTML = Utils.parseMarkDown(Utils.trimExcerpt(excerpt), true);

  // Image component
  const imageSection = (fluid || publicURL) ? (
    <FlexboxGrid.Item 
      as={Col} 
      xs={24} 
      sm={24} 
      md={12} 
      lg={8} 
      style={isMobile ? { marginTop: '1rem', paddingTop: '0.5rem' } : {}}
    >
      <div 
        className={style.imageWrapper}
        onClick={() => setImageModalOpen(true)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setImageModalOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
      >
        {fluid ? (
          <Img fluid={fluid} />
        ) : publicURL ? (
          <img
            src={publicURL}
            alt={title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
            }}
            loading="lazy"
          />
        ) : <div className={style.postCardImg} />}
      </div>
      <ImageModal 
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        fluid={largeFluid}
        publicURL={publicURL}
        title={title}
      />
    </FlexboxGrid.Item>
  ) : null;

  // Content section
  const contentSection = (
    <FlexboxGrid.Item as={Col} xs={24} sm={24} md={12} lg={16}>
      <h5><a href={Utils.generateFullUrl(siteMetadata, url)}>{title}</a></h5>
      <FlexboxGrid>
        {authors ? authors.map(generateAuthor) : null}
      </FlexboxGrid>
      <Stack wrap divider={<Divider vertical className={style.divider} />} style={{ marginTop: '0.5rem'}}>
        {infoLine}
      </Stack>
      <a href={Utils.generateFullUrl(siteMetadata, url)}>
        <p style={{ marginTop: isMobile ? '0.5rem' : '1rem' }} dangerouslySetInnerHTML={{ __html: excerptHTML }} />
      </a>
      {links && links.length ? (
        <Stack wrap spacing={6} style={{ marginTop: isMobile ? '0.5rem' : '1rem', marginBottom: isMobile ? '0.5rem' : '0' }}>
          {links.map(generateLink) }
        </Stack>
      ) : null}
    </FlexboxGrid.Item>
  );

  return (
    <Panel
      className={classnames(style.projectCard, 'cursor-default')}
      style={{ padding: isMobile ? '0.5rem' : '0.8rem' }}
      // hoverable
      bordered
    >
      <FlexboxGrid gutter={8} align="middle">
        {/* On mobile: content first (title, links), then image below. On desktop: content left, image right */}
        {contentSection}
        {imageSection}
      </FlexboxGrid>
    </Panel>
  );
};

export default ProjectCard;
