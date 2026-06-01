export default {
  async fetch(request, env, ctx) {
    // 1. Manejar petición preflight OPTIONS (necesario para CORS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 2. Solo aceptar método POST
    if (request.method !== "POST") {
      return new Response("Método no permitido", { status: 405 });
    }

    try {
      // 3. Obtener el historial de mensajes enviado desde tu página web
      const { messages } = await request.json();
      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: "Se requiere un array de mensajes" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      // 4. Definir el "rol" que tendrá la IA (el system prompt)
      const systemPrompt = `Eres un tutor experto y entusiasta de astronomía para estudiantes de 12 a 18 años. 
      Hablas español neutro, claro y divertido. Usas analogías sencillas. 
      Explica conceptos como Sistema Solar, estrellas, galaxias, agujeros negros, observación del cielo, misiones espaciales. 
      Respuestas cortas (máximo 3 párrafos) a menos que se pida resumen extenso. 
      Incluye emojis. Si no sabes algo, admítelo.`;

      // 5. Preparar la solicitud para la API de Groq
      const groqPayload = {
        model: "llama3-70b-8192",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 800,
      };

      // 6. Enviar la solicitud a Groq
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groqPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error de Groq:", errorText);
        return new Response(JSON.stringify({ error: `Error de Groq: ${response.status}` }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      // 7. Procesar la respuesta de Groq y devolverla
      const data = await response.json();
      const reply = data.choices[0].message.content;
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    } catch (error) {
      console.error("Error en Worker:", error);
      return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
