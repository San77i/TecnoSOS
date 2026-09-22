export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Interceptar exclusivamente la ruta del formulario
    if (request.method === "POST" && url.pathname === "/submit-form") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const message = formData.get("message");

        // Validación Anti-Spam básica
        if (formData.get("botcheck")) {
          return new Response("Spam detectado", { status: 400 });
        }

        // Llamar de forma segura a la API externa de Resend usando tu secreto
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
          // Renderizar directamente la pantalla de éxito estilizada
          return new Response(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="refresh" content="5;url=https://tecnosos.net">
                <title>¡Gracias por escribirnos! - TecnoSOS</title>
                <link rel="stylesheet" href="https://cloudflare.com">
                <style>
                    body { margin: 0; padding: 0; font-family: sans-serif; background: #0f172a; color: #ffffff; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; }
                    .card { background: #1e293b; padding: 40px 30px; border-radius: 16px; max-width: 500px; width: 90%; border: 1px solid #334155; }
                    .icon { font-size: 50px; color: #10b981; margin-bottom: 20px; }
                    h1 { font-size: 26px; margin-bottom: 15px; }
                    p { font-size: 16px; color: #94a3b8; line-height: 1.6; }
                    .redirect-text { font-size: 14px; color: #64748b; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="icon"><i class="fas fa-check-circle"></i></div>
                    <h1>¡Mensaje Recibido!</h1>
                    <p>Gracias por comunicarte con nosotros, a la brevedad nuestro equipo se contactará contigo.</p>
                    <p class="redirect-text">Serás redirigido a la página de inicio en <span id="countdown">5</span> segundos...</p>
                </div>
                <script>
                    let seconds = 5;
                    const countdownElement = document.getElementById('countdown');
                    setInterval(() => {
                        seconds--;
                        if (countdownElement) countdownElement.textContent = seconds;
                    }, 1000);
                </script>
            </body>
            </html>
          `, {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          });
        } else {
          return new Response("Error al enviar el correo a través de la API", { status: 500 });
        }

      } catch (err) {
        return new Response("Error interno del servidor", { status: 500 });
      }
    }

    // Método universal de Cloudflare Pages para dejar pasar el tráfico estático normal
    return fetch(request);
  }
};
