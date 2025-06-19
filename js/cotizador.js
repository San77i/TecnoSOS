const campos = [
    "redes_sociales",
    "reels",
    // Asegúrate de que 'flyers' aquí se use si el ID en HTML fuera 'flyers'.
    // Como hemos acordado usar 'feeds' en HTML y JS, esta lista está bien.
    "feeds", // <-- Cambiado de "flyers" a "feeds" para consistencia con tu HTML y backend
    "portadas",
    "pagina_web",
    "embudo",
    "leads",
    "guiones"
];

const calcularCotizacion = async () => {
    const seleccion = {
        redes_sociales: document.getElementById("redes_sociales").value,
        reels: document.getElementById("reels").value,
        // ¡Importante! Aquí la propiedad y el ID deben coincidir con tu HTML y backend.
        // Si tu HTML tiene <select id="feeds"> y tu backend espera 'feeds', esto es correcto.
        feeds: document.getElementById("feeds").value, 
        portadas: document.getElementById("portadas").value,
        embudo: document.getElementById("embudo").checked,
        leads: document.getElementById("leads").checked,
        guiones: document.getElementById("guiones").checked,
        pagina_web: document.getElementById("pagina_web").value
    };

    console.log("Valores de seleccion (Frontend):", seleccion);

    try {
        // CORRECCIÓN 1: La URL del endpoint en Render.com debe ser EXACTAMENTE la misma que en tu backend (index.js).
        // Tu backend define app.post("/cotizador", así que aquí debe ser "/cotizador" con 'c' minúscula.
        const response = await fetch("https://tecnosos.onrender.com/cotizador", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(seleccion)
        });

        console.log("Respuesta de la API (raw):", response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        console.log("Datos de la cotización recibidos (Backend):", data);

        document.getElementById("total").textContent = data.total;
    } catch (error) {
        console.error("Error al obtener la cotización:", error);
    }
};

campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
        // Evento 'change' es bueno para la mayoría de los campos y se disparará cuando el valor cambie
        campo.addEventListener("change", calcularCotizacion);

        // CORRECCIÓN 2: Para los <select>, 'input' es más consistente para detectar cambios inmediatos que 'click'
        // 'click' se dispara al hacer clic en el select, no necesariamente al cambiar la opción.
        // 'input' en <select> es una alternativa que algunos navegadores manejan mejor que 'change' para inmediatez.
        if (campo.tagName === 'SELECT') {
            campo.addEventListener("input", calcularCotizacion); 
        }

        // Para los checkboxes, 'click' es el evento adecuado para detectar el cambio de estado
        if (campo.type === "checkbox") {
            campo.addEventListener("click", calcularCotizacion);
        }
    }
});
