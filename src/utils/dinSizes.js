// Tamaños DIN en milímetros (siempre en formato portrait/vertical)
export const DIN_SIZES = {
  'A0': { width: 841, height: 1189, label: 'DIN A0 (841 × 1189 mm)' },
  'A1': { width: 594, height: 841, label: 'DIN A1 (594 × 841 mm)' },
  'A2': { width: 420, height: 594, label: 'DIN A2 (420 × 594 mm)' },
  'A3': { width: 297, height: 420, label: 'DIN A3 (297 × 420 mm)' },
  'A4': { width: 210, height: 297, label: 'DIN A4 (210 × 297 mm)' },
};

// Calcular cuántas páginas de destino caben en un formato DIN de origen
// SIEMPRE usa formato portrait (vertical) para origen y destino
export const calculatePages = (sourceFormat, targetFormat = 'A4') => {
  const source = DIN_SIZES[sourceFormat];
  const target = DIN_SIZES[targetFormat];
  
  if (!source || !target) {
    return { 
      cols: 0, 
      rows: 0, 
      total: 0, 
      sourceWidth: 0, 
      sourceHeight: 0,
      targetWidth: 0,
      targetHeight: 0
    };
  }
  
  // Siempre usar dimensiones portrait (width < height)
  const sourceWidth = source.width;
  const sourceHeight = source.height;
  const targetWidth = target.width;
  const targetHeight = target.height;
  
  // Calcular cuántas páginas caben
  const cols = Math.ceil(sourceWidth / targetWidth);
  const rows = Math.ceil(sourceHeight / targetHeight);
  
  return {
    cols,
    rows,
    total: cols * rows,
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight
  };
};

// Calcular páginas desde dimensiones personalizadas
// SIEMPRE usa formato portrait (vertical) para el destino
export const calculatePagesFromDimensions = (sourceWidthMm, sourceHeightMm, targetFormat = 'A4') => {
  const target = DIN_SIZES[targetFormat];
  
  if (!target) {
    return { 
      cols: 0, 
      rows: 0, 
      total: 0,
      sourceWidth: 0,
      sourceHeight: 0,
      targetWidth: 0,
      targetHeight: 0
    };
  }
  
  // Siempre usar dimensiones portrait
  const targetWidth = target.width;
  const targetHeight = target.height;
  
  // Calcular cuántas páginas caben
  const cols = Math.ceil(sourceWidthMm / targetWidth);
  const rows = Math.ceil(sourceHeightMm / targetHeight);
  
  return {
    cols,
    rows,
    total: cols * rows,
    sourceWidth: sourceWidthMm,
    sourceHeight: sourceHeightMm,
    targetWidth,
    targetHeight
  };
};

// Detectar el formato DIN más cercano basado en dimensiones
// Asume que las dimensiones están en formato portrait (width < height)
export const detectDinFormat = (widthMm, heightMm) => {
  let closestFormat = 'A4';
  let minDiff = Infinity;
  
  // Solo comparar en formato portrait
  Object.entries(DIN_SIZES).forEach(([format, size]) => {
    const diff = Math.abs(widthMm - size.width) + Math.abs(heightMm - size.height);
    if (diff < minDiff) {
      minDiff = diff;
      closestFormat = format;
    }
  });
  
  return closestFormat;
};

// Calcular la cuadrícula de páginas de destino
// SIEMPRE usa formato portrait (vertical)
export const calculateGrid = (sourceFormat, targetFormat = 'A4') => {
  const { cols, rows, sourceWidth, sourceHeight, targetWidth, targetHeight } = calculatePages(
    sourceFormat, targetFormat
  );
  
  const pages = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * targetWidth;
      const y = row * targetHeight;
      
      // Calcular el área visible de esta página
      const visibleWidth = Math.min(targetWidth, sourceWidth - x);
      const visibleHeight = Math.min(targetHeight, sourceHeight - y);
      
      pages.push({
        id: `page-${row}-${col}`,
        row,
        col,
        x,
        y,
        width: targetWidth,
        height: targetHeight,
        visibleWidth,
        visibleHeight,
        pageNumber: row * cols + col + 1
      });
    }
  }
  
  return pages;
};

// Calcular cuadrícula desde dimensiones personalizadas
// SIEMPRE usa formato portrait (vertical) para el destino
export const calculateGridFromDimensions = (sourceWidthMm, sourceHeightMm, targetFormat = 'A4') => {
  const { cols, rows, targetWidth, targetHeight } = calculatePagesFromDimensions(
    sourceWidthMm, sourceHeightMm, targetFormat
  );
  
  const pages = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * targetWidth;
      const y = row * targetHeight;
      
      const visibleWidth = Math.min(targetWidth, sourceWidthMm - x);
      const visibleHeight = Math.min(targetHeight, sourceHeightMm - y);
      
      pages.push({
        id: `page-${row}-${col}`,
        row,
        col,
        x,
        y,
        width: targetWidth,
        height: targetHeight,
        visibleWidth,
        visibleHeight,
        pageNumber: row * cols + col + 1
      });
    }
  }
  
  return pages;
};
