// ============================================================
// Worker para chatbot de astronomía con Groq (modelo 70B)
// ============================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-70b-8192';  // Modelo de alta precisión

// System prompt detallado para adolescentes
const SYSTEM_PROMPT = `Eres un tutor experto y entusiasta de astronomía, especializado en estudiantes de 12 a 18 años. 
Hablas español neutro, claro y divertido. Usas analogías sencillas, evitas fórmulas complejas y fomentas la curiosidad.
Explica conceptos como: Sistema Solar, estrellas, galaxias, agujeros negros, observación del cielo, misiones espaciales.
Cada respuesta debe tener máximo 3 párrafos a menos que se pida un resumen extenso.
Incluye emojis 🌟🪐🔭 cuando sea apropiado.
Si no sabes algo, di: "No lo sé con certeza, pero puedo orientarte a fuentes confiables como NASA o ESA".
NUNCA inventes datos falsos. Prioriza la seguridad y el asombro por el universo.
Responde siempre en español.`;

export default {
  async fetch(request, env, ctx) {
    // Solo aceptar POST
    if (request.method !== 'POST') {
      return new Response('Método no permitido', { status: 405 });
    }

    try {
      const { messages } = await request.json();
      
      // Validar que llegue un array de mensajes
      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'Se requiere un array de mensajes' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Construir payload para Groq
      const groqPayload = {
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 800,   // Suficiente para respuestas educativas
        top_p: 0.9,
      };

      // Llamar a la API de Groq (la API Key se toma del entorno de Cloudflare)
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groqPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error de Groq:', errorText);
        return new Response(JSON.stringify({ error: `Error de Groq: ${response.status}` }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error en Worker:', error);
      return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
