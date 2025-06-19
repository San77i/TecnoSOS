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
        flyers: document.getElementById("flyers").value,
        portadas: document.getElementById("portadas").value,
        embudo: document.getElementById("embudo").checked,
        leads: document.getElementById("leads").checked,
        guiones: document.getElementById("guiones").checked,
        pagina_web: document.getElementById("pagina_web").value
    };

   };

    // --- LOG 1: Qué se va a enviar al backend ---
    console.log("Valores de seleccion (Frontend):", seleccion); 

    try {
        const response = await fetch("https://tecnosos.onrender.com/Cotizar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(seleccion) 
        });

        // --- LOG 2: La respuesta cruda de la API (estatus, etc.) ---
        console.log("Respuesta de la API (raw):", response);

        // Verifica si la respuesta fue exitosa antes de intentar leerla
        if (!response.ok) {
            const errorText = await response.text(); // Lee el texto del error si no es OK
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // --- LOG 3: Los datos recibidos después de parsear JSON ---
        console.log("Datos de la cotización recibidos (Backend):", data); 
        
        document.getElementById("total").textContent = data.total;
    } catch (error) {
        // --- LOG 4: Cualquier error durante la petición ---
        console.error("Error al obtener la cotización:", error);
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
