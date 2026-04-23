/**
 * TecnoSOS - Calculadora + Formulario
 * Versión: 4.3 (Fix para Android y redundancias eliminadas)
 */

var PRECIOS = {
    redes: {
        'instagram': 150, 'facebook': 150, 'whatsapp': 120, 'linkedin': 180,
        'instagram+facebook': 250, 'instagram+whatsapp': 230, 'instagram+linkedin': 280,
        'facebook+whatsapp': 230, 'facebook+linkedin': 280, 'whatsapp+linkedin': 260,
        'todas': 450
    },
    reelUnitario: 15,
    flyerUnitario: 12,
    portadaUnitaria: 40,
    paginaWebUnitaria: 800,
    adicionales: { embudo: 350, leads: 500, guiones: 200 }
};

// --- CALCULADORA ---
function calcularTotal() {
    var total = 0;
    
    var redesSelect = document.getElementById('redes_sociales');
    if (redesSelect && PRECIOS.redes[redesSelect.value]) {
        total += PRECIOS.redes[redesSelect.value];
    }
    
    // Función auxiliar para sumar selects numéricos
    ['reels', 'flyers', 'portadas', 'pagina_web'].forEach(id => {
        var el = document.getElementById(id);
        if (el) {
            var cant = parseInt(el.value) || 0;
            var precioKey = id === 'pagina_web' ? 'paginaWebUnitaria' : id.slice(0, -1) + 'Unitario';
            // Ajuste manual para nombres que no siguen el patrón exacto
            if(id === 'portadas') precioKey = 'portadaUnitaria';
            if(id === 'pagina_web') precioKey = 'paginaWebUnitaria';
            
            total += (cant * (PRECIOS[precioKey] || 0));
        }
    });

    if (document.getElementById('embudo')?.checked) total += PRECIOS.adicionales.embudo;
    if (document.getElementById('leads')?.checked) total += PRECIOS.adicionales.leads;
    if (document.getElementById('guiones')?.checked) total += PRECIOS.adicionales.guiones;
    
    var totalDisplay = document.getElementById('total');
    if (totalDisplay) {
        totalDisplay.textContent = '$' + total.toLocaleString('en-US');
    }
}

// --- FORMULARIO ---
function inicializarFormulario() {
    var PHP_ENDPOINT = 'https://c2801338.ferozo.com/enviar_correo.php';
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submitButton = document.getElementById('submitButton');
        var formData = new FormData(form);

        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', PHP_ENDPOINT, true);
        
        xhr.onload = function() {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar Mensaje';
            if (xhr.status >= 200 && xhr.status < 400) {
                document.getElementById('submitSuccessMessage').style.display = 'block';
                form.reset();
                calcularTotal(); // Resetear total al limpiar form
            } else {
                document.getElementById('submitErrorMessage').style.display = 'block';
            }
        };
        xhr.send(formData);
    });
}

// --- INICIALIZACIÓN ÚNICA ---
function inicializarTodo() {
    // Escuchar cambios en todos los inputs para la calculadora
    var inputs = document.querySelectorAll('select, input[type="checkbox"]');
    inputs.forEach(input => {
        input.addEventListener('change', calcularTotal);
    });

    inicializarFormulario();
    calcularTotal();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarTodo);
} else {
    inicializarTodo();
}
