import * as pdfjsLib from 'pdfjs-dist';

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const loadPdfDocument = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  return pdf;
};

export const renderPdfPage = async (pdf, pageNumber, canvas, scale = 1) => {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  
  await page.render(renderContext).promise;
  return { width: viewport.width, height: viewport.height };
};

export const getPdfDimensions = async (pdf) => {
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  
  // Convertir de puntos a milímetros (1 punto = 0.352778 mm)
  const widthMm = viewport.width * 0.352778;
  const heightMm = viewport.height * 0.352778;
  
  return {
    width: viewport.width,
    height: viewport.height,
    widthMm,
    heightMm
  };
};
