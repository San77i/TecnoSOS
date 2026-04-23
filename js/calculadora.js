/**
 * TecnoSOS - Versión Final Ultra-Compatible
 */

// 1. Datos de precios
const DATA_PRECIOS = {
    redes: {
        'instagram': 150, 'facebook': 150, 'whatsapp': 120, 'linkedin': 180,
        'instagram+facebook': 250, 'instagram+whatsapp': 230, 'instagram+linkedin': 280,
        'facebook+whatsapp': 230, 'facebook+linkedin': 280, 'whatsapp+linkedin': 260,
        'todas': 450
    },
    servicios: {
        'reels': 15,
        'flyers': 12,
        'portadas': 40,
        'pagina_web': 800
    },
    extras: {
        'embudo': 350,
        'leads': 500,
        'guiones': 200
    }
};

// 2. Función de cálculo (Hecha lo más simple posible)
function calcularTecnoSOS() {
    let total = 0;

    // Redes
    const redes = document.getElementById('redes_sociales');
    if (redes && DATA_PRECIOS.redes[redes.value]) {
        total += DATA_PRECIOS.redes[redes.value];
    }

    // Cantidades (Reels, Flyers, etc)
    Object.keys(DATA_PRECIOS.servicios).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            total += (parseInt(el.value) || 0) * DATA_PRECIOS.servicios[id];
        }
    });

    // Checkboxes (Extras)
    Object.keys(DATA_PRECIOS.extras).forEach(id => {
        const el = document.getElementById(id);
        if (el && el.checked) {
            total += DATA_PRECIOS.extras[id];
        }
    });

    // Mostrar
    const display = document.getElementById('total');
    if (display) {
        display.innerText = '$' + total.toLocaleString('en-US');
    }
}

// 3. Inicialización Manual
window.onload = function() {
    const form = document.getElementById('contactForm');
    
    // Asignar eventos a los inputs de la calculadora
    const inputs = document.querySelectorAll('select, input[type="checkbox"], input[type="number"]');
    inputs.forEach(input => {
        input.onchange = calcularTecnoSOS;
        input.oninput = calcularTecnoSOS; // Para capturar cambios de número en tiempo real
    });

    // Manejo del Formulario
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const btn = document.getElementById('submitButton');
            const success = document.getElementById('submitSuccessMessage');
            const error = document.getElementById('submitErrorMessage');

            btn.disabled = true;
            btn.innerHTML = "Enviando...";

            const formData = new FormData(form);

            fetch('https://c2801338.ferozo.com/enviar_correo.php', {
                method: 'POST',
                body: formData,
                mode: 'cors' // Forzamos modo CORS para Android
            })
            .then(res => {
                if (res.ok) {
                    if(success) success.style.display = 'block';
                    form.reset();
                    calcularTecnoSOS();
                } else {
                    throw new Error();
                }
            })
            .catch(() => {
                if(error) error.style.display = 'block';
            })
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = 'Enviar Mensaje';
            });
        };
    }
    
    // Cálculo inicial
    calcularTecnoSOS();
};
