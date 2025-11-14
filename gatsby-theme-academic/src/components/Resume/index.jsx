import React, { useState } from 'react';
import loadable from '@loadable/component';

const ResumeViewer = loadable(() => import('./viewer'), {
  ssr: false,
  fallback: (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      Loading resume...
    </div>
  ),
});

const Resume = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const handleToggle = () => setPageNumber((prev) => (prev === 1 ? 2 : 1));

  return (
    <ResumeViewer pageNumber={pageNumber} onToggle={handleToggle} />
  );
};

export default Resume;
