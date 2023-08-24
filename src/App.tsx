import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toPng } from "html-to-image";

import DrawOnImage from "./DrawOnImage";
import pdfMake from "pdfmake/build/pdfmake";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [isLoadSuccess, setLoadSuccess] = useState(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePages, setImagePages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handleConvertToImages = async () => {
    const pageNodes = document.querySelectorAll(".react-pdf__Page");
    const urls = [];

    for (let i = 0; i < pageNodes.length; i++) {
      const pageNode = pageNodes[i];
      // @ts-ignore
      const imageUrl = await toPng(pageNode);
      urls.push(imageUrl);
    }

    setImageUrls(urls);
    setImagePages(urls.length - 1);
  };

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
    setLoadSuccess(true);
  };

  const options = {
    cMapUrl: "cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "standard_fonts/",
  };

  console.log(imageUrls[currentPage]);

  return (
    <div>
      {imageUrls.length === 0 ? (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#f1f1f1",
            }}
          >
            <Document
              file={"/p.pdf"}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div>Loading</div>}
              options={options}
            >
              {isLoadSuccess &&
                Array.from({ length: numPages }, (_, index) => (
                  <div style={{ margin: 10 }}>
                    <Page
                      key={`page_${pageNumber}`}
                      pageNumber={index + 1}
                      renderMode="canvas"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
            </Document>
          </div>

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <button
              title="Back"
              onClick={() => setPageNumber((n) => n - 1)}
              disabled={pageNumber <= 1}
            >
              index Back
            </button>
            <div>
              Page: {pageNumber}/{numPages}
            </div>
            <button
              title="Next"
              onClick={() => setPageNumber((n) => n + 1)}
              disabled={pageNumber >= numPages!}
            >
              Next
            </button>
          </div>
          <button onClick={handleConvertToImages}>Convert to Image</button>
        </>
      ) : (
        <>
          <div style={{ padding: 10, gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {imageUrls.map((urls: any, index: number) => (
                <div
                  style={{ display: index === currentPage ? "block" : "none" }}
                >
                  <DrawOnImage
                    imageUrl={urls}
                    index={index}
                    setImageUrls={setImageUrls}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button title="Back" onClick={() => setCurrentPage((n) => n - 1)}>
                Back
              </button>
              <div>
                Page: {currentPage}/{imagePages}
              </div>
              <button title="Next" onClick={() => setCurrentPage((n) => n + 1)}>
                Next
              </button>
            </div>
            <button
              title="Save"
              onClick={() => {
                const content = imageUrls.map((image) => ({
                  image,
                }));

                const docDefinition = {
                  content,
                };

                pdfMake.createPdf(docDefinition).download("images.pdf");
              }}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
