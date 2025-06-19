const campos = [
    "redes_sociales",
    "reels",
    "feeds",
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
        feeds: document.getElementById("feeds").value, 
        portadas: document.getElementById("portadas").value,
        embudo: document.getElementById("embudo").checked,
        leads: document.getElementById("leads").checked,
        guiones: document.getElementById("guiones").checked,
        pagina_web: document.getElementById("pagina_web").value
    };

    console.log("Valores de seleccion (Frontend):", seleccion);

    try {
       
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
       
        campo.addEventListener("change", calcularCotizacion);

        if (campo.tagName === 'SELECT') {
            campo.addEventListener("input", calcularCotizacion); 
        }

        if (campo.type === "checkbox") {
            campo.addEventListener("click", calcularCotizacion);
        }
    }
});
