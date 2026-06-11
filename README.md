# 🚀 AstroChat: Tutor IA de Astronomía

**Chatbot educativo con inteligencia artificial gratuita** diseñado para estudiantes de 12 a 18 años. Responde preguntas de astronomía, genera resúmenes descargables en PDF, ofrece tests interactivos y un juego tipo quiz. Todo funciona en el navegador sin instalar nada, desplegado en GitHub Pages y usando Groq (modelo `llama-3.3-70b-versatile`) como motor de IA, con la API Key protegida mediante Cloudflare Workers.

---

## 🎯 ¿Qué hace este chatbot?

El chatbot permite:

- **Responder preguntas** sobre astronomía en lenguaje natural (español, nivel adolescentes).
- **Generar resúmenes extensos** (400+ palabras) en formato PDF, con título, introducción, desarrollo y conclusión. El PDF tiene márgenes profesionales, título en azul, texto gris oscuro y pie de página.
- **Realizar tests interactivos** generados por IA (5 preguntas de opción múltiple, respuestas correctas al final).
- **Jugar un quiz** con 20 preguntas predefinidas (aleatorias, feedback inmediato, guardado de mejor puntuación).
- **Exportar la conversación completa** a PDF.
- **Guardar el historial de chat** durante la sesión (opcional, con botón de limpieza).
- **Botón de salida rápida** que redirige a Google (útil en entornos educativos).

Todo funciona en dispositivos móviles y ordenadores, sin registro ni instalación.

---

## ⚙️ ¿Cómo funciona técnicamente?

El sistema se compone de **dos partes**:

### 1. Frontend (HTML/CSS/JS) – Alojado en GitHub Pages
- Un único archivo `index.html` que contiene toda la interfaz, lógica de chat, gestión del historial, generación del PDF y el quiz.
- Las preguntas del usuario se envían a un **Cloudflare Worker** mediante `fetch` (método POST).
- Se mantiene un historial de los últimos 10 mensajes para dar contexto a la IA.
- El diseño es responsivo con CSS Grid y Flex, optimizado para móvil (menú horizontal, botones táctiles).

### 2. Backend – Cloudflare Worker (proxy)
- El Worker recibe las peticiones del frontend, añade la **API Key de Groq** (almacenada como variable de entorno `GROQ_API_KEY`) y llama a la API de Groq.
- Devuelve la respuesta generada por la IA al frontend.
- También maneja CORS para permitir peticiones desde GitHub Pages.
- El código del Worker está en `worker.js` (se despliega en Cloudflare).

**Flujo de una pregunta:**
Usuario escribe → index.html → fetch → Cloudflare Worker → Groq API → Worker → index.html → muestra respuesta

---

## La arquitectura está diseñada para ser **escalable y mantenible**:

- El **Worker es genérico**: el `systemPrompt` (la “personalidad” de la IA) se envía desde el frontend. Así el mismo Worker puede servir para múltiples chatbots de diferentes materias (matemáticas, historia, etc.) simplemente cambiando el prompt en el `index.html` correspondiente.
- El frontend es un único archivo que puede ser **forkeado** por cualquier usuario, modificado (colores, tema, preguntas del quiz) y redeployado en sus propias GitHub Pages sin tocar el Worker.
- El almacenamiento de mejor puntuación y del historial opcional usa `localStorage`, sin base de datos.

**Ejemplo de adaptación a “Matemáticas”:**
1. Copia el `index.html`.
2. Cambia `SYSTEM_PROMPT_ASTRO` por `SYSTEM_PROMPT_MATES`.
3. Modifica `questionBank` con preguntas de matemáticas.
4. Sube a un nuevo repositorio → obtienes un chatbot de matemáticas que usa el mismo Worker.

---


---

## 🧩 Arquitectura y escalabilidad

La arquitectura está diseñada para ser **escalable y mantenible**:

- El **Worker es genérico**: el `systemPrompt` (la “personalidad” de la IA) se envía desde el frontend. Así el mismo Worker puede servir para múltiples chatbots de diferentes materias (matemáticas, historia, etc.) simplemente cambiando el prompt en el `index.html` correspondiente.
- El frontend es un único archivo que puede ser **forkeado** por cualquier usuario, modificado (colores, tema, preguntas del quiz) y redeployado en sus propias GitHub Pages sin tocar el Worker.
- El almacenamiento de mejor puntuación y del historial opcional usa `localStorage`, sin base de datos.

**Ejemplo de adaptación a “Matemáticas”:**
1. Copia el `index.html`.
2. Cambia `SYSTEM_PROMPT_ASTRO` por `SYSTEM_PROMPT_MATES`.
3. Modifica `questionBank` con preguntas de matemáticas.
4. Sube a un nuevo repositorio → obtienes un chatbot de matemáticas que usa el mismo Worker.

---

## 🛠️ Tecnologías gratuitas utilizadas

| Herramienta | Uso | Límite gratuito |
|-------------|-----|------------------|
| **Groq** | Modelo LLM (`llama-3.3-70b-versatile`) | 30 peticiones/minuto, 14.400/día |
| **Cloudflare Workers** | Proxy seguro para ocultar API Key | 100.000 peticiones/día |
| **GitHub Pages** | Alojamiento del frontend | Ilimitado (repositorios públicos) |
| **jsPDF** | Generación de PDF en el cliente | Ilimitado |
| **Font Awesome / SVG** | Iconos | Gratuito |

No se requiere tarjeta de crédito.

---

## 📁 Estructura del proyecto
astro-chatbot/
├── index.html # Interfaz completa (HTML, CSS, JS)
├── worker.js # Código para Cloudflare Worker
└── README.md # Este archivo

---

## Convertir el chatbot a otra materia (ej. historia)

Cambia SYSTEM_PROMPT_ASTRO por un prompt de historia.
Ajusta las preguntas sugeridas y el questionBank.
Opcional: modifica el título y los mensajes de bienvenida.
Redeploya en GitHub Pages.

El Worker permanece inalterado.

---

## Desarrollado con ❤️ para la comunidad educativa.

## 🔭 El conocimiento del universo al alcance de todos, gratis y sin barreras.
