# Validación Gate 1+ — <variant> (brief Presencia)

Pipeline: `presencia_brief`  
Variante: digital ☐ · tienda ☐ · catálogo ☐  
HTML: `brief-presencia-*.html`  
PDF: `Wavys-Presencia-*.pdf`  
Fecha: YYYY-MM-DD

---

| ID | ✅/❌ | Valor medido | Notas |
|----|-------|--------------|-------|
| PB-01 | | STORYTELLING leída | |
| PB-02 | | plantilla: | |
| PB-03 | | cover sin S/ | |
| PB-04 | | caps 01-07 | |
| PB-05 | | story box | |
| PB-06 | | quote | |
| PB-07 | | includes 6 | |
| PB-08 | | suscripción antes precio | |
| PB-09 | | precio solo cap 06 | |
| PB-10 | | precios oficiales | |
| PB-11 | | FAQ | |
| PB-12 | | CTA suave | |
| PB-13 | | tono PE | |
| PB-14 | | pdf mtime: | |
| PB-15 | | imágenes slides | |
| PB-16 | | N/A cutout | |
| PB-17 | | md sync | |

## Verificación cover (grep)

```bash
# PB-03 — no precio en primeras líneas cover
head -80 brief-presencia-digital.html | grep -E 'S/[0-9]' && echo FAIL || echo OK
```

## Loops

| Intento | ID | Acción |
|---------|-----|--------|

**PDF autorizado:** ☐ Sí ☐ No
