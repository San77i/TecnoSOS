/* ============================================================================
   Tecnosos · Captura de leads hacia el CRM
   Pegar este bloque justo antes de </body> en las páginas que tengan formularios
   (por ejemplo index.html), o guardarlo como captura-leads.js e incluirlo con:
   <script src="captura-leads.js" defer></script>

   No cambia lo que el formulario hace hoy (sigue enviando su correo como siempre):
   solo AVISA al CRM, en segundo plano, para que cree el lead.
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
      var clave = ((e.name || "") + " " + (e.id || "") + " " + (e.placeholder || "") + " " + (e.type || "")).toLowerCase();
      var lab = e.id ? form.querySelector('label[for="' + e.id + '"]') : null;
      if (lab) clave += " " + String(lab.textContent || "").toLowerCase();
      if (patron.test(clave) && valor(e)) return valor(e);
    }
    return "";
  }
  // Si en la página está el Cotizador Express, lee lo que el cliente eligió y el total estimado
  function cotizador() {
    var box = document.querySelector("#cotizador");
    if (!box) return null;
    var servicios = [];
    box.querySelectorAll("select").forEach(function (s) { var o = s.options[s.selectedIndex]; if (o && o.value) servicios.push(String(o.text || "").trim()); });
    box.querySelectorAll("input[type=checkbox]:checked, input[type=radio]:checked").forEach(function (c) {
      var l = c.closest("label"); servicios.push(String((l && l.innerText) || c.value || "").trim());
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
    var f = ev.target;
    if (!f || f.tagName !== "FORM") return;
    var d = {
      nombre: campo(f, /nombre|name/), email: campo(f, /e-?mail|correo|mail/), telefono: campo(f, /tel|whats|phone|celular|m[oó]vil/),
      empresa: campo(f, /empresa|company|negocio/), mensaje: valor(f.querySelector("textarea"))
    };
    if (!d.email && !d.telefono) return; // no es un formulario de contacto (búsqueda, suscripción, etc.)
    var c = cotizador(); if (c) d.cotizador = c;
    enviar(d);
  }, true);
})();
