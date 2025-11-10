// Tamaños DIN en milímetros (siempre en formato portrait/vertical)
export const DIN_SIZES = {
  'A0': { width: 841, height: 1189, label: 'DIN A0 (841 × 1189 mm)' },
  'A1': { width: 594, height: 841, label: 'DIN A1 (594 × 841 mm)' },
  'A2': { width: 420, height: 594, label: 'DIN A2 (420 × 594 mm)' },
  'A3': { width: 297, height: 420, label: 'DIN A3 (297 × 420 mm)' },
  'A4': { width: 210, height: 297, label: 'DIN A4 (210 × 297 mm)' },
};

// Tabla de conversiones exactas entre formatos DIN
// Cada formato es exactamente 2^n veces el A4
// A0 = 16×A4, A1 = 8×A4, A2 = 4×A4, A3 = 2×A4, A4 = 1×A4
const DIN_CONVERSION_TABLE = {
  'A0': {
    'A0': { cols: 1, rows: 1 },
    'A1': { cols: 2, rows: 1 },
    'A2': { cols: 2, rows: 2 },
    'A3': { cols: 4, rows: 2 },
    'A4': { cols: 4, rows: 4 },
  },
  'A1': {
    'A0': { cols: 1, rows: 1 }, // No tiene sentido pero por completitud
    'A1': { cols: 1, rows: 1 },
    'A2': { cols: 2, rows: 1 },
    'A3': { cols: 2, rows: 2 },
    'A4': { cols: 4, rows: 2 },
  },
  'A2': {
    'A0': { cols: 1, rows: 1 },
    'A1': { cols: 1, rows: 1 },
    'A2': { cols: 1, rows: 1 },
    'A3': { cols: 2, rows: 1 },
    'A4': { cols: 2, rows: 2 },
  },
  'A3': {
    'A0': { cols: 1, rows: 1 },
    'A1': { cols: 1, rows: 1 },
    'A2': { cols: 1, rows: 1 },
    'A3': { cols: 1, rows: 1 },
    'A4': { cols: 2, rows: 1 },
  },
  'A4': {
    'A0': { cols: 1, rows: 1 },
    'A1': { cols: 1, rows: 1 },
    'A2': { cols: 1, rows: 1 },
    'A3': { cols: 1, rows: 1 },
    'A4': { cols: 1, rows: 1 },
  },
};

// Calcular cuántas páginas de destino caben en un formato DIN de origen
// SIEMPRE usa formato portrait (vertical) para origen y destino
// Usa la tabla de conversiones exactas para garantizar precisión
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
  
  // Usar tabla de conversiones exactas si existe
  const conversionData = DIN_CONVERSION_TABLE[sourceFormat]?.[targetFormat];
  
  let cols, rows;
  
  if (conversionData) {
    // Usar valores exactos de la tabla
    cols = conversionData.cols;
    rows = conversionData.rows;
    console.log(`Usando tabla exacta: ${sourceFormat} → ${targetFormat} = ${cols}×${rows}`);
  } else {
    // Fallback: calcular usando dimensiones (para casos no estándar)
    cols = Math.ceil(source.width / target.width);
    rows = Math.ceil(source.height / target.height);
    console.log(`Calculando: ${sourceFormat} → ${targetFormat} = ${cols}×${rows}`);
  }
  
  return {
    cols,
    rows,
    total: cols * rows,
    sourceWidth: source.width,
    sourceHeight: source.height,
    targetWidth: target.width,
    targetHeight: target.height
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
