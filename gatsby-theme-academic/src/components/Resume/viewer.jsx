import React from 'react';
import { Button, Row, Col } from 'rsuite';
import { Document, Page } from 'react-pdf';

const ResumeViewer = ({ pageNumber, onToggle }) => {
  const file = typeof window !== 'undefined' ? '/resume.pdf' : null;

  return (
    <div>
      <Document file={file} onLoadError={(error) => console.error('Resume load error', error)}>
        <Page pageNumber={pageNumber} />
      </Document>
      <Row justify="center" style={{ background: 'lightslategray' }} type="flex">
        <Col span={2}>
          <p>{`Page ${pageNumber}`}</p>
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={onToggle}>
            {pageNumber === 1 ? 'Next Page' : 'Previous Page'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ResumeViewer;
