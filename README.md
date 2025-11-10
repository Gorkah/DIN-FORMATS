# Conversor de Formatos DIN: De A0/A1/A2 a A4

Herramienta web gratuita para dividir archivos PDF de gran formato (A0, A1, A2, A3) en múltiples páginas A4 imprimibles. Ideal para imprimir pósters, planos o presentaciones de gran tamaño en impresoras domésticas estándar.

## Descripción

Esta aplicación permite convertir documentos PDF de formatos DIN grandes en páginas A4 individuales, facilitando la impresión casera de pósters, planos arquitectónicos, infografías o cualquier material de gran formato. La herramienta divide automáticamente el documento original manteniendo la proporción exacta y generando un PDF con todas las páginas listas para imprimir y ensamblar.

## Características Principales

**Conversión de formatos**: Soporta todos los formatos DIN estándar (A0, A1, A2, A3, A4)

**Vista previa interactiva**: Visualización en tiempo real de cómo se dividirá el documento

**Líneas de corte y numeración**: Cada página incluye guías para facilitar el ensamblaje correcto

**Procesamiento en navegador**: Todo el proceso ocurre localmente, sin enviar archivos a servidores externos

**Descarga directa**: Genera un PDF optimizado con todas las páginas A4 numeradas

**Interfaz intuitiva**: Diseño moderno y responsive, compatible con dispositivos móviles y escritorio

## Caso de Uso

Supongamos que dispone de un póster en formato DIN A0 (841 × 1189 mm) y desea imprimirlo sin acudir a un servicio de impresión especializado:

1. La impresión profesional de un A0 puede costar entre 15-30€
2. Con esta herramienta:
   - Sube el archivo PDF original
   - El sistema lo divide automáticamente en 16 páginas A4 (4×4)
   - Imprime las 16 páginas en su impresora doméstica (coste aproximado: 1-2€)
   - Une las páginas siguiendo la numeración y las guías de corte
   - Obtiene su póster A0 completo por una fracción del coste

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

## Tabla de Conversión de Formatos

| Formato Origen | Dimensiones (mm) | Páginas A4 Resultantes | Distribución |
|----------------|------------------|------------------------|--------------|
| DIN A0         | 841 × 1189      | 16 páginas            | 4 × 4        |
| DIN A1         | 594 × 841       | 8 páginas             | 2 × 4        |
| DIN A2         | 420 × 594       | 4 páginas             | 2 × 2        |
| DIN A3         | 297 × 420       | 2 páginas             | 1 × 2        |
| DIN A4         | 210 × 297       | 1 página              | 1 × 1        |

## Palabras Clave

Convertir PDF A0 a A4, dividir póster grande, imprimir A0 en casa, split PDF by pages, poster printing, planos A0, impresión económica, tiling poster, imprimir plano arquitectónico, dividir PDF grande, formato DIN conversion

## Aplicaciones Prácticas

- **Arquitectura**: Imprimir planos y diseños técnicos
- **Publicidad**: Crear pósters promocionales a bajo coste
- **Educación**: Materiales didácticos de gran formato
- **Eventos**: Carteles y señalización para conferencias
- **Arte**: Reproducción de obras y fotografías de gran tamaño

## Stack Tecnológico

- React 18 + Vite
- Tailwind CSS
- PDF.js (Mozilla)
- jsPDF
- Lucide React Icons

## Licencia

Proyecto de código abierto bajo licencia MIT. Libre uso para fines personales y comerciales.

## Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, abra primero un issue para discutir los cambios propuestos.
