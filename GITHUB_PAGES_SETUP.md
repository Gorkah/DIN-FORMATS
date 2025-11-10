# 🚀 Configuración de GitHub Pages - Guía Rápida

## ❌ Error 404: El problema

Si ves error 404 en `https://gorkah.github.io/DIN-FORMATS/`, significa que GitHub Pages no está configurado o el workflow no se ejecutó.

## ✅ Solución - 3 Pasos

### Paso 1: Habilitar GitHub Pages

1. Ve a tu repositorio: `https://github.com/Gorkah/DIN-FORMATS`
2. Click en **Settings** (⚙️ arriba a la derecha)
3. En el menú lateral izquierdo, busca **Pages** (en la sección "Code and automation")
4. En **Source**, selecciona: **GitHub Actions**

   ![Source: GitHub Actions](https://docs.github.com/assets/cb-24906/mw-1440/images/help/pages/select-github-actions-as-source.webp)

### Paso 2: Verificar el Workflow

1. Ve a la pestaña **Actions** en tu repositorio
2. Deberías ver un workflow llamado "Deploy to GitHub Pages"
3. Si está en rojo (❌), haz click y revisa el error
4. Si no existe ningún workflow, ejecuta manualmente:

   - Click en "Actions" → "Deploy to GitHub Pages" → "Run workflow"

### Paso 3: Esperar el Despliegue

- El primer despliegue tarda **2-5 minutos**
- Verás un ✅ verde cuando esté listo
- Luego podrás acceder a: `https://gorkah.github.io/DIN-FORMATS/`

## 🔍 Verificar Estado Actual

### Opción A: Desde la Terminal

```bash
# Ver el estado del último push
git log -1 --oneline

# Debería mostrar:
# 4387a31 fix: Usar tabla de conversiones exactas DIN + logs de debug...
```

### Opción B: Desde GitHub

1. Ve a `https://github.com/Gorkah/DIN-FORMATS/actions`
2. Mira el último workflow
3. Si está en:
   - ✅ **Verde**: El despliegue fue exitoso → Espera 1-2 minutos más
   - 🟡 **Amarillo**: Se está ejecutando → Espera
   - ❌ **Rojo**: Hay un error → Mira los logs

## 🐛 Problemas Comunes

### Error: "Process completed with exit code 1"

**Causa**: Falta instalar dependencias o hay un error en el build

**Solución**:
```bash
# Probar el build localmente
npm run build

# Si funciona, subir de nuevo
git add .
git commit -m "test: verificar build"
git push origin main
```

### Error: "pages build and deployment"

**Causa**: GitHub Pages no está habilitado

**Solución**: Ve al Paso 1 arriba ⬆️

### Error: "Resource not found"

**Causa**: El nombre del repositorio no coincide con el `base` en `vite.config.js`

**Solución actual**: Ya está configurado correctamente como `/DIN-FORMATS/`

## 📋 Checklist de Verificación

- [ ] GitHub Pages está habilitado en Settings → Pages
- [ ] Source está configurado como "GitHub Actions"
- [ ] El workflow se ejecutó sin errores (✅ verde)
- [ ] Han pasado al menos 2-3 minutos desde el último push
- [ ] La URL es exactamente: `https://gorkah.github.io/DIN-FORMATS/` (con mayúsculas)

## 🎯 URL Correcta

**URL correcta**: https://gorkah.github.io/DIN-FORMATS/

**URLs incorrectas** (darán 404):
- ❌ https://gorkah.github.io/din-formats/ (minúsculas)
- ❌ https://gorkah.github.io/ (sin el nombre del repo)
- ❌ https://gorkah.github.io/DIN-FORMATS (sin la / final)

## 💡 Comandos Útiles

```bash
# Ver el estado de Git
git status

# Ver el último commit
git log -1

# Ver los workflows
# (ve a https://github.com/Gorkah/DIN-FORMATS/actions)

# Re-desplegar manualmente
# 1. Ve a Actions → Deploy to GitHub Pages
# 2. Click en "Run workflow" → "Run workflow"
```

## 📞 Si Aún No Funciona

Envíame:

1. **Captura de pantalla** de Settings → Pages
2. **Captura de pantalla** de Actions (último workflow)
3. **El error exacto** que ves en la consola del navegador (F12)

---

**Última actualización**: Noviembre 2025
