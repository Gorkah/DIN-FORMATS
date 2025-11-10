import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Scissors, Eye, EyeOff, Grid3x3, FileText } from 'lucide-react';
import { DIN_SIZES, calculatePages, calculateGrid, detectDinFormat, calculatePagesFromDimensions, calculateGridFromDimensions } from './utils/dinSizes';
import { loadPdfDocument, renderPdfPage, getPdfDimensions } from './utils/pdfUtils';
import jsPDF from 'jspdf';

function App() {
  const [selectedFormat, setSelectedFormat] = useState('A0');
  const [targetFormat, setTargetFormat] = useState('A4');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pdfDimensions, setPdfDimensions] = useState(null);
  const [detectedFormat, setDetectedFormat] = useState(null);
  const [showCutLines, setShowCutLines] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [targetPages, setTargetPages] = useState({ cols: 0, rows: 0, total: 0 });
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Calcular páginas cuando cambie el formato
  useEffect(() => {
    // Usar formato detectado si hay PDF, sino el seleccionado manualmente
    const sourceFormat = detectedFormat || selectedFormat;
    console.log('Calculando páginas:');
    console.log('  - Formato origen:', sourceFormat, '→', DIN_SIZES[sourceFormat]?.width, 'x', DIN_SIZES[sourceFormat]?.height, 'mm');
    console.log('  - Formato destino:', targetFormat, '→', DIN_SIZES[targetFormat]?.width, 'x', DIN_SIZES[targetFormat]?.height, 'mm');
    const pages = calculatePages(sourceFormat, targetFormat);
    console.log('  - Resultado:', pages.total, 'páginas (', pages.cols, 'x', pages.rows, ')');
    setTargetPages(pages);
  }, [selectedFormat, targetFormat, detectedFormat]);

  // Cargar y renderizar PDF cuando se sube
  useEffect(() => {
    if (pdfFile) {
      loadPdf();
    }
  }, [pdfFile]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      setError('');
      
      const pdf = await loadPdfDocument(pdfFile);
      setPdfDocument(pdf);
      
      // Obtener dimensiones del PDF
      const dimensions = await getPdfDimensions(pdf);
      setPdfDimensions(dimensions);
      
      // Detectar formato DIN más cercano
      const detected = detectDinFormat(dimensions.widthMm, dimensions.heightMm);
      console.log('PDF Dimensiones:', dimensions.widthMm, 'x', dimensions.heightMm, 'mm');
      console.log('Formato detectado:', detected);
      console.log('DIN', detected, 'estándar:', DIN_SIZES[detected].width, 'x', DIN_SIZES[detected].height, 'mm');
      setDetectedFormat(detected);
      
      // Renderizar el PDF en el canvas
      if (canvasRef.current) {
        // Calcular escala para ajustar al contenedor
        const containerWidth = canvasRef.current.parentElement.clientWidth - 40;
        const scale = containerWidth / dimensions.width;
        
        await renderPdfPage(pdf, 1, canvasRef.current, scale);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Error al cargar el PDF. Asegúrate de que el archivo es válido.');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Por favor, selecciona un archivo PDF válido.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Por favor, suelta un archivo PDF válido.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const generateA4Pdf = async () => {
    if (!pdfDocument || !pdfDimensions) return;
    
    try {
      setLoading(true);
      
      // Usar formato DIN estándar detectado
      const sourceFormat = detectedFormat || selectedFormat;
      const grid = calculateGrid(sourceFormat, targetFormat);
      
      // Obtener dimensiones estándar del formato fuente
      const sourceSize = DIN_SIZES[sourceFormat];
      const sourceWidth = sourceSize.width;
      const sourceHeight = sourceSize.height;
      
      // Crear un canvas temporal para extraer partes del PDF
      const tempCanvas = document.createElement('canvas');
      const scale = 3; // Mayor resolución para impresión
      
      // Renderizar el PDF original a alta resolución
      const dimensions = await renderPdfPage(pdfDocument, 1, tempCanvas, scale);
      
      // Obtener dimensiones del formato de destino
      const targetSize = DIN_SIZES[targetFormat];
      const targetWidth = targetSize.width;
      const targetHeight = targetSize.height;
      
      // Crear PDF con páginas del formato de destino
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [targetWidth, targetHeight]
      });
      
      // Factor de escala del canvas al tamaño estándar DIN
      const scaleFactorX = dimensions.width / sourceWidth;
      const scaleFactorY = dimensions.height / sourceHeight;
      
      for (let i = 0; i < grid.length; i++) {
        const page = grid[i];
        
        if (i > 0) {
          pdf.addPage();
        }
        
        // Crear canvas para esta página A4
        const pageCanvas = document.createElement('canvas');
        const ctx = pageCanvas.getContext('2d');
        
        // Establecer dimensiones del canvas de la página
        pageCanvas.width = page.visibleWidth * scaleFactorX;
        pageCanvas.height = page.visibleHeight * scaleFactorY;
        
        // Extraer la porción del PDF original
        ctx.drawImage(
          tempCanvas,
          page.x * scaleFactorX,
          page.y * scaleFactorY,
          pageCanvas.width,
          pageCanvas.height,
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );
        
        // Agregar la imagen al PDF
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, targetWidth, targetHeight);
        
        // Agregar número de página
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(
          `Página ${page.pageNumber} de ${grid.length} | Posición: Fila ${page.row + 1}, Columna ${page.col + 1}`,
          targetWidth / 2,
          targetHeight - 5,
          { align: 'center' }
        );
      }
      
      // Descargar el PDF
      const filename = `${pdfFile.name.replace('.pdf', '')}_${targetFormat}_pages.pdf`;
      pdf.save(filename);
      
      setLoading(false);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Error al generar el PDF. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-8 h-8 text-primary" />
                Conversor DIN
              </h1>
              <p className="text-gray-600 mt-1">
                Convierte cualquier formato DIN en páginas más pequeñas para imprimir en casa
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel de control */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selección de formato */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Grid3x3 className="w-5 h-5" />
                Configuración
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño DIN {!pdfDimensions && '(referencia)'}
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={pdfDimensions !== null}
                  >
                    {Object.entries(DIN_SIZES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  {!pdfDimensions && (
                    <p className="text-xs text-gray-500 mt-1">
                      Formato de referencia (sube un PDF para detección automática)
                    </p>
                  )}
                </div>

                {pdfDimensions && detectedFormat && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      ✓ PDF Detectado
                    </p>
                    <p className="text-xs text-green-700">
                      Dimensiones: {pdfDimensions.widthMm.toFixed(0)} × {pdfDimensions.heightMm.toFixed(0)} mm
                    </p>
                    <p className="text-xs text-green-700 font-semibold mt-1">
                      Usando: <strong>DIN {detectedFormat} estándar</strong>
                    </p>
                    <p className="text-xs text-green-600 mt-1 italic">
                      ({DIN_SIZES[detectedFormat].width} × {DIN_SIZES[detectedFormat].height} mm)
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Salida
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {Object.entries(DIN_SIZES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Páginas {targetFormat} necesarias:
                    </p>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {targetPages.total}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {targetPages.cols} columnas × {targetPages.rows} filas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cargar PDF */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Cargar PDF
              </h2>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {/* Drag & Drop Zone */}
              <div
                ref={dropZoneRef}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-3 ${
                  dragActive ? 'text-primary' : 'text-gray-400'
                }`} />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {dragActive ? '¡Suelta el archivo aquí!' : 'Arrastra y suelta tu PDF'}
                </p>
                <p className="text-xs text-gray-500">
                  o haz clic para seleccionar
                </p>
              </div>
              
              {pdfFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 truncate">
                    ✓ {pdfFile.name}
                  </p>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            {/* Controles */}
            {pdfDocument && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Controles
                </h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCutLines(!showCutLines)}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {showCutLines ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCutLines ? 'Ocultar' : 'Mostrar'} líneas de corte
                  </button>
                  
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Grid3x3 className="w-4 h-4" />
                    {showGrid ? 'Ocultar' : 'Mostrar'} cuadrícula
                  </button>
                  
                  <button
                    onClick={generateA4Pdf}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" />
                    {loading ? 'Generando...' : `Descargar PDF en ${targetFormat}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Vista previa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>
              
              {!pdfDocument ? (
                <div className="aspect-[1/1.4142] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">
                      Sube un PDF para ver la vista previa
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      El PDF se dividirá en páginas A4 según el formato seleccionado
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {loading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-gray-600">Cargando...</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative overflow-auto max-h-[800px] bg-gray-100 rounded-lg p-4">
                    <div className="relative inline-block">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full h-auto shadow-lg"
                      />
                      
                      {/* Overlay de líneas de corte */}
                      {(showCutLines || showGrid) && (
                        <svg
                          className="absolute top-0 left-0 w-full h-full pointer-events-none"
                          style={{ mixBlendMode: 'multiply' }}
                        >
                          {showCutLines && (
                            <>
                              {/* Líneas de corte verticales */}
                              {Array.from({ length: targetPages.cols - 1 }).map((_, i) => {
                                const x = ((i + 1) / targetPages.cols) * 100;
                                return (
                                  <line
                                    key={`v-${i}`}
                                    x1={`${x}%`}
                                    y1="0%"
                                    x2={`${x}%`}
                                    y2="100%"
                                    stroke="#ef4444"
                                    strokeWidth="2"
                                    strokeDasharray="8,4"
                                  />
                                );
                              })}
                              
                              {/* Líneas de corte horizontales */}
                              {Array.from({ length: targetPages.rows - 1 }).map((_, i) => {
                                const y = ((i + 1) / targetPages.rows) * 100;
                                return (
                                  <line
                                    key={`h-${i}`}
                                    x1="0%"
                                    y1={`${y}%`}
                                    x2="100%"
                                    y2={`${y}%`}
                                    stroke="#ef4444"
                                    strokeWidth="2"
                                    strokeDasharray="8,4"
                                  />
                                );
                              })}
                            </>
                          )}
                          
                          {showGrid && (
                            <>
                              {/* Cuadrícula de páginas */}
                              {(() => {
                                // Siempre usar formato DIN estándar
                                const sourceFormat = detectedFormat || selectedFormat;
                                const grid = calculateGrid(sourceFormat, targetFormat);
                                
                                return grid.map((page) => {
                                  const x = (page.col / targetPages.cols) * 100;
                                  const y = (page.row / targetPages.rows) * 100;
                                  const w = (1 / targetPages.cols) * 100;
                                  const h = (1 / targetPages.rows) * 100;
                                  
                                  return (
                                    <g key={page.id}>
                                      <rect
                                        x={`${x}%`}
                                        y={`${y}%`}
                                        width={`${w}%`}
                                        height={`${h}%`}
                                        fill="rgba(59, 130, 246, 0.1)"
                                        stroke="rgba(59, 130, 246, 0.5)"
                                        strokeWidth="1"
                                      />
                                      <text
                                        x={`${x + w / 2}%`}
                                        y={`${y + h / 2}%`}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="#1e40af"
                                        fontSize="16"
                                        fontWeight="bold"
                                        style={{ 
                                          textShadow: '0 0 4px white, 0 0 4px white, 0 0 4px white',
                                          paintOrder: 'stroke fill'
                                        }}
                                      >
                                        {targetFormat}-{page.pageNumber}
                                      </text>
                                    </g>
                                  );
                                });
                              })()}
                            </>
                          )}
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Scissors className="w-4 h-4" />
                    <span>
                      Las líneas rojas indican dónde cortar. Cada sección numerada es una página {targetFormat}.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            💡 <strong>Consejo:</strong> Imprime las páginas en tu impresora casera y únelas para crear tu póster completo. Sube tu PDF y la aplicación detectará automáticamente su tamaño.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
