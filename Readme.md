# TecnoSOS - Sitio Web v2.0

**ERP Inteligente & Marketing Digital**

---

## 📋 Estructura del Proyecto
v2.0/
├── index.html
├── css/
│ └── style.css
├── js/
│ └── calculadora.js
└── assets/
└── img/
├── dashboard.gif
└── favicon.ico


---

## 🎨 Diseño

| Característica | Descripción |
|----------------|-------------|
| **Tipografía** | Inter (Google Fonts) |
| **Iconos** | Font Awesome 6 |
| **Layout** | CSS Grid + Flexbox |
| **Responsive** | Desktop, Tablet (768px), Móvil (480px) |
| **Paleta** | Azul `#2563eb`, Cyan `#06b6d4`, Oscuro `#0f172a` |

---

## 🧩 Secciones

### 1. Navbar
- Logo SVG + texto "TECNO**SOS**"
- Enlaces: Inicio, Servicios, ERP, Cotizador, Contacto
- Sticky con backdrop blur
- Responsive: columna en móvil

### 2. Hero
- Título principal con highlight azul
- Subtítulo descriptivo
- Botones: **Cotizador Express** y **Solicitar Demo**
- Stats: +30% Eficiencia, 100% Adaptable, 24/7 Soporte
- GIF circular en gradiente azul-cyan

### 3. Servicios (Cards)
- **ERP Modular** - Odoo, SAP B1, Personalizado
- **Insights Analíticos** - Power BI, Looker Studio, KPIs
- **TechMedia Solutions** - Meta Ads, LinkedIn B2B, Contenido

### 4. Módulos ERP
- Compras, Ventas, Inventario, POS, Contabilidad
- Grid responsive con bordes acentuados

### 5. Cotizador
- Selects: Redes Sociales, Reels, Flyers, Portadas, Páginas Web
- Checkboxes: Embudo MKT, Leads Calificados, Guiones
- Total calculado **100% en local** (sin backend)
- Precios en USD
- Botón "Solicitar Propuesta Formal"

### 6. Contacto
- Formulario con validación inteligente
- Mensajes de error solo al validar
- Endpoint PHP oculto en JavaScript
- Panel lateral: email, WhatsApp, redes sociales

### 7. Footer
- Copyright, Política de Privacidad, Términos de Servicio

---

## ⚙️ Funcionalidades

### Calculadora Local (`calculadora.js`)

| Servicio | Precio |
|----------|--------|
| Instagram | $150/mes |
| Facebook | $150/mes |
| WhatsApp | $120/mes |
| LinkedIn | $180/mes |
| Combinaciones (2 redes) | $230-$280/mes |
| Todas las redes | $450/mes |
| Reels (c/u) | $15 |
| Flyers (c/u) | $12 |
| Portadas (c/u) | $40 |
| Páginas Web (proyecto) | $800 c/u |
| Embudo MKT | $350/mes |
| Leads Calificados | $500/mes |
| Guiones | $200/mes |

### Formulario de Contacto

| Campo    | Validación |
|----------|------------|
| Nombre   | Requerido  |
| Email    | Requerido + formato válido |
| Teléfono | Requerido  |
| Mensaje | Requerido   |

- Errores visibles **solo al validar**
- Borde rojo en campos inválidos
- Borde verde en campos válidos
- Spinner durante el envío
- Endpoint: (oculto en JS)

---

## 🔗 Enlaces Externos

| Recurso | URL |
|---------|-----|
| Google Fonts | `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap` |
| Font Awesome | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css` |
| Google Calendar | `https://calendar.app.google/baeHowJr1qRHdKzb6` |
| WhatsApp Flotante | `#` (personalizable) |

---

## 📱 Media Queries

| Breakpoint | Dispositivo |
|------------|-------------|
| `max-width: 992px` | Tablets grandes / Laptops chicas |
| `max-width: 768px` | Tablets |
| `max-width: 480px` | Móviles |

---

## ✅ Checklist de Implementación

- [x] CSS sin duplicados
- [x] Media queries al final del archivo
- [x] Mensajes de validación ocultos por defecto
- [x] Formulario y panel de contacto en columnas separadas
- [x] URL del PHP oculta en JavaScript
- [x] Calculadora 100% local
- [x] GIF circular responsive
- [x] Logo con imagen + texto
- [x] Márgenes adecuados en PC
- [x] Botón "Solicitar Demo" con link a Google Calendar

---
