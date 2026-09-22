export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Escuchar únicamente cuando el formulario envíe un POST a /submit-form
    if (request.method === "POST" && url.pathname === "/submit-form") {
      try {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const message = formData.get("message");

        // Protección básica Anti-Spam (Si un bot rellena el campo oculto, se rechaza)
        if (formData.get("botcheck")) {
          return new Response("Spam detectado", { status: 400 });
        }

        // Llamar de manera segura a la API externa de envío de correos
        const emailResponse = await fetch("https://resend.com", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`, // Tu clave oculta y segura
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Web TecnoSOS <info@tecnosos.net>",
            to: ["info@tecnosos.net"], // Tu buzón corporativo
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
          // Si el correo sale bien, mostramos un aviso directo en pantalla limpia
          return new Response("Mensaje enviado con éxito. En breve nos pondremos en contacto.", {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
        } else {
          return new Response("Error al enviar el correo. Por favor, intenta de nuevo.", { status: 500 });
        }

      } catch (err) {
        return new Response("Error interno del servidor", { status: 500 });
      }
    }

    // Si no es el envío del formulario, Cloudflare sirve las páginas normales (.html, .css, etc.)
    return env.ASSETS.fetch(request);
  }
};
