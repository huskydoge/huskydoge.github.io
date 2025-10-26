import React, { useEffect, useMemo, useRef, useState } from 'react';
import { graphql } from 'gatsby';
import { Input, InputGroup, Stack, Button, Drawer, Modal } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import SEO from '../../components/Seo';
import 'katex/dist/katex.min.css';
import './bookshelf.css';
import remark from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const TAG_COLORS = [
  { bg: '#FDF2F8', color: '#AD1A72' },
  { bg: '#ECFDF5', color: '#047857' },
  { bg: '#EFF6FF', color: '#1D4ED8' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#EEF2FF', color: '#4338CA' },
  { bg: '#F5F3FF', color: '#6D28D9' },
  { bg: '#FFF7ED', color: '#9A3412' },
];

const SORT_FIELDS = [
  { value: 'dateSaved', label: 'Date Added' },
  { value: 'title', label: 'Title' },
  { value: 'medium', label: 'Medium' },
  { value: 'enjoyment', label: 'Enjoyment' },
  { value: 'importance', label: 'Importance' },
];

const SORT_ORDERS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const FilterIcon = (props) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
    <path
      d="M2.5 3h9m-7 4h5m-3 4h1"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortIcon = (props) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
    <path
      d="M4 2.5h6m-4 3h4m-2 3h2m-1.5 3v-6m0 6-2 2m2-2 2 2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

const truncateText = (text, maxLength = 160) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
};

const escapeHtml = (value) =>
  (typeof value === 'string' ? value : String(value))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const markdownProcessor = remark()
  .use(remarkGfm)
  .use(remarkHtml, { sanitize: false })
  .freeze();

const renderMarkdownToHtml = (value) => {
  if (!value) return '';
  const normalized = typeof value === 'string' ? value : String(value);
  try {
    return String(markdownProcessor.processSync(normalized));
  } catch (error) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('Failed to render markdown content', error);
    }
    return escapeHtml(normalized);
  }
};

const MarkdownBlock = ({ content, className }) => {
  const containerRef = useRef(null);
  const html = useMemo(() => renderMarkdownToHtml(content), [content]);

  if (!content || !html) {
    return null;
  }

  useEffect(() => {
    let isCancelled = false;
    const node = containerRef.current;
    if (!node) return;

    const mountMath = async () => {
      try {
        const module = await import('katex/contrib/auto-render');
        if (isCancelled || !containerRef.current) return;
        const renderMathInElement = module.default || module;
        renderMathInElement(node, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
          ],
          throwOnError: false,
        });
      } catch (error) {
        if (typeof console !== 'undefined' && console.error) {
          console.error('Failed to render math content', error);
        }
      }
    };

    mountMath();

    return () => {
      isCancelled = true;
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const coerceFilterValue = (type, rawValue) => {
  if (rawValue === '' || rawValue == null) return null;
  if (type === 'enjoyment' || type === 'importance') {
    const parsed = Number(rawValue);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return rawValue;
};

const compareValues = (column, aValue, bValue) => {
  if (column === 'dateSaved') {
    const aTime = aValue ? new Date(aValue).getTime() : 0;
    const bTime = bValue ? new Date(bValue).getTime() : 0;
    if (aTime === bTime) return 0;
    return aTime > bTime ? 1 : -1;
  }

  if (typeof aValue === 'number' || typeof bValue === 'number') {
    const aNum = aValue ?? -Infinity;
    const bNum = bValue ?? -Infinity;
    if (aNum === bNum) return 0;
    return aNum > bNum ? 1 : -1;
  }

  const aText = (aValue ?? '').toString().toLowerCase();
  const bText = (bValue ?? '').toString().toLowerCase();
  if (aText === bText) return 0;
  return aText > bText ? 1 : -1;
};

const FilterPanel = ({
  open,
  anchorRef,
  filters,
  filterOptions,
  onApply,
  onClose,
}) => {
  const panelRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [draftFilters, setDraftFilters] = useState(filters);

  const filterTypeConfig = useMemo(
    () => ({
      medium: { label: 'Medium', options: filterOptions.medium },
      enjoyment: { label: 'Enjoyment', options: filterOptions.enjoyment },
      importance: { label: 'Importance', options: filterOptions.importance },
      keywords: { label: 'Tag', options: filterOptions.keywords },
    }),
    [filterOptions],
  );

  const canAddFilter = useMemo(
    () => Object.values(filterTypeConfig).some((config) => config.options.length),
    [filterTypeConfig],
  );

  useEffect(() => {
    if (!open) return;
    setDraftFilters(filters);
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
      });
    }
  }, [open, filters, anchorRef]);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open) {
    return null;
  }

  const getDefaultType = () => {
    const available = Object.entries(filterTypeConfig).filter(([, config]) => config.options.length);
    if (available.length > 0) {
      return available[0][0];
    }
    return 'medium';
  };

  const getOptionsForType = (type) => filterTypeConfig[type]?.options || [];

  const handleTypeChange = (index, nextType) => {
    setDraftFilters((prev) => {
      const options = getOptionsForType(nextType);
      const defaultValue = coerceFilterValue(nextType, options[0] ?? null);
      const copy = [...prev];
      copy[index] = { type: nextType, value: defaultValue };
      return copy;
    });
  };

  const handleValueChange = (index, nextValue) => {
    setDraftFilters((prev) => {
      const copy = [...prev];
      const type = copy[index].type;
      copy[index] = { ...copy[index], value: coerceFilterValue(type, nextValue) };
      return copy;
    });
  };

  const handleAddFilter = () => {
    const type = getDefaultType();
    const options = getOptionsForType(type);
    const value = coerceFilterValue(type, options[0] ?? null);
    setDraftFilters((prev) => [...prev, { type, value }]);
  };

  const handleRemove = (index) => {
    setDraftFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    const normalized = draftFilters.filter((filter) =>
      filter.value !== null && filter.value !== undefined && filter.value !== '',
    );
    onApply(normalized);
    onClose();
  };

  const handleClearAll = () => {
    setDraftFilters([]);
    onApply([]);
    onClose();
  };

  const typeEntries = Object.entries(filterTypeConfig);

  return (
    <div ref={panelRef} className="floating-panel" style={{ top: position.top, left: position.left }}>
      <div className="panel-header">
        <span className="panel-title">Filters</span>
        <span className="panel-subtitle">Only display items matching these rules.</span>
      </div>
      <div className="panel-body">
        {draftFilters.length === 0 && (
          <div className="panel-empty">No filters applied.</div>
        )}
        {draftFilters.map((filter, index) => {
          const options = getOptionsForType(filter.type);
          return (
            <div className="panel-row" key={`${filter.type}-${index}`}>
              <select
                className="panel-select"
                value={filter.type}
                onChange={(event) => handleTypeChange(index, event.target.value)}
              >
                {typeEntries.map(([value, config]) => (
                  <option value={value} key={value}>
                    {config.label}
                  </option>
                ))}
              </select>
              <select
                className="panel-select"
                value={filter.value ?? ''}
                onChange={(event) => handleValueChange(index, event.target.value)}
              >
                <option value="">Select...</option>
                {options.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button type="button" className="panel-remove" onClick={() => handleRemove(index)}>
                Remove
              </button>
            </div>
          );
        })}
      </div>
      <div className="panel-footer">
        <button
          type="button"
          className="panel-add"
          onClick={handleAddFilter}
          disabled={!canAddFilter}
        >
          + Add filter
        </button>
        <div className="panel-actions">
          <button type="button" className="panel-link" onClick={handleClearAll}>
            Clear all
          </button>
          <button type="button" className="panel-link" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="panel-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const SortPanel = ({ open, anchorRef, sorts, onApply, onClose }) => {
  const panelRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [draftSorts, setDraftSorts] = useState(sorts);

  useEffect(() => {
    if (!open) return;
    setDraftSorts(sorts);
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
      });
    }
  }, [open, sorts, anchorRef]);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open) {
    return null;
  }

  const handleFieldChange = (index, nextField) => {
    setDraftSorts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], column: nextField };
      return copy;
    });
  };

  const handleOrderChange = (index, nextOrder) => {
    setDraftSorts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], order: nextOrder };
      return copy;
    });
  };

  const handleAddSort = () => {
    const defaultField = SORT_FIELDS[0]?.value || 'dateSaved';
    setDraftSorts((prev) => [...prev, { column: defaultField, order: 'desc' }]);
  };

  const handleRemove = (index) => {
    setDraftSorts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    const normalized = draftSorts.length
      ? draftSorts
      : [{ column: 'dateSaved', order: 'desc' }];
    onApply(normalized);
    onClose();
  };

  const handleClearAll = () => {
    const reset = [{ column: 'dateSaved', order: 'desc' }];
    setDraftSorts(reset);
    onApply(reset);
    onClose();
  };

  return (
    <div ref={panelRef} className="floating-panel" style={{ top: position.top, left: position.left }}>
      <div className="panel-header">
        <span className="panel-title">Sorts</span>
        <span className="panel-subtitle">Order the list using priority rules.</span>
      </div>
      <div className="panel-body">
        {draftSorts.map((sort, index) => (
          <div className="panel-row" key={`${sort.column}-${index}`}>
            <select
              className="panel-select"
              value={sort.column}
              onChange={(event) => handleFieldChange(index, event.target.value)}
            >
              {SORT_FIELDS.map((field) => (
                <option value={field.value} key={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
            <select
              className="panel-select"
              value={sort.order}
              onChange={(event) => handleOrderChange(index, event.target.value)}
            >
              {SORT_ORDERS.map((order) => (
                <option value={order.value} key={order.value}>
                  {order.label}
                </option>
              ))}
            </select>
            {draftSorts.length > 1 && (
              <button type="button" className="panel-remove" onClick={() => handleRemove(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="panel-footer">
        <button
          type="button"
          className="panel-add"
          onClick={handleAddSort}
          disabled={draftSorts.length >= 3}
        >
          + Add sort
        </button>
        <div className="panel-actions">
          <button type="button" className="panel-link" onClick={handleClearAll}>
            Reset
          </button>
          <button type="button" className="panel-link" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="panel-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const BookshelfPage = ({ data }) => {
  // Debug log
  if (typeof window !== 'undefined') {
    console.log('BookshelfPage data:', data);
  }

  // Early return if data is not available
  if (!data || !data.allNotionBook || !data.allNotionBook.nodes) {
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
            <p>Loading your library...</p>
          </div>
        </div>
      </>
    );
  }

  const allBooks = useMemo(
    () => data.allNotionBook.nodes.filter((book) => book.display !== false),
    [data],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('All');
  const [filters, setFilters] = useState([]);
  const [sorts, setSorts] = useState([{ column: 'dateSaved', order: 'desc' }]);
  const [viewMode, setViewMode] = useState('table');
  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFilterPanelOpen(false);
        setIsSortPanelOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const activeFilters = useMemo(
    () => filters.filter((filter) =>
      filter.value !== null && filter.value !== undefined && filter.value !== '',
    ),
    [filters],
  );

  const prioritizedSorts = useMemo(
    () => (sorts.length ? sorts : [{ column: 'dateSaved', order: 'desc' }]),
    [sorts],
  );

  const activeFilterCount = activeFilters.length;

  const sortSummary = useMemo(() => {
    if (!prioritizedSorts.length) {
      return 'Date Added · Desc';
    }
    const [primary, ...rest] = prioritizedSorts;
    const field = SORT_FIELDS.find((item) => item.value === primary.column);
    const fieldLabel = field?.label || primary.column;
    const directionLabel = primary.order === 'asc' ? 'Asc' : 'Desc';
    const suffix = rest.length ? ` (+${rest.length})` : '';
    return `${fieldLabel} · ${directionLabel}${suffix}`;
  }, [prioritizedSorts]);

  const filteredBooks = useMemo(() => {
    const loweredQuery = searchQuery.trim().toLowerCase();
    let filtered = allBooks.filter((book) => {
      const matchesSearch =
        !loweredQuery ||
        book.title?.toLowerCase().includes(loweredQuery) ||
        book.author?.toLowerCase().includes(loweredQuery) ||
    book.keywords?.some((keyword) => keyword.toLowerCase().includes(loweredQuery));

      const matchesMedium = selectedMedium === 'All' || book.medium === selectedMedium;

      const matchesFilters = activeFilters.every((filter) => {
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

    const sorted = filtered.slice().sort((a, b) => {
      for (const sortRule of prioritizedSorts) {
        const column = sortRule.column;
        const order = sortRule.order === 'asc' ? 1 : -1;
        const comparison = compareValues(column, a[column], b[column]);
        if (comparison !== 0) {
          return comparison * order;
        }
      }
      return 0;
    });

    return sorted;
  }, [allBooks, activeFilters, prioritizedSorts, searchQuery, selectedMedium]);

  useEffect(() => {
    if (selectedBook && !filteredBooks.find((book) => book.notionId === selectedBook.notionId)) {
      setIsDrawerOpen(false);
      setSelectedBook(filteredBooks[0] || null);
    }
  }, [filteredBooks, selectedBook]);

  const handleRowClick = (book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };

  const ScorePill = ({ value }) => (
    <div className={`score-pill ${value == null ? 'is-empty' : ''}`}>
      {value == null ? '—' : value}
    </div>
  );

  const ScoreBadge = ({ label, value }) => (
    <div className="score-badge">
      <span className="score-badge-label">{label}</span>
      <span className="score-badge-value">{value ?? '—'}</span>
    </div>
  );

  const DetailContent = ({ book }) => {
    if (!book) return null;
    const hasNotes = !!book.notes?.trim();
    const hasTwoCents = !!book.twoCents?.trim();
    return (
      <div className="detail-content">
        {book.link ? (
          <a
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-title detail-title-link"
          >
            {book.title}
          </a>
        ) : (
          <div className="detail-title">{book.title}</div>
        )}

        <div className="detail-meta-grid">
          {book.medium && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">Medium</span>
              <span className="detail-meta-value">{book.medium}</span>
            </div>
          )}
          {book.author && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">Author</span>
              <span className="detail-meta-value">{book.author}</span>
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

        {hasNotes && (
          <div className="detail-section">
            <h4>TLDR</h4>
            <MarkdownBlock content={book.notes} className="detail-markdown" />
          </div>
        )}

        {hasTwoCents && (
          <div className="detail-section">
            <h4>2¢</h4>
            <MarkdownBlock content={book.twoCents} className="detail-markdown" />
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
        {!hasNotes && !hasTwoCents && (
          <div className="detail-section">
            <p className="bookshelf-muted">No summary yet.</p>
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
          <p>Curated reading notes synced from my Notion database.</p>
        </div>

        <div className="bookshelf-toolbar">
          <InputGroup className="bookshelf-search">
            <Input
              placeholder="Search title, author, or tag..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>

          <div className="toolbar-controls">
            <button
              type="button"
              ref={filterButtonRef}
              className={`toolbar-button ${isFilterPanelOpen ? 'is-active' : ''} ${activeFilterCount ? 'has-value' : ''}`}
              onClick={() => {
                setIsFilterPanelOpen((prev) => !prev);
                setIsSortPanelOpen(false);
              }}
            >
              <FilterIcon style={{ fontSize: 14 }} />
              <span>Filter{activeFilterCount ? ` · ${activeFilterCount}` : ''}</span>
            </button>
            <button
              type="button"
              ref={sortButtonRef}
              className={`toolbar-button ${isSortPanelOpen ? 'is-active' : ''}`}
              onClick={() => {
                setIsSortPanelOpen((prev) => !prev);
                setIsFilterPanelOpen(false);
              }}
            >
              <SortIcon />
              <span>{sortSummary}</span>
            </button>
          </div>
        </div>

        <div className="bookshelf-subtoolbar">
          <Stack spacing={10} className="bookshelf-medium-tabs" wrap alignItems="center">
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
            <span className="bookshelf-count">
              {filteredBooks.length} / {allBooks.length}
            </span>
          </Stack>

          <div className="view-toggle" role="radiogroup" aria-label="View mode">
            <button
              type="button"
              className={`view-button ${viewMode === 'table' ? 'is-active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
            >
              Table
            </button>
            <button
              type="button"
              className={`view-button ${viewMode === 'gallery' ? 'is-active' : ''}`}
              onClick={() => setViewMode('gallery')}
              aria-pressed={viewMode === 'gallery'}
            >
              Gallery
            </button>
          </div>
        </div>

        <FilterPanel
          open={isFilterPanelOpen}
          anchorRef={filterButtonRef}
          filters={filters}
          filterOptions={filterOptions}
          onApply={(nextFilters) => {
            setFilters(nextFilters);
          }}
          onClose={() => setIsFilterPanelOpen(false)}
        />

        <SortPanel
          open={isSortPanelOpen}
          anchorRef={sortButtonRef}
          sorts={sorts}
          onApply={(nextSorts) => {
            setSorts(nextSorts);
          }}
          onClose={() => setIsSortPanelOpen(false)}
        />

        {viewMode === 'table' ? (
          <div className="bookshelf-table">
            <div className="bookshelf-header-row">
              <div>Title</div>
              <div>Medium</div>
              <div>Enjoy</div>
              <div>Importance</div>
              <div>Tags</div>
            </div>
            <div>
              {filteredBooks.length === 0 && (
                <div className="bookshelf-table-empty">No matching entries</div>
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
                      {book.keywords?.length ? (
                        <>
                          {book.keywords.slice(0, 6).map((keyword) => {
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
                          {book.keywords.length > 6 && (
                            <span className="tag-chip" style={{ background: 'transparent', color: '#7a7061' }}>
                              +{book.keywords.length - 6}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="bookshelf-muted">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bookshelf-gallery">
            {filteredBooks.length === 0 ? (
              <div className="bookshelf-gallery-empty">No matching entries</div>
            ) : (
              filteredBooks.map((book) => {
                const isActive = selectedBook?.notionId === book.notionId;
                const mediumStyle = getMediumStyle(book.medium || '');
                const primarySummary = book.notes?.trim();
                const secondarySummary = book.twoCents?.trim();
                const summary = primarySummary || secondarySummary || '';
                return (
                  <div
                    key={book.notionId}
                    className={`gallery-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleRowClick(book)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleRowClick(book);
                      }
                    }}
                  >
                    <div className="gallery-card-top">
                      {book.medium && (
                        <span className="medium-chip" style={mediumStyle || {}}>
                          {book.medium}
                        </span>
                      )}
                      {book.dateSaved && (
                        <span className="gallery-date">{formatDate(book.dateSaved)}</span>
                      )}
                    </div>
                    <div className="gallery-card-title">
                      {book.link ? (
                        <a
                          href={book.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gallery-card-link"
                        >
                          {book.title}
                        </a>
                      ) : (
                        <span>{book.title}</span>
                      )}
                    </div>
                    {book.author && <div className="gallery-card-author">{book.author}</div>}
                    <div className="gallery-card-metrics">
                      <ScoreBadge label="Enjoy" value={book.enjoyment} />
                      <ScoreBadge label="Importance" value={book.importance} />
                    </div>
                    {summary ? (
                      <p className="gallery-card-summary">
                        {truncateText(summary, 180)}
                      </p>
                    ) : (
                      <p className="gallery-card-summary is-empty">No summary yet.</p>
                    )}
                    {book.keywords?.length ? (
                      <div className="gallery-tags">
                        {book.keywords.slice(0, 4).map((keyword) => {
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
                        {book.keywords.length > 4 && (
                          <span className="tag-chip gallery-tag-more" style={{ background: 'transparent', color: '#7a7061' }}>
                            +{book.keywords.length - 4}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        )}

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
                <ExpandOutlineIcon style={{ marginRight: 6 }} /> Full view
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
  query BookshelfQuery {
    allNotionBook(sort: { fields: dateSaved, order: DESC }) {
      nodes {
        notionId
        title
        author
        medium
        enjoyment
        importance
        link
        notes
        twoCents
        keywords
        dateSaved
        display
      }
    }
  }
`;

export default BookshelfPage;
