'use client'

import React, { useState } from 'react'
import ReactPDF from '@react-pdf/renderer'
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import './newCourse.module.css';
import { list } from 'postcss';
import { TextContent } from 'pdfjs-dist/types/src/display/api';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export default function MyPDFViewer( {docURL, onDisplaySuccess} : {docURL:string, onDisplaySuccess: (numPages: number) => void}  ) {

  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
    onDisplaySuccess(numPages);
  }
  
  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  

  

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function onTextLoadSuccess(page: any) {
    // Extract text content from the page object if available
    
    page.getTextContent().then((textContent: TextContent) => {
      console.log('Text content of the page:', textContent);
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Document 
        file={docURL} 
        onLoadSuccess={onDocumentLoadSuccess} 
        //style={{ margin: '0 auto' }}
        >
          <Page 
            pageNumber={pageNumber} 
            renderAnnotationLayer={false} 
            renderTextLayer={false} 
            onLoadSuccess={onTextLoadSuccess}
          />
      </Document>
      <p style={{ textAlign: 'center' }}>
        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
          style={{
            margin: '10px',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100px', // Added width to make the buttons the same size
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={pageNumber >= (numPages || Infinity)}
          onClick={nextPage}
          style={{
            margin: '10px',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100px', // Added width to make the buttons the same size
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
        >
          Next
        </button>
      </div>
    </div>
  )
}
