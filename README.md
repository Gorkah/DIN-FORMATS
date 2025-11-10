# 📄 Conversor DIN - Imprime tu póster en casa

Aplicación web que convierte archivos PDF de formatos DIN grandes (A0, A1, A2, A3) en múltiples páginas A4 para que puedas imprimirlos en tu impresora casera.

## 🎯 Características

- ✅ **Conversión de formatos DIN**: Soporta A0, A1, A2, A3, A4
- 🔄 **Rotación**: Cambia entre orientación vertical y horizontal
- 👁️ **Vista previa interactiva**: Ve cómo quedará dividido tu póster
- ✂️ **Líneas de corte**: Visualiza dónde cortar cada página
- 🔢 **Numeración automática**: Cada página A4 está numerada para facilitar el ensamblaje
- 📥 **Descarga en PDF**: Genera un PDF con todas las páginas A4 listas para imprimir
- 🎨 **Interfaz moderna**: Diseño atractivo y fácil de usar

## 🚀 Uso

1. Selecciona el formato DIN de tu archivo original (ej: A0)
2. Elige la orientación (vertical u horizontal)
3. Sube tu archivo PDF
4. Visualiza la vista previa con las líneas de corte
5. Descarga el PDF con todas las páginas A4
6. Imprime y ensambla tu póster

## 💡 Ejemplo de uso

Imagina que tienes un póster diseñado en formato A0 (841 × 1189 mm):

1. **Sin esta herramienta**: Tendrías que pagar una impresión costosa en A0
2. **Con esta herramienta**: 
   - Subes tu PDF en A0
   - Se divide automáticamente en 8 páginas A4
   - Imprimes las 8 páginas en tu impresora casera
   - Las unes siguiendo las líneas de corte
   - ¡Tienes tu póster A0 completo!

## 🛠️ Desarrollo

### Instalación

```bash
npm install
```

### Desarrollo local

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
```

### Preview del build

```bash
npm run preview
```

## 📦 Tecnologías

- **React 18**: Framework de UI
- **Vite**: Build tool ultrarrápido
- **Tailwind CSS**: Framework de CSS utility-first
- **PDF.js**: Renderizado de PDF en el navegador
- **jsPDF**: Generación de PDF
- **Lucide React**: Iconos modernos

## 📐 Formatos soportados

| Formato | Dimensiones (mm) | Páginas A4 (vertical) |
|---------|------------------|----------------------|
| DIN A0  | 841 × 1189      | 8 páginas           |
| DIN A1  | 594 × 841       | 4 páginas           |
| DIN A2  | 420 × 594       | 2 páginas           |
| DIN A3  | 297 × 420       | 2 páginas           |
| DIN A4  | 210 × 297       | 1 página            |

## 🌐 GitHub Pages

Esta aplicación está diseñada para ser desplegada en GitHub Pages. El archivo de configuración de GitHub Actions se encuentra en `.github/workflows/deploy.yml`.

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

💡 **Tip**: Para mejores resultados, asegúrate de que tu PDF original tenga buena resolución y usa papel de alta calidad al imprimir las páginas A4.
