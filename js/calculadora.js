/**
 * TecnoSOS - Calculadora de Cotización 100% LOCAL
 * Versión: 3.0.0
 * Descripción: Calcula el total en el cliente sin necesidad de backend.
 * Precios basados en servicios de marketing digital y desarrollo web.
 */

(function() {
    'use strict';

    // ============ TABLA DE PRECIOS (Configurable) ============
    const PRECIOS = {
        // Redes Sociales (precio base mensual por plataforma)
        redes: {
            'instagram': 150,
            'facebook': 150,
            'whatsapp': 120,
            'linkedin': 180,
            'instagram+facebook': 250,
            'instagram+whatsapp': 230,
            'instagram+linkedin': 280,
            'facebook+whatsapp': 230,
            'facebook+linkedin': 280,
            'whatsapp+linkedin': 260,
            'todas': 450
        },
        
        // Precio por reel individual
        reelUnitario: 15,
        
        // Precio por flyer individual
        flyerUnitario: 12,
        
        // Precio por portada individual
        portadaUnitaria: 40,
        
        // Precio por página web (proyecto)
        paginaWebUnitaria: 800,
        
        // Servicios adicionales (precio fijo mensual)
        adicionales: {
            embudo: 350,    // Embudo MKT y automatización
            leads: 500,     // Leads calificados
            guiones: 200    // Guiones para campañas
        }
    };

    // ============ REFERENCIAS AL DOM ============
    const totalDisplay = document.getElementById('total');
    
    // Mapeo de IDs de campos (igual a tu código original)
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

    // ============ FUNCIÓN DE CÁLCULO LOCAL ============
    function calcularTotal() {
        let total = 0;
        
        // 1. Redes Sociales
        const redesSociales = document.getElementById('redes_sociales').value;
        if (redesSociales && PRECIOS.redes[redesSociales]) {
            total += PRECIOS.redes[redesSociales];
        }
        
        // 2. Reels (cantidad * precio unitario)
        const reels = parseInt(document.getElementById('reels').value) || 0;
        total += reels * PRECIOS.reelUnitario;
        
        // 3. Flyers (cantidad * precio unitario)
        const flyers = parseInt(document.getElementById('flyers').value) || 0;
        total += flyers * PRECIOS.flyerUnitario;
        
        // 4. Portadas (cantidad * precio unitario)
        const portadas = parseInt(document.getElementById('portadas').value) || 0;
        total += portadas * PRECIOS.portadaUnitaria;
        
        // 5. Páginas Web (cantidad * precio unitario)
        const paginasWeb = parseInt(document.getElementById('pagina_web').value) || 0;
        total += paginasWeb * PRECIOS.paginaWebUnitaria;
        
        // 6. Servicios adicionales (checkboxes)
        if (document.getElementById('embudo').checked) {
            total += PRECIOS.adicionales.embudo;
        }
        
        if (document.getElementById('leads').checked) {
            total += PRECIOS.adicionales.leads;
        }
        
        if (document.getElementById('guiones').checked) {
            total += PRECIOS.adicionales.guiones;
        }
        
        return total;
    }

    // ============ ACTUALIZAR DISPLAY ============
    function actualizarTotal() {
        const total = calcularTotal();
        
        // Formatear como moneda USD sin decimales
        const totalFormateado = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(total);
        
        // Actualizar el display
        if (totalDisplay) {
            totalDisplay.textContent = totalFormateado;
            
            // Pequeña animación para indicar cambio
            totalDisplay.classList.add('updated');
            setTimeout(() => {
                totalDisplay.classList.remove('updated');
            }, 300);
        }
        
        // Log para depuración (podés quitarlo en producción)
        console.log('TecnoSOS [Local]: Total calculado:', totalFormateado);
    }

    // ============ INICIALIZAR EVENT LISTENERS ============
    function inicializarEventos() {
        campos.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                // Para selects: evento 'change'
                campo.addEventListener('change', actualizarTotal);
                
                // Para checkboxes: evento 'click' adicional (por compatibilidad)
                if (campo.type === 'checkbox') {
                    campo.addEventListener('click', actualizarTotal);
                }
            } else {
                console.warn(`TecnoSOS [Local]: No se encontró el elemento con id "${id}". Verificá el HTML.`);
            }
        });
        
        // Calcular una vez al inicio para mostrar $0 o valores por defecto
        actualizarTotal();
        
        console.log('TecnoSOS [Local]: Calculadora inicializada correctamente. Modo: SIN BACKEND.');
    }

    // ============ INICIAR CUANDO EL DOM ESTÉ LISTO ============
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarEventos);
    } else {
        inicializarEventos();
    }

})();

//**
 * TecnoSOS - Envío de Formulario de Contacto
 * Validación campo por campo (mensajes visibles solo al validar)
 */
(function() {
    'use strict';
    
    const PHP_ENDPOINT = 'https://c2801338.ferozo.com/enviar_correo.php';
    
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('submitSuccessMessage');
    const errorMessage = document.getElementById('submitErrorMessage');
    
    // Referencias a los campos y sus mensajes de error
    const campos = {
        name: {
            input: document.getElementById('name'),
            error: document.getElementById('error-name'),
            mensaje: 'Nombre requerido.'
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('error-email'),
            mensaje: 'e-mail válido requerido.'
        },
        phone: {
            input: document.getElementById('phone'),
            error: document.getElementById('error-phone'),
            mensaje: 'Número de teléfono requerido.'
        },
        message: {
            input: document.getElementById('message'),
            error: document.getElementById('error-message'),
            mensaje: 'Escriba su mensaje.'
        }
    };
    
    if (!form) return;
    
    // ========== FUNCIONES DE VALIDACIÓN ==========
    
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function mostrarErrorCampo(campo, mensaje) {
        if (campo.error) {
            campo.error.textContent = mensaje;
            campo.error.classList.add('show');
        }
        if (campo.input) {
            campo.input.classList.add('error');
            campo.input.classList.remove('success');
        }
    }
    
    function ocultarErrorCampo(campo) {
        if (campo.error) {
            campo.error.classList.remove('show');
        }
        if (campo.input) {
            campo.input.classList.remove('error');
            campo.input.classList.add('success');
        }
    }
    
    function ocultarTodosErrores() {
        Object.values(campos).forEach(campo => {
            ocultarErrorCampo(campo);
            // No marcamos como success hasta que se valide
            if (campo.input) campo.input.classList.remove('success');
        });
    }
    
    // ========== VALIDAR CAMPO POR CAMPO ==========
    
    function validarCampo(name) {
        const campo = campos[name];
        if (!campo || !campo.input) return true;
        
        const valor = campo.input.value.trim();
        
        // Validar según tipo de campo
        if (name === 'email') {
            if (!valor) {
                mostrarErrorCampo(campo, campo.mensaje);
                return false;
            } else if (!validarEmail(valor)) {
                mostrarErrorCampo(campo, 'Ingrese un e-mail válido.');
                return false;
            } else {
                ocultarErrorCampo(campo);
                return true;
            }
        } else {
            // name, phone, message: solo required
            if (!valor) {
                mostrarErrorCampo(campo, campo.mensaje);
                return false;
            } else {
                ocultarErrorCampo(campo);
                return true;
            }
        }
    }
    
    // ========== LIMPIAR ERROR AL ESCRIBIR ==========
    
    Object.keys(campos).forEach(name => {
        const input = campos[name].input;
        if (input) {
            input.addEventListener('input', function() {
                // Solo limpia el error si ya había sido mostrado
                if (campos[name].error && campos[name].error.classList.contains('show')) {
                    validarCampo(name);
                }
            });
            
            // Al perder el foco, validar
            input.addEventListener('blur', function() {
                if (input.value.trim() !== '') {
                    validarCampo(name);
                }
            });
        }
    });
    
    // ========== ENVÍO DEL FORMULARIO ==========
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Ocultar mensajes anteriores
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
        
        // Validar todos los campos
        let todoValido = true;
        
        Object.keys(campos).forEach(name => {
            if (!validarCampo(name)) {
                todoValido = false;
            }
        });
        
        if (!todoValido) {
            // El primer campo con error recibe el foco
            for (const name of Object.keys(campos)) {
                if (campos[name].error && campos[name].error.classList.contains('show')) {
                    campos[name].input.focus();
                    break;
                }
            }
            return;
        }
        
        // Si todo está válido, enviar
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        const formData = new FormData();
        formData.append('name', campos.name.input.value.trim());
        formData.append('email', campos.email.input.value.trim());
        formData.append('phone', campos.phone.input.value.trim());
        formData.append('message', campos.message.input.value.trim());
        
        try {
            const response = await fetch(PHP_ENDPOINT, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                // Éxito
                if (successMessage) successMessage.style.display = 'block';
                if (errorMessage) errorMessage.style.display = 'none';
                form.reset();
                // Limpiar bordes verdes
                Object.values(campos).forEach(campo => {
                    if (campo.input) campo.input.classList.remove('success');
                });
            } else {
                throw new Error('Error del servidor: ' + response.status);
            }
        } catch (error) {
            console.error('TecnoSOS: Error al enviar formulario:', error);
            if (errorMessage) errorMessage.style.display = 'block';
            if (successMessage) successMessage.style.display = 'none';
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
        }
    });
    
    console.log('TecnoSOS: Formulario con validación inteligente inicializado.');
})();