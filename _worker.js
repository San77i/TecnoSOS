export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Intercepter el envío del formulario en /submit-form
    if (request.method === "POST" && url.pathname === "/submit-form") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const message = formData.get("message");

        // Protección básica Anti-Spam
        if (formData.get("botcheck")) {
          return new Response("Spam detectado", { status: 400 });
        }

        // Llamar a la API de Resend usando tu secreto guardado
        const emailResponse = await fetch("https://resend.com", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Web TecnoSOS <info@tecnosos.net>",
            to: ["info@tecnosos.net"],
            subject: `Nuevo contacto de ${name}`,
            html: `
              <h3>Nuevo lead desde el sitio web</h3>
              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Teléfono:</strong> ${phone}</p>
              <p><strong>Mensaje:</strong> ${message}</p>
            `
          })
        });

        if (emailResponse.ok) {
          // Respuesta HTML completa con redirección automática en 5 segundos
          return new Response(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!-- Redirección automática del navegador después de 5 segundos -->
                <meta http-equiv="refresh" content="5;url=${url.origin}">
                <title>¡Gracias por escribirnos! - TecnoSOS</title>
                <link rel="stylesheet" href="https://cloudflare.com">
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
                    <div class="icon"><i class="fas fa-check-circle"></i></div>
                    <h1>¡Mensaje Recibido!</h1>
                    <p>Gracias por comunicarte con nosotros, a la brevedad nuestro equipo se contactará contigo.</p>
                    <p class="redirect-text">Serás redirigido a la página de inicio en <span id="countdown">5</span> segundos...</p>
                    <a href="${url.origin}" class="btn">Volver ahora</a>
                </div>

                <script>
                    // Contador visual regresivo para mejorar la experiencia del usuario
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
          return new Response("Error al enviar el correo. Por favor, intenta de nuevo.", { status: 500 });
        }

      } catch (err) {
        return new Response("Error interno del servidor", { status: 500 });
      }
    }

    // Permitir el tráfico normal de las páginas estáticas
    return env.ASSETS.fetch(request);
  }
};
