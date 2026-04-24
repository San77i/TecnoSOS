/**
 * TecnoSOS - Versión Final Certificada
 */

const CONFIG_TECNO = {
    redes: {
        'instagram': 150, 'facebook': 150, 'whatsapp': 120, 'linkedin': 180,
        'instagram+facebook': 250, 'instagram+whatsapp': 230, 'instagram+linkedin': 280,
        'facebook+whatsapp': 230, 'facebook+linkedin': 280, 'whatsapp+linkedin': 260,
        'todas': 450
    },
    unitarios: {
        'reels': 15, 'flyers': 12, 'portadas': 40, 'pagina_web': 800
    },
    adicionales: {
        'embudo': 350, 'leads': 500, 'guiones': 200
    }
};

const calcularTotal = function() {
    let total = 0;
    try {
        const redes = document.getElementById('redes_sociales');
        if (redes && CONFIG_TECNO.redes[redes.value]) {
            total += CONFIG_TECNO.redes[redes.value];
        }
        ['reels', 'flyers', 'portadas', 'pagina_web'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                total += (parseInt(el.value) || 0) * CONFIG_TECNO.unitarios[id];
            }
        });
        ['embudo', 'leads', 'guiones'].forEach(id => {
            const check = document.getElementById(id);
            if (check && check.checked) total += CONFIG_TECNO.adicionales[id];
        });
        const display = document.getElementById('total');
        if (display) display.textContent = '$' + total.toLocaleString('en-US');
    } catch (err) { console.error("Error:", err); }
};

function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submitButton');
        const success = document.getElementById('submitSuccessMessage');
        const errorMsg = document.getElementById('submitErrorMessage');
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        if(success) success.style.display = 'none';
        if(errorMsg) errorMsg.style.display = 'none';

        // Usamos FormData directamente
        const formData = new FormData(form);

        fetch('https://c2801338.ferozo.com/form/enviar_correo.php', {
            method: 'POST',
            body: formData,
            // IMPORTANTE: Quitamos mode: 'no-cors' para poder leer la respuesta
        })
        .then(response => {
            // Si el servidor responde 200-299, es éxito
            if (response.ok) {
                if(success) success.style.display = 'block';
                form.reset();
                calcularTotal();
            } else {
                throw new Error('Servidor respondió con error');
            }
        })
        .catch(error => {
            console.error('Error capturado:', error);
            // Intentamos mostrar el error solo si realmente falló el envío
            if(errorMsg) errorMsg.style.display = 'block';
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
        });
    });
}

(function() {
    window.calcularTotal = calcularTotal;
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setupForm(); calcularTotal();
    } else {
        document.addEventListener('DOMContentLoaded', () => { setupForm(); calcularTotal(); });
    }
})();
