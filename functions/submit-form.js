export async function onRequestPost(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  try {
    const formData = await request.formData();
    const name = formData.get("name") || "Sin nombre";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "No especificado";
    const message = formData.get("message") || "";

    // 1. Protección Anti-Spam (Honeypot)
    if (formData.get("botcheck")) {
      return new Response("Spam detectado", { status: 400 });
    }

    // 2. Despacho a Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Web TecnoSOS <info@tecnosos.net>",
        to: ["info@tecnosos.net", "tecnosos13@gmail.com"],
        reply_to: email,
        subject: `Nuevo contacto web: ${name}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Nuevo lead desde TecnoSOS</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Teléfono / WhatsApp:</strong> ${phone}</p>
            <p><strong>Mensaje:</strong></p>
            <blockquote style="background: #f8fafc; border-left: 4px solid #0070f3; padding: 12px 16px; margin: 0; white-space: pre-wrap;">${message}</blockquote>
          </div>
        `
      })
    });

    // 3. Manejo de respuesta
    if (emailResponse.ok) {
      return new Response(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="refresh" content="5;url=${url.origin}">
            <title>¡Gracias por escribirnos! - TecnoSOS</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #0f172a;
                    color: #ffffff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    text-align: center;
                }
                .card {
                    background: #1e293b;
                    padding: 40px 30px;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                    max-width: 500px;
                    width: 90%;
                    border: 1px solid #334155;
                }
                .icon {
                    font-size: 50px;
                    color: #10b981;
                    margin-bottom: 20px;
                }
                h1 {
                    font-size: 26px;
                    margin-bottom: 15px;
                    color: #f8fafc;
                }
                p {
                    font-size: 16px;
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .redirect-text {
                    font-size: 14px;
                    color: #64748b;
                    margin-top: 15px;
                }
                .btn {
                    display: inline-block;
                    background: #0070f3;
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 14px;
                    transition: background 0.2s;
                }
                .btn:hover {
                    background: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">&#10004;</div>
                <h1>¡Mensaje Recibido!</h1>
                <p>Gracias por comunicarte con nosotros, a la brevedad nuestro equipo se contactará contigo.</p>
                <p class="redirect-text">Serás redirigido a la página de inicio en <span id="countdown">5</span> segundos...</p>
                <a href="${url.origin}" class="btn">Volver ahora</a>
            </div>

            <script>
                let seconds = 5;
                const countdownElement = document.getElementById('countdown');
                const interval = setInterval(() => {
                    seconds--;
                    if (countdownElement) countdownElement.textContent = seconds;
                    if (seconds <= 0) clearInterval(interval);
                }, 1000);
            </script>
        </body>
        </html>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    } else {
      const errorText = await emailResponse.text();
      console.error("Resend API Error:", errorText);
      return new Response(`Error al enviar el correo a través de la API: ${errorText}`, { status: 500 });
    }

  } catch (err) {
    console.error("Error en Pages Function:", err);
    return new Response("Error interno del servidor en la función", { status: 500 });
  }
}
