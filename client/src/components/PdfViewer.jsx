import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set the worker source globally
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const PdfViewer = () => {
  const { fileName } = useParams(); // Extract file name from URL
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null); // For tracking the number of pages in the PDF

  useEffect(() => {
    // Construct full path to the PDF file
    const fullPdfUrl = `/${fileName}`;
    setPdfUrl(fullPdfUrl);
  }, [fileName]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("PDF loaded successfully. Number of pages:", numPages); // Log the number of pages loaded
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error); // Log any errors encountered while loading the PDF
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-blue-100 relative">
      <div className="h-full">
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          >
            {Array.from(new Array(numPages || 0), (el, index) => (
              <div key={index} className="w-full flex justify-center">
                <Page pageNumber={index + 1} width={600} />
              </div>
            ))}
          </Document>
        )}
      </div>
    </section>
  );
};

export default PdfViewer;
