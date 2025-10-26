import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { graphql } from 'gatsby';
import {
  Input,
  InputGroup,
  Tag as RsuiteTag,
  Stack,
  Button,
  Dropdown,
  Drawer,
  Modal,
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import PlusIcon from '@rsuite/icons/Plus';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import SEO from '../../components/Seo';
import './bookshelf.css';

const TAG_COLORS = [
  { bg: '#FDF2F8', color: '#AD1A72' },
  { bg: '#ECFDF5', color: '#047857' },
  { bg: '#EFF6FF', color: '#1D4ED8' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#EEF2FF', color: '#4338CA' },
  { bg: '#F5F3FF', color: '#6D28D9' },
  { bg: '#FFF7ED', color: '#9A3412' },
];

const MEDIUM_COLORS = {
  'research paper': { bg: '#E0F2FE', color: '#075985' },
  essay: { bg: '#F3E8FF', color: '#6B21A8' },
  book: { bg: '#FEF3C7', color: '#92400E' },
  tweet: { bg: '#DCFCE7', color: '#166534' },
  podcast: { bg: '#F1F5F9', color: '#334155' },
  video: { bg: '#E0F2FE', color: '#1E3A8A' },
  article: { bg: '#FFE4E6', color: '#BE123C' },
  'blog post': { bg: '#FFE4E6', color: '#BE123C' },
  blog: { bg: '#FFE4E6', color: '#BE123C' },
  newsletter: { bg: '#FDE68A', color: '#92400E' },
};

const getTagStyle = (tag) => {
  const hash = [...(tag || '')].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = TAG_COLORS[hash % TAG_COLORS.length];
  return palette || TAG_COLORS[0];
};

const getMediumStyle = (medium) => {
  if (!medium) return null;
  const entry = MEDIUM_COLORS[medium.toLowerCase?.() || medium];
  if (entry) {
    return entry;
  }
  const hash = [...medium].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
};

const formatDate = (value) => {
  if (!value) return '--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const BookshelfPage = ({ data }) => {
  const allBooks = useMemo(
    () => data.allNotionBook.nodes.filter((book) => book.display !== false),
    [data],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('All');
  const sortColumn = 'dateSaved';
  const sortType = 'desc';
  const [filters, setFilters] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  const mediums = useMemo(() => {
    const names = new Set();
    allBooks.forEach((book) => {
      if (book.medium) {
        names.add(book.medium);
      }
    });
    return ['All', ...Array.from(names)];
  }, [allBooks]);

  const filterOptions = useMemo(() => {
    const enjoymentValues = Array.from(
      new Set(allBooks.map((b) => b.enjoyment).filter((val) => val != null)),
    ).sort((a, b) => a - b);
    const importanceValues = Array.from(
      new Set(allBooks.map((b) => b.importance).filter((val) => val != null)),
    ).sort((a, b) => a - b);
    return {
      medium: Array.from(new Set(allBooks.map((b) => b.medium).filter(Boolean))),
      enjoyment: enjoymentValues,
      importance: importanceValues,
      keywords: [...new Set(allBooks.flatMap((b) => b.keywords || []))].sort(),
    };
  }, [allBooks]);

  const addFilter = (type, value) => {
    if (!filters.find((filter) => filter.type === type && filter.value === value)) {
      setFilters((prev) => [...prev, { type, value }]);
    }
  };

  const removeFilter = (index) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFilters = () => {
    setFilters([]);
    setSelectedMedium('All');
  };

  const filteredBooks = useMemo(() => {
    const loweredQuery = searchQuery.trim().toLowerCase();
    let filtered = allBooks.filter((book) => {
      const matchesSearch =
        !loweredQuery ||
        book.title?.toLowerCase().includes(loweredQuery) ||
        book.author?.toLowerCase().includes(loweredQuery) ||
        book.keywords?.some((keyword) => keyword.toLowerCase().includes(loweredQuery));

      const matchesMedium = selectedMedium === 'All' || book.medium === selectedMedium;

      const matchesFilters = filters.every((filter) => {
        switch (filter.type) {
          case 'medium':
            return book.medium === filter.value;
          case 'enjoyment':
            return book.enjoyment === filter.value;
          case 'importance':
            return book.importance === filter.value;
          case 'keywords':
            return book.keywords?.includes(filter.value);
          default:
            return true;
        }
      });

      return matchesSearch && matchesMedium && matchesFilters;
    });

    if (sortColumn && sortType) {
      filtered = filtered.slice().sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        if (sortColumn === 'dateSaved') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue?.toLowerCase() || '';
        }

        if (sortType === 'asc') {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });
    }

    return filtered;
  }, [allBooks, filters, searchQuery, selectedMedium, sortColumn, sortType]);

  useEffect(() => {
    if (selectedBook && !filteredBooks.find((book) => book.notionId === selectedBook.notionId)) {
      setIsDrawerOpen(false);
      setSelectedBook(filteredBooks[0] || null);
    }
  }, [filteredBooks, selectedBook]);

  const getFilterLabel = useCallback((type) => {
    const labels = {
      medium: 'Medium',
      enjoyment: 'Enjoyment',
      importance: 'Importance',
      keywords: 'Keyword',
    };
    return labels[type] || type;
  }, []);

  const handleRowClick = (book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };

  const ScorePill = ({ value }) => (
    <div className={`score-pill ${value == null ? 'is-empty' : ''}`}>
      {value == null ? '—' : value}
    </div>
  );

  const DetailContent = ({ book }) => {
    if (!book) return null;
    return (
      <div className="detail-content">
        <div className="detail-title">{book.title}</div>
        {book.link && (
          <a
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-link"
          >
            🔗 打开原文 ↗
          </a>
        )}

        <div className="detail-meta-grid">
          {book.medium && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">Medium</span>
              <span className="detail-meta-value">{book.medium}</span>
            </div>
          )}
          {book.category && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">Category</span>
              <span className="detail-meta-value">{book.category}</span>
            </div>
          )}
          {book.author && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">Author</span>
              <span className="detail-meta-value">{book.author}</span>
            </div>
          )}
          {book.abbreviation && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">Abbreviation</span>
              <span className="detail-meta-value">{book.abbreviation}</span>
            </div>
          )}
          {book.dateSaved && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">Date Added</span>
              <span className="detail-meta-value">{formatDate(book.dateSaved)}</span>
            </div>
          )}
          <div className="detail-meta-item">
            <span className="detail-meta-label">Enjoyment</span>
            <span className="detail-meta-value">{book.enjoyment ?? '—'}</span>
          </div>
          <div className="detail-meta-item">
            <span className="detail-meta-label">Importance</span>
            <span className="detail-meta-value">{book.importance ?? '—'}</span>
          </div>
        </div>

        {book.notes && (
          <div className="detail-section">
            <h4>TLDR</h4>
            <p>{book.notes}</p>
          </div>
        )}

        {book.twoCents && (
          <div className="detail-section">
            <h4>2¢</h4>
            <p>{book.twoCents}</p>
          </div>
        )}

        {book.keywords?.length > 0 && (
          <div className="detail-section">
            <h4>Tags</h4>
            <div className="detail-tags">
              {book.keywords.map((keyword) => {
                const style = getTagStyle(keyword);
                return (
                  <span
                    key={keyword}
                    className="tag-chip"
                    style={{
                      background: style.bg,
                      color: style.color,
                      borderColor: style.color,
                    }}
                  >
                    {keyword}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Bookshelf"
        description="A collection of reading notes synced with my Notion database."
        path="/bookshelf/"
      />
      <div className="bookshelf-wrapper">
        <div className="bookshelf-hero">
          <h1>📚 Bookshelf</h1>
          <p>精挑细选的阅读笔记，来自我的 Notion Bookshelf。</p>
        </div>

        <div className="bookshelf-toolbar">
          <InputGroup className="bookshelf-search">
            <Input
              placeholder="搜索标题、作者或标签..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>

          <Stack spacing={10} className="bookshelf-medium-tabs" wrap>
            {mediums.map((medium) => (
              <Button
                key={medium}
                size="xs"
                appearance={selectedMedium === medium ? 'primary' : 'ghost'}
                onClick={() => setSelectedMedium(medium)}
              >
                {medium}
              </Button>
            ))}
          </Stack>
        </div>

        <Stack spacing={10} wrap alignItems="center" className="bookshelf-filters">
          {filters.map((filter, index) => (
            <RsuiteTag
              key={`${filter.type}-${filter.value}`}
              closable
              onClose={() => removeFilter(index)}
            >
              {getFilterLabel(filter.type)}: {filter.value}
            </RsuiteTag>
          ))}

          <Dropdown
            title="添加筛选"
            size="xs"
            appearance="ghost"
            renderToggle={(props, ref) => (
              <Button {...props} ref={ref} size="xs" appearance="subtle">
                <PlusIcon /> 筛选
              </Button>
            )}
          >
            <Dropdown.Menu title="Medium">
              {filterOptions.medium.map((value) => (
                <Dropdown.Item key={value} onSelect={() => addFilter('medium', value)}>
                  {value}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            <Dropdown.Menu title="Enjoyment">
              {filterOptions.enjoyment.map((value) => (
                <Dropdown.Item key={value} onSelect={() => addFilter('enjoyment', value)}>
                  {value}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            <Dropdown.Menu title="Importance">
              {filterOptions.importance.map((value) => (
                <Dropdown.Item key={value} onSelect={() => addFilter('importance', value)}>
                  {value}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            <Dropdown.Menu title="Tags" style={{ maxHeight: 320, overflow: 'auto' }}>
              {filterOptions.keywords.slice(0, 80).map((keyword) => (
                <Dropdown.Item key={keyword} onSelect={() => addFilter('keywords', keyword)}>
                  {keyword}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {filters.length > 0 && (
            <Button size="xs" appearance="subtle" onClick={clearFilters}>
              清除全部
            </Button>
          )}

          <span className="bookshelf-count">
            {filteredBooks.length} / {allBooks.length}
          </span>
        </Stack>

        <div className="bookshelf-table">
          <div className="bookshelf-header-row">
            <div>Title</div>
            <div>Category</div>
            <div>Medium</div>
            <div>Enjoy</div>
            <div>Importance</div>
            <div>Tags</div>
          </div>
          <div>
            {filteredBooks.length === 0 && (
              <div className="bookshelf-table-empty">暂无匹配的条目</div>
            )}
            {filteredBooks.map((book) => {
              const isActive = selectedBook?.notionId === book.notionId;
              const mediumStyle = getMediumStyle(book.medium || '');
              return (
                <div
                  key={book.notionId}
                  className={`bookshelf-row ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleRowClick(book)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') handleRowClick(book);
                  }}
                >
                  <div className="bookshelf-cell-title">
                    {book.link ? (
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bookshelf-link"
                      >
                        {book.title}
                      </a>
                    ) : (
                      <span className="bookshelf-title-text">{book.title}</span>
                    )}
                    {book.author && <span className="bookshelf-author">{book.author}</span>}
                  </div>
                  <div>
                    {book.category && (
                      <span className="medium-chip" style={{ opacity: 0.85 }}>
                        {book.category}
                      </span>
                    )}
                  </div>
                  <div>
                    {book.medium && (
                      <span
                        className="medium-chip"
                        style={mediumStyle || {}}
                      >
                        {book.medium}
                      </span>
                    )}
                  </div>
                  <div>
                    <ScorePill value={book.enjoyment} />
                  </div>
                  <div>
                    <ScorePill value={book.importance} />
                  </div>
                  <div className="tag-collection">
                    {book.keywords?.slice(0, 6).map((keyword) => {
                      const style = getTagStyle(keyword);
                      return (
                        <span
                          key={keyword}
                          className="tag-chip"
                          style={{
                            background: style.bg,
                            color: style.color,
                            borderColor: style.color,
                          }}
                        >
                          {keyword}
                        </span>
                      );
                    })}
                    {book.keywords?.length > 6 && (
                      <span className="tag-chip" style={{ background: 'transparent', color: '#7a7061' }}>
                        +{book.keywords.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Drawer
          placement="right"
          size="md"
          open={isDrawerOpen && !!selectedBook}
          onClose={() => setIsDrawerOpen(false)}
        >
          <Drawer.Header>
            <div className="detail-drawer-header">
              <Drawer.Title>{selectedBook?.title}</Drawer.Title>
              <Button
                size="xs"
                appearance="subtle"
                onClick={() => setIsFullViewOpen(true)}
              >
                <ExpandOutlineIcon style={{ marginRight: 6 }} /> 放大查看
              </Button>
            </div>
          </Drawer.Header>
          <Drawer.Body>
            <DetailContent book={selectedBook} />
          </Drawer.Body>
        </Drawer>

        <Modal
          open={isFullViewOpen}
          onClose={() => setIsFullViewOpen(false)}
          size="lg"
          full
        >
          <Modal.Header>
            <Modal.Title>{selectedBook?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DetailContent book={selectedBook} />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export const query = graphql`
  query {
    allNotionBook(sort: { fields: dateSaved, order: DESC }) {
      nodes {
        notionId
        title
        author
        category
        medium
        enjoyment
        importance
        link
        notes
        twoCents
        keywords
        dateSaved
        abbreviation
        display
      }
    }
  }
`;

export default BookshelfPage;
