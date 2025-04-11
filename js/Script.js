const campos = [
    "redes_sociales",
    "reels",
    "flyers",
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
        feeds: document.getElementById("flyers").value,
        portadas: document.getElementById("portadas").value,
        embudo: document.getElementById("embudo").checked,
        leads: document.getElementById("leads").checked,
        guiones: document.getElementById("guiones").checked,
        pagina_web: document.getElementById("pagina_web").value
    };

    try {
        const response = await fetch("https://tecnosos.onrender.com/cotizar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(seleccion) 
        });

        const data = await response.json();
        document.getElementById("total").textContent = data.total;
    } catch (error) {
        console.error("Error al obtener la cotización", error);
    }
};

campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
        campo.addEventListener("change", calcularCotizacion);
        if (campo.type === "checkbox") {
            campo.addEventListener("click", calcularCotizacion);
        }
    }
});
