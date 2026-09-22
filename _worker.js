addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Interceptar exclusivamente el envío del formulario
  if (event.request.method === "POST" && url.pathname === "/submit-form") {
    event.respondWith(handleFormSubmission(event.request, url.origin));
  }
  // Si es cualquier otro archivo (.html, .css, etc.), Cloudflare lo sirve de forma normal automáticamente
});

async function handleFormSubmission(request, origin) {
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

    // Envío seguro a través de Resend usando la variable global secreta
    // Nota: Al cambiar a este formato clásico, las variables de entorno se leen directamente como globales (RESEND_API_KEY)
    const emailResponse = await fetch("https://resend.com", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
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
      // Retornar la pantalla de éxito estilizada con redirección en 5 segundos
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
                .card { background: #1e293b; padding: 40px 30px; border-radius: 16px; max-width: 500px; width: 90%; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
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
      return new Response("Error al enviar el correo a través de la API externa.", { status: 500 });
    }

  } catch (err) {
    return new Response("Error interno al procesar el formulario", { status: 500 });
  }
}
