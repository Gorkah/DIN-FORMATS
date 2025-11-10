# 🚀 Guía de Despliegue en GitHub Pages

Esta guía te ayudará a desplegar la aplicación en GitHub Pages.

## 📋 Prerrequisitos

1. Tener una cuenta de GitHub
2. Tener el repositorio sincronizado con GitHub

## 🔧 Configuración de GitHub Pages

### Paso 1: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub: `https://github.com/nexa-aii/DIN-FORMATS`
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, busca **Pages** en la sección "Code and automation"
4. En **Source**, selecciona **GitHub Actions**

### Paso 2: Subir tu código a GitHub

```bash
# Asegúrate de estar en la rama main
git checkout main

# Agrega todos los archivos
git add .

# Haz commit de los cambios
git commit -m "Initial commit: Conversor DIN application"

# Sube los cambios a GitHub
git push origin main
```

### Paso 3: El despliegue automático

Una vez que hagas push a la rama `main`, el workflow de GitHub Actions se ejecutará automáticamente:

1. Instalará las dependencias
2. Compilará la aplicación
3. La desplegará en GitHub Pages

Puedes ver el progreso en la pestaña **Actions** de tu repositorio.

### Paso 4: Accede a tu aplicación

Una vez completado el despliegue, tu aplicación estará disponible en:

```
https://nexa-aii.github.io/DIN-FORMATS/
```

## 🔄 Actualizaciones

Para actualizar la aplicación, simplemente:

1. Haz cambios en tu código local
2. Haz commit y push:
   ```bash
   git add .
   git commit -m "Tu mensaje de commit"
   git push origin main
   ```
3. GitHub Actions desplegará automáticamente la nueva versión

## 🐛 Solución de problemas

### El sitio no se despliega

1. Verifica que GitHub Pages esté habilitado en Settings > Pages
2. Revisa los logs en la pestaña Actions para ver si hay errores
3. Asegúrate de que la configuración en `vite.config.js` tenga el base correcto:
   ```js
   base: '/DIN-FORMATS/'
   ```

### Errores 404 al navegar

Si ves errores 404, verifica que todas las rutas en tu aplicación sean relativas y que el `base` en `vite.config.js` sea correcto.

### El CSS no se carga

Asegúrate de que el build se completó correctamente. Puedes probar localmente con:
```bash
npm run build
npm run preview
```

## 📝 Notas adicionales

- El primer despliegue puede tardar unos minutos
- Los cambios subsecuentes son más rápidos
- GitHub Pages puede tardar unos minutos en actualizar después del despliegue
- Puedes verificar el estado del despliegue en la pestaña "Actions" de tu repositorio

## 🔒 Permisos

El workflow de GitHub Actions necesita permisos para desplegar. Estos ya están configurados en `.github/workflows/deploy.yml`:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

Si encuentras problemas de permisos, verifica que estén habilitados en:
Settings > Actions > General > Workflow permissions

---

¡Listo! Tu aplicación debería estar funcionando en GitHub Pages. 🎉
