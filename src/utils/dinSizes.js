// Tamaños DIN en milímetros
export const DIN_SIZES = {
  'A0': { width: 841, height: 1189, label: 'DIN A0 (841 × 1189 mm)' },
  'A1': { width: 594, height: 841, label: 'DIN A1 (594 × 841 mm)' },
  'A2': { width: 420, height: 594, label: 'DIN A2 (420 × 594 mm)' },
  'A3': { width: 297, height: 420, label: 'DIN A3 (297 × 420 mm)' },
  'A4': { width: 210, height: 297, label: 'DIN A4 (210 × 297 mm)' },
};

// Calcular cuántas páginas de destino caben en un formato DIN de origen
export const calculatePages = (sourceFormat, sourceOrientation = 'portrait', targetFormat = 'A4', targetOrientation = 'portrait') => {
  const source = DIN_SIZES[sourceFormat];
  const target = DIN_SIZES[targetFormat];
  
  if (!source || !target) return { cols: 0, rows: 0, total: 0, sourceWidth: 0, sourceHeight: 0 };
  
  // Aplicar orientación a las dimensiones de origen
  let sourceWidth = sourceOrientation === 'landscape' ? source.height : source.width;
  let sourceHeight = sourceOrientation === 'landscape' ? source.width : source.height;
  
  // Aplicar orientación a las dimensiones de destino
  let targetWidth = targetOrientation === 'landscape' ? target.height : target.width;
  let targetHeight = targetOrientation === 'landscape' ? target.width : target.height;
  
  // Calculamos cuántas páginas de destino caben
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
export const calculatePagesFromDimensions = (sourceWidthMm, sourceHeightMm, targetFormat = 'A4', targetOrientation = 'portrait') => {
  const target = DIN_SIZES[targetFormat];
  
  if (!target) return { cols: 0, rows: 0, total: 0 };
  
  // Aplicar orientación a las dimensiones de destino
  let targetWidth = targetOrientation === 'landscape' ? target.height : target.width;
  let targetHeight = targetOrientation === 'landscape' ? target.width : target.height;
  
  // Calculamos cuántas páginas de destino caben
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
export const detectDinFormat = (widthMm, heightMm) => {
  let closestFormat = 'A4';
  let minDiff = Infinity;
  
  // Considerar ambas orientaciones
  Object.entries(DIN_SIZES).forEach(([format, size]) => {
    // Portrait
    const diffPortrait = Math.abs(widthMm - size.width) + Math.abs(heightMm - size.height);
    if (diffPortrait < minDiff) {
      minDiff = diffPortrait;
      closestFormat = format;
    }
    
    // Landscape
    const diffLandscape = Math.abs(widthMm - size.height) + Math.abs(heightMm - size.width);
    if (diffLandscape < minDiff) {
      minDiff = diffLandscape;
      closestFormat = format;
    }
  });
  
  return closestFormat;
};

// Mantener compatibilidad con código anterior
export const calculateA4Pages = (dinFormat, orientation = 'portrait') => {
  return calculatePages(dinFormat, orientation, 'A4', 'portrait');
};

// Calcular la cuadrícula de páginas de destino
export const calculateGrid = (sourceFormat, sourceOrientation = 'portrait', targetFormat = 'A4', targetOrientation = 'portrait') => {
  const { cols, rows, sourceWidth, sourceHeight, targetWidth, targetHeight } = calculatePages(
    sourceFormat, sourceOrientation, targetFormat, targetOrientation
  );
  
  const pages = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * targetWidth;
      const y = row * targetHeight;
      
      // Calculamos el área visible de esta página
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
export const calculateGridFromDimensions = (sourceWidthMm, sourceHeightMm, targetFormat = 'A4', targetOrientation = 'portrait') => {
  const { cols, rows, targetWidth, targetHeight } = calculatePagesFromDimensions(
    sourceWidthMm, sourceHeightMm, targetFormat, targetOrientation
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

// Mantener compatibilidad con código anterior
export const calculateA4Grid = (dinFormat, orientation = 'portrait') => {
  return calculateGrid(dinFormat, orientation, 'A4', 'portrait');
};
