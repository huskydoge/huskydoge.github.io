import { Container, Button, ButtonGroup, FlexboxGrid, Col } from 'rsuite';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import _ from 'lodash';

import Footer from '../../components/PageLayout/Footer';
import Header from '../../components/PageLayout/Header';
import SidebarWrapper from '../../components/PageLayout/Sidebar';
import Panel from '../../components/Panel';
import SEO from '../../components/Seo';
import ResearchCard from '../../components/ResearchCard';

const Research = ({ data }) => {
  const [viewMode, setViewMode] = useState('date'); // 'date' or 'tag'
  
  // Define the specific tags to display in tag view (in preferred order)
  const displayTags = [
    'World Model',
    'LLM Agent',
    'AI Interpretability',
    'Benchmark',
  ];
  
  // Create tagsMap like Panel component does
  const tags = data.allTag ? data.allTag.edges : [];
  const tagsMap = _.mapValues(_.keyBy(tags, (tag) => tag.node.name), 'node');
  
  // Process research data
  const researchData = useMemo(() => {
    const research = data.allMdx.edges; // Keep the full edge structure
    
    if (viewMode === 'date') {
      // Group by year
      const groupedByYear = research.reduce((acc, edge) => {
        const year = new Date(edge.node.frontmatter.date).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(edge);
        return acc;
      }, {});
      
      // Sort by year (descending) and within each year by date (descending)
      const sortedYears = Object.keys(groupedByYear)
        .sort((a, b) => parseInt(b) - parseInt(a));
      
      sortedYears.forEach(year => {
        groupedByYear[year].sort((a, b) => 
          new Date(b.node.frontmatter.date) - new Date(a.node.frontmatter.date)
        );
      });
      
      return { type: 'date', groups: groupedByYear, sortedKeys: sortedYears };
    } else {
      // Group by tags - only include specified display tags
      const groupedByTag = research.reduce((acc, edge) => {
        const tags = edge.node.frontmatter.tags || [];
        tags.forEach(tag => {
          // Only include tags that are in our displayTags list
          if (displayTags.includes(tag)) {
            if (!acc[tag]) {
              acc[tag] = [];
            }
            acc[tag].push(edge);
          }
        });
        return acc;
      }, {});
      
      // Use displayTags order instead of alphabetical, but only include tags that have research
      const sortedTags = displayTags.filter(tag => groupedByTag[tag] && groupedByTag[tag].length > 0);
      
      sortedTags.forEach(tag => {
        groupedByTag[tag].sort((a, b) => 
          new Date(b.node.frontmatter.date) - new Date(a.node.frontmatter.date)
        );
      });
      
      return { type: 'tag', groups: groupedByTag, sortedKeys: sortedTags };
    }
  }, [data.allMdx.edges, viewMode]);

  return (
    <>
      <SEO
        title="Research"
        description="My research focuses on generative world modeling, data-centric AI, and efficient machine learning. I explore how AI systems can simulate complex environments, curate high-quality datasets, and operate effectively in real-time scenarios with long-sequence modeling capabilities."
        path="research"
      />
      <div className="marginTopTitle">
        <h1 className="titleSeparate">Research</h1>
        
        {/* View mode toggle */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <ButtonGroup>
            <Button
              appearance={viewMode === 'date' ? 'primary' : 'default'}
              onClick={() => setViewMode('date')}
            >
              By Year
            </Button>
            <Button
              appearance={viewMode === 'tag' ? 'primary' : 'default'}
              onClick={() => setViewMode('tag')}
            >
              By Tag
            </Button>
          </ButtonGroup>
        </div>
        
        {/* Render grouped content */}
        <FlexboxGrid>
          {researchData.sortedKeys.map(key => (
            <FlexboxGrid.Item key={key} colspan={24} style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1.5rem',
                borderBottom: '2px solid #e0e0e0',
                paddingBottom: '0.5rem'
              }}>
                {researchData.type === 'date' ? key : key}
              </h2>
              <FlexboxGrid>
                {researchData.groups[key].map((edge, index) => (
                  <FlexboxGrid.Item as={Col} key={index} xs={24} sm={24} md={24} lg={24} style={{ marginBottom: '1rem' }}>
                    <ResearchCard data={edge} tagsMap={tagsMap} enableHighlight={true} />
                  </FlexboxGrid.Item>
                ))}
              </FlexboxGrid>
            </FlexboxGrid.Item>
          ))}
        </FlexboxGrid>
      </div>
    </>
  );
};

Research.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
};

export const query = graphql`
  {
    allTag(
      sort: { fields: [count], order: DESC },
      filter: { research: { eq: true } }
    ) {
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
      }
      sort: { fields: [frontmatter___priority, frontmatter___title], order: ASC }
    ) {
      edges {
        node {
          frontmatter {
            cover {
              childImageSharp {
                fluid(maxWidth: 320, maxHeight: 180, fit: CONTAIN, background: "rgba(0,0,0,0)") {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
                large: fluid(maxWidth: 1920, maxHeight: 1080, quality: 95, fit: CONTAIN, background: "rgba(0,0,0,0)") {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
            date
            venue
            authors
            path
            title
            tags
            excerpt
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
`;

export default Research;
