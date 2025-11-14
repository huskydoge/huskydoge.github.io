import { Button, FlexboxGrid, Col, Stack } from 'rsuite';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import _ from 'lodash';

import SEO from '../../components/Seo';
import ResearchCard from '../../components/ResearchCard';

const Research = ({ data }) => {
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set());

  const tags = data.allTag ? data.allTag.edges : [];
  const tagsMap = _.mapValues(_.keyBy(tags, (tag) => tag.node.name), 'node');
  const researchEdges = data.allMdx.edges;

  const parseYear = (value) => {
    if (value === null || value === undefined) {
      return 'Unknown';
    }

    if (typeof value === 'number') {
      return value.toString();
    }

    const numericFromString = Number(value);
    if (!Number.isNaN(numericFromString) && value.toString().length <= 4) {
      return numericFromString.toString();
    }

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.getFullYear().toString();
    }

    return 'Unknown';
  };

  const getComparableDate = (value) => {
    if (value === null || value === undefined) {
      return new Date(0);
    }

    if (typeof value === 'number') {
      return new Date(`${value}-01-01T00:00:00Z`);
    }

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

    const numericFromString = Number(value);
    if (!Number.isNaN(numericFromString)) {
      return new Date(`${numericFromString}-01-01T00:00:00Z`);
    }

    return new Date(0);
  };

  const availableYears = useMemo(() => {
    const yearSet = new Set();
    researchEdges.forEach((edge) => {
      yearSet.add(parseYear(edge.node.frontmatter.date));
    });
    const years = Array.from(yearSet).filter((year) => year !== 'Unknown');
    years.sort((a, b) => Number(b) - Number(a));
    if (yearSet.has('Unknown')) {
      years.push('Unknown');
    }
    return years;
  }, [researchEdges]);

  const availableTags = useMemo(() => (
    tags.map((tag) => tag.node.name)
  ), [tags]);

  const filteredResearch = useMemo(() => {
    const yearFilterActive = selectedYears.size > 0;
    const tagFilterActive = selectedTags.size > 0;

    return researchEdges
      .filter((edge) => {
        const { frontmatter } = edge.node;
        const year = parseYear(frontmatter.date);
        const entryTags = frontmatter.tags || [];

        if (yearFilterActive && !selectedYears.has(year)) {
          return false;
        }

        if (tagFilterActive) {
          for (const tag of selectedTags) {
            if (!entryTags.includes(tag)) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => getComparableDate(b.node.frontmatter.date) - getComparableDate(a.node.frontmatter.date));
  }, [researchEdges, selectedYears, selectedTags]);

  const groupedResearch = useMemo(() => {
    const groups = filteredResearch.reduce((acc, edge) => {
      const year = parseYear(edge.node.frontmatter.date);
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(edge);
      return acc;
    }, {});

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return Number(b) - Number(a);
    });

    return { groups, sortedKeys };
  }, [filteredResearch]);

  const handleYearToggle = (year) => {
    if (year === 'All') {
      setSelectedYears(new Set());
      return;
    }

    setSelectedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const handleTagToggle = (tag) => {
    if (tag === 'All') {
      setSelectedTags(new Set());
      return;
    }

    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const renderFilterRow = (label, options, selectedSet, onToggle, includeAll = true) => (
    <div style={{ marginBottom: '1rem' }}>
      <Stack spacing={12} alignItems="center" wrap>
        <strong style={{ minWidth: '3.5rem' }}>{label}</strong>
        <Stack spacing={8} wrap>
          {includeAll && (
            <Button
              appearance={selectedSet.size === 0 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToggle('All')}
            >
              All
            </Button>
          )}
          {options.map((option) => (
            <Button
              key={option}
              appearance={selectedSet.has(option) ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToggle(option)}
            >
              {option}
            </Button>
          ))}
        </Stack>
      </Stack>
    </div>
  );

  return (
    <>
      <SEO
        title="Research"
        description="My research focuses on generative world modeling, data-centric AI, and efficient machine learning. I explore how AI systems can simulate complex environments, curate high-quality datasets, and operate effectively in real-time scenarios with long-sequence modeling capabilities."
        path="research"
      />
      <div className="marginTopTitle">
        <h1 className="titleSeparate">Research</h1>

        <div style={{ marginBottom: '2rem' }}>
          {renderFilterRow('Year', availableYears, selectedYears, handleYearToggle)}
          {renderFilterRow('Tag', availableTags, selectedTags, handleTagToggle)}
        </div>

        {groupedResearch.sortedKeys.length === 0 ? (
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            borderRadius: 'var(--app-radius, 12px)',
            border: '1px solid var(--app-border, #e0e0e0)',
            background: 'var(--app-panel-bg, #f9f9f9)',
            color: 'var(--app-text-secondary, #777)',
          }}>
            No research entries match the selected filters yet. Try adjusting the year or tag filters to explore more work.
          </div>
        ) : (
          <FlexboxGrid>
            {groupedResearch.sortedKeys.map((key) => (
              <FlexboxGrid.Item key={key} colspan={24} style={{ marginBottom: '3rem' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1.5rem',
                  borderBottom: '2px solid #e0e0e0',
                  paddingBottom: '0.5rem',
                }}>
                  {key}
                </h2>
                <FlexboxGrid>
                  {groupedResearch.groups[key].map((edge, index) => (
                    <FlexboxGrid.Item
                      as={Col}
                      key={`${key}-${index}`}
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{ marginBottom: '1rem' }}
                    >
                      <ResearchCard data={edge} tagsMap={tagsMap} enableHighlight />
                    </FlexboxGrid.Item>
                  ))}
                </FlexboxGrid>
              </FlexboxGrid.Item>
            ))}
          </FlexboxGrid>
        )}
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
              publicURL
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
