/**
 * TecnoSOS - Versión Final Certificada para Android
 */

// 1. Configuraciones de Precios
const CONFIG_TECNO = {
    redes: {
        'instagram': 150, 'facebook': 150, 'whatsapp': 120, 'linkedin': 180,
        'instagram+facebook': 250, 'instagram+whatsapp': 230, 'instagram+linkedin': 280,
        'facebook+whatsapp': 230, 'facebook+linkedin': 280, 'whatsapp+linkedin': 260,
        'todas': 450
    },
    unitarios: {
        'reels': 15,
        'flyers': 12,
        'portadas': 40,
        'pagina_web': 800
    },
    adicionales: {
        'embudo': 350,
        'leads': 500,
        'guiones': 200
    }
};

// 2. Función de Cálculo (Ahora es una constante para evitar sobreescritura)
const calcularTotal = function() {
    let total = 0;

    try {
        // Redes Sociales
        const redes = document.getElementById('redes_sociales');
        if (redes && CONFIG_TECNO.redes[redes.value]) {
            total += CONFIG_TECNO.redes[redes.value];
        }

        // Cantidades multiplicables
        ['reels', 'flyers', 'portadas', 'pagina_web'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const cantidad = parseInt(el.value) || 0;
                total += (cantidad * CONFIG_TECNO.unitarios[id]);
            }
        });

        // Checkboxes
        ['embudo', 'leads', 'guiones'].forEach(id => {
            const check = document.getElementById(id);
            if (check && check.checked) {
                total += CONFIG_TECNO.adicionales[id];
            }
        });

        // Mostrar resultado
        const display = document.getElementById('total');
        if (display) {
            display.textContent = '$' + total.toLocaleString('en-US');
        }
    } catch (err) {
        console.error("Error en calculador:", err);
    }
};

// 3. Gestión del Formulario con Fetch (CORS optimizado)
function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submitButton');
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        fetch('https://c2801338.ferozo.com/enviar_correo.php', {
            method: 'POST',
            mode: 'no-cors',
            body: new FormData(form)
            
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            document.getElementById('submitSuccessMessage').style.display = 'block';
            form.reset();
            calcularTotal();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('submitErrorMessage').style.display = 'block';
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
        });
    });
}

// 4. Inicialización Robusta
(function() {
    // Hacemos que la función sea visible para los "onchange" del HTML
    window.calcularTotal = calcularTotal;

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setupForm();
        calcularTotal();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setupForm();
            calcularTotal();
        });
    }
})();
