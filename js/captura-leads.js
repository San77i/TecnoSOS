/* ============================================================================
   Tecnosos · Captura de leads hacia el CRM
   Incluir con: <script src="js/captura-leads.js" defer></script>

   No cambia lo que el formulario hace hoy (sigue enviando su correo como siempre):
   solo AVISA al CRM, en segundo plano, para que cree el lead.

   CAMBIOS:
   - Escucha el envío en fase "bubble" y respeta defaultPrevented: así solo avisa
     al CRM cuando el formulario pasó la validación antispam (Turnstile, honeypots,
     nombre y email/teléfono). Antes se ejecutaba primero y mandaba todo, incluso
     envíos bloqueados o de bots.
   - Corrige la lectura de los checkboxes del cotizador (antes enviaba "on").
   ============================================================================ */
(function () {
  var URL_CRM = "https://bqskeefumyyeadbqsvru.supabase.co/functions/v1/nuevo-lead";
  var TOKEN = "tsw_bcd50845669b54f0282fc7c64fe4de4c";

  // Guarda de dónde vino la visita (campaña y página anterior) mientras navega
  try {
    var q = new URLSearchParams(location.search), u = JSON.parse(sessionStorage.getItem("ts_utm") || "{}");
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (k) { if (q.get(k)) u[k] = q.get(k); });
    if (!sessionStorage.getItem("ts_ref") && document.referrer) sessionStorage.setItem("ts_ref", document.referrer);
    sessionStorage.setItem("ts_utm", JSON.stringify(u));
  } catch (e) {}

  function valor(el) { return el ? String(el.value || "").trim() : ""; }
  function campo(form, patron) {
    var els = form.querySelectorAll("input, textarea, select");
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (/^(submit|button|hidden|checkbox|radio|password|file)$/i.test(e.type)) continue;
      if (e.name === "website") continue; // honeypot: nunca leerlo como dato
      var clave = ((e.name || "") + " " + (e.id || "") + " " + (e.placeholder || "") + " " + (e.type || "")).toLowerCase();
      var lab = e.id ? form.querySelector('label[for="' + e.id + '"]') : null;
      if (lab) clave += " " + String(lab.textContent || "").toLowerCase();
      if (patron.test(clave) && valor(e)) return valor(e);
    }
    return "";
  }
  // Busca el texto de la etiqueta de un checkbox (sirve si la etiqueta lo envuelve o si usa for="id")
  function textoEtiqueta(c) {
    var l = c.closest("label") || (c.id ? document.querySelector('label[for="' + c.id + '"]') : null);
    return String((l && (l.innerText || l.textContent)) || "").trim();
  }
  // Si en la página está el Cotizador Express, lee lo que el cliente eligió y el total estimado
  function cotizador() {
    var box = document.querySelector("#cotizador");
    if (!box) return null;
    var servicios = [];
    box.querySelectorAll("select").forEach(function (s) { var o = s.options[s.selectedIndex]; if (o && o.value) servicios.push(String(o.text || "").trim()); });
    box.querySelectorAll("input[type=checkbox]:checked, input[type=radio]:checked").forEach(function (c) {
      var t = textoEtiqueta(c); if (t) servicios.push(t);
    });
    var txt = String(box.innerText || box.textContent || "");
    var m = txt.match(/INVERSI[ÓO]N ESTIMADA[\s\S]{0,60}?(\$\s*[\d.,]+(?:\s*(?:USD|ARS|U\$S))?)/i);
    return (servicios.length || m) ? { servicios: servicios, total: m ? m[1].replace(/\s+/g, " ").trim() : "" } : null;
  }
  function enviar(datos) {
    var d = {}, utm = {};
    try { utm = JSON.parse(sessionStorage.getItem("ts_utm") || "{}"); } catch (e) {}
    d.token = TOKEN; d.pagina = location.pathname + location.hash; d.referrer = sessionStorage.getItem("ts_ref") || "";
    Object.keys(utm).forEach(function (k) { d[k] = utm[k]; });
    Object.keys(datos || {}).forEach(function (k) { d[k] = datos[k]; });
    try { fetch(URL_CRM, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d), keepalive: true }).catch(function () {}); } catch (e) {}
  }
  // Por si algún formulario envía sin disparar el evento "submit": llamar tecnososEnviarLead({nombre, email, telefono, mensaje})
  window.tecnososEnviarLead = enviar;

  document.addEventListener("submit", function (ev) {
    if (ev.defaultPrevented) return; // la validación antispam bloqueó el envío: no avisar al CRM
    var f = ev.target;
    if (!f || f.tagName !== "FORM") return;
    var d = {
      nombre: campo(f, /nombre|name/), email: campo(f, /e-?mail|correo|mail/), telefono: campo(f, /tel|whats|phone|celular|m[oó]vil/),
      empresa: campo(f, /empresa|company|negocio/), mensaje: valor(f.querySelector("textarea"))
    };
    if (!d.email && !d.telefono) return; // no es un formulario de contacto (búsqueda, suscripción, etc.)
    var c = cotizador(); if (c) d.cotizador = c;
    enviar(d);
  }, false); // fase "bubble": corre DESPUÉS de la validación del formulario
})();
