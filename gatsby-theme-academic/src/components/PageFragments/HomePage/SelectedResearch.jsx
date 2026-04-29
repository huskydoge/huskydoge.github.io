/** Home page list of selected research works. */
import { Col, FlexboxGrid } from 'rsuite';
import { useStaticQuery, graphql } from 'gatsby';
import _ from 'lodash';
import React from 'react';

import ResearchCard from '../../ResearchCard';

import * as styles from './homePage.module.less';

/** Query and render highlighted research cards in priority order. */
const SelectedResearch = () => {
  const data = useStaticQuery(graphql`
  {
    allTag {
      edges {
        node {
          name
          color
          path
        }
      }
    }
    allMdx(
      filter: { 
        fileAbsolutePath: { regex: "/research\/.*\/index\\.mdx?$/" }
        frontmatter: { 
          selected: { eq: true } 
          draft: { ne: true }
        }
      }
      sort: { fields: [frontmatter___priority, frontmatter___title], order: ASC }
    ) {
      edges {
        node {
          frontmatter {
            cover {
              publicURL
            }
            date
            venue
            authors
            path
            title
            tags
            excerpt
            selected
            priority
            highlight
            links {
              name
              url
            }
          }
          fileAbsolutePath
        }
      }
    }
  }
`);

  const tags = data.allTag ? data.allTag.edges : [];
  const tagsMap = _.mapValues(_.keyBy(tags, (tag) => tag.node.name), 'node');
  return (data.allMdx && data.allMdx.edges && data.allMdx.edges.length) ? (
    <div className={styles.homepageSection}>
      <div className={styles.sectionHeading}>
        <h2>Selected Works</h2>
        <p>See the <a href="/research">Research page</a> for the complete list.</p>
      </div>
      <FlexboxGrid className="spacing-grid">
        {data.allMdx &&
          data.allMdx.edges.map((val, key) => (
            <FlexboxGrid.Item
              key={val.node.frontmatter.path || key}
              as={Col}
              xs={24}
              sm={24}
              md={24}
              lg={24}
            >
              <ResearchCard data={val} tagsMap={tagsMap} />
            </FlexboxGrid.Item>
          ))}
      </FlexboxGrid>
    </div>
  ) : (
    <></>
  );
};

export default SelectedResearch;
