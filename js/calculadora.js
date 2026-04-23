  /**
 * TecnoSOS - Calculadora + Formulario de Contacto
 * Versión: 4.1 (Soporte Android mejorado)
 */

(function() {
    'use strict';

    // =============================================
    // PARTE 1: CALCULADORA DE COTIZACIÓN
    // =============================================

    var PRECIOS = {
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
        reelUnitario: 15,
        flyerUnitario: 12,
        portadaUnitaria: 40,
        paginaWebUnitaria: 800,
        adicionales: {
            embudo: 350,
            leads: 500,
            guiones: 200
        }
    };

    var totalDisplay = document.getElementById('total');
    
    var camposCotizador = [
        "redes_sociales",
        "reels",
        "flyers",
        "portadas",
        "pagina_web",
        "embudo",
        "leads",
        "guiones"
    ];

    function calcularTotal() {
        var total = 0;
        
        var redesSociales = document.getElementById('redes_sociales');
        if (redesSociales && redesSociales.value && PRECIOS.redes[redesSociales.value]) {
            total = total + PRECIOS.redes[redesSociales.value];
        }
        
        var reels = parseInt(document.getElementById('reels').value) || 0;
        total = total + (reels * PRECIOS.reelUnitario);
        
        var flyers = parseInt(document.getElementById('flyers').value) || 0;
        total = total + (flyers * PRECIOS.flyerUnitario);
        
        var portadas = parseInt(document.getElementById('portadas').value) || 0;
        total = total + (portadas * PRECIOS.portadaUnitaria);
        
        var paginasWeb = parseInt(document.getElementById('pagina_web').value) || 0;
        total = total + (paginasWeb * PRECIOS.paginaWebUnitaria);
        
        if (document.getElementById('embudo').checked) {
            total = total + PRECIOS.adicionales.embudo;
        }
        
        if (document.getElementById('leads').checked) {
            total = total + PRECIOS.adicionales.leads;
        }
        
        if (document.getElementById('guiones').checked) {
            total = total + PRECIOS.adicionales.guiones;
        }
        
        return total;
    }

    function actualizarTotal() {
        var total = calcularTotal();
        var totalFormateado = '$' + total.toLocaleString('en-US');
        
        if (totalDisplay) {
            totalDisplay.textContent = totalFormateado;
            totalDisplay.classList.add('updated');
            setTimeout(function() {
                totalDisplay.classList.remove('updated');
            }, 300);
        }
        
        // Debug para Android
        console.log('TecnoSOS: Total actualizado -> ' + totalFormateado);
    }

    function inicializarCotizador() {
        camposCotizador.forEach(function(id) {
            var campo = document.getElementById(id);
            if (!campo) {
                console.warn('TecnoSOS: No se encontró el campo ' + id);
                return;
            }
            
            if (campo.tagName === 'SELECT') {
                // Múltiples eventos para compatibilidad con Android
                campo.addEventListener('change', function(e) {
                    console.log('TecnoSOS: change en ' + id);
                    actualizarTotal();
                });
                
                // Evento adicional para Android/Chrome
                campo.addEventListener('input', function(e) {
                    console.log('TecnoSOS: input en ' + id);
                    actualizarTotal();
                });
                
                // Para navegadores antiguos de Android
                campo.addEventListener('blur', function(e) {
                    console.log('TecnoSOS: blur en ' + id);
                    actualizarTotal();
                });
            }
            
            if (campo.type === 'checkbox') {
                campo.addEventListener('change', function(e) {
                    console.log('TecnoSOS: change en checkbox ' + id);
                    actualizarTotal();
                });
                
                campo.addEventListener('click', function(e) {
                    console.log('TecnoSOS: click en checkbox ' + id);
                    actualizarTotal();
                });
            }
        });
        
        // Calcular al inicio
        actualizarTotal();
        
        // Solución extra: recalcular cada 500ms si hubo cambios (para Android problemáticos)
        var ultimoTotal = 0;
        setInterval(function() {
            var nuevoTotal = calcularTotal();
            if (nuevoTotal !== ultimoTotal) {
                ultimoTotal = nuevoTotal;
                actualizarTotal();
                console.log('TecnoSOS: Cambio detectado por polling');
            }
        }, 500);
        
        console.log('TecnoSOS: Calculadora inicializada correctamente (v4.1 Android).');
    }

    // =============================================
    // PARTE 2: FORMULARIO DE CONTACTO
    // =============================================

    var PHP_ENDPOINT = 'https://c2801338.ferozo.com/enviar_correo.php';
    
    var form = document.getElementById('contactForm');
    var submitButton = document.getElementById('submitButton');
    var successMessage = document.getElementById('submitSuccessMessage');
    var errorMessage = document.getElementById('submitErrorMessage');
    
    var camposForm = {
        name: {
            input: document.getElementById('name'),
            error: document.getElementById('error-name'),
            mensaje: 'Nombre requerido.'
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('error-email'),
            mensaje: 'e-mail valido requerido.'
        },
        phone: {
            input: document.getElementById('phone'),
            error: document.getElementById('error-phone'),
            mensaje: 'Numero de telefono requerido.'
        },
        message: {
            input: document.getElementById('message'),
            error: document.getElementById('error-message'),
            mensaje: 'Escriba su mensaje.'
        }
    };

    function validarEmail(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    function validarCampo(name) {
        var campo = camposForm[name];
        if (!campo || !campo.input) return true;
        
        var valor = campo.input.value.trim();
        
        if (name === 'email') {
            if (!valor) {
                mostrarErrorCampo(campo, campo.mensaje);
                return false;
            } else if (!validarEmail(valor)) {
                mostrarErrorCampo(campo, 'Ingrese un e-mail valido.');
                return false;
            } else {
                ocultarErrorCampo(campo);
                return true;
            }
        } else {
            if (!valor) {
                mostrarErrorCampo(campo, campo.mensaje);
                return false;
            } else {
                ocultarErrorCampo(campo);
                return true;
            }
        }
    }

    function inicializarFormulario() {
        if (!form) {
            console.warn('TecnoSOS: Formulario de contacto no encontrado.');
            return;
        }
        
        Object.keys(camposForm).forEach(function(name) {
            var input = camposForm[name].input;
            if (input) {
                input.addEventListener('input', function() {
                    if (camposForm[name].error && camposForm[name].error.classList.contains('show')) {
                        validarCampo(name);
                    }
                });
                
                input.addEventListener('blur', function() {
                    if (input.value.trim() !== '') {
                        validarCampo(name);
                    }
                });
            }
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
            
            var todoValido = true;
            var primerError = null;
            
            Object.keys(camposForm).forEach(function(name) {
                if (!validarCampo(name)) {
                    todoValido = false;
                    if (!primerError) {
                        primerError = camposForm[name].input;
                    }
                }
            });
            
            if (!todoValido) {
                if (primerError) {
                    primerError.focus();
                }
                return;
            }
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            var formData = new FormData();
            formData.append('name', camposForm.name.input.value.trim());
            formData.append('email', camposForm.email.input.value.trim());
            formData.append('phone', camposForm.phone.input.value.trim());
            formData.append('message', camposForm.message.input.value.trim());
            
            var xhr = new XMLHttpRequest();
            xhr.open('POST', PHP_ENDPOINT, true);
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    if (successMessage) successMessage.style.display = 'block';
                    if (errorMessage) errorMessage.style.display = 'none';
                    form.reset();
                    
                    Object.keys(camposForm).forEach(function(name) {
                        var input = camposForm[name].input;
                        if (input) {
                            input.classList.remove('success', 'error');
                        }
                    });
                } else {
                    if (errorMessage) errorMessage.style.display = 'block';
                    if (successMessage) successMessage.style.display = 'none';
                }
                
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
            };
            
            xhr.onerror = function() {
                if (errorMessage) errorMessage.style.display = 'block';
                if (successMessage) successMessage.style.display = 'none';
                
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
            };
            
            xhr.send(formData);
        });
        
        console.log('TecnoSOS: Formulario de contacto inicializado correctamente.');
    }

    // =============================================
    // INICIALIZAR TODO
    // =============================================

    function inicializarTodo() {
        inicializarCotizador();
        inicializarFormulario();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarTodo);
    } else {
        inicializarTodo();
    }

})();

    // =============================================
    // PARTE 2: FORMULARIO DE CONTACTO
    // =============================================

    var PHP_ENDPOINT = 'https://c2801338.ferozo.com/enviar_correo.php';
    
    var form = document.getElementById('contactForm');
    var submitButton = document.getElementById('submitButton');
    var successMessage = document.getElementById('submitSuccessMessage');
    var errorMessage = document.getElementById('submitErrorMessage');
    
    var camposForm = {
        name: {
            input: document.getElementById('name'),
            error: document.getElementById('error-name'),
            mensaje: 'Nombre requerido.'
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('error-email'),
            mensaje: 'e-mail valido requerido.'
        },
        phone: {
            input: document.getElementById('phone'),
            error: document.getElementById('error-phone'),
            mensaje: 'Numero de telefono requerido.'
        },
        message: {
            input: document.getElementById('message'),
            error: document.getElementById('error-message'),
            mensaje: 'Escriba su mensaje.'
        }
    };

    function validarEmail(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    function validarCampo(name) {
        var campo = camposForm[name];
        if (!campo || !campo.input) return true;
        
        var valor = campo.input.value.trim();
        
        if (name === 'email') {
            if (!valor) {
                mostrarErrorCampo(campo, campo.mensaje);
                return false;
            } else if (!validarEmail(valor)) {
                mostrarErrorCampo(campo, 'Ingrese un e-mail valido.');
                return false;
            } else {
                ocultarErrorCampo(campo);
                return true;
            }
        } else {
            if (!valor) {
                mostrarErrorCampo(campo, campo.mensaje);
                return false;
            } else {
                ocultarErrorCampo(campo);
                return true;
            }
        }
    }

    function inicializarFormulario() {
        if (!form) {
            console.warn('TecnoSOS: Formulario de contacto no encontrado.');
            return;
        }
        
        // Limpiar errores al escribir
        Object.keys(camposForm).forEach(function(name) {
            var input = camposForm[name].input;
            if (input) {
                input.addEventListener('input', function() {
                    if (camposForm[name].error && camposForm[name].error.classList.contains('show')) {
                        validarCampo(name);
                    }
                });
                
                input.addEventListener('blur', function() {
                    if (input.value.trim() !== '') {
                        validarCampo(name);
                    }
                });
            }
        });
        
        // Envío del formulario
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ocultar mensajes anteriores
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
            
            // Validar todos los campos
            var todoValido = true;
            var primerError = null;
            
            Object.keys(camposForm).forEach(function(name) {
                if (!validarCampo(name)) {
                    todoValido = false;
                    if (!primerError) {
                        primerError = camposForm[name].input;
                    }
                }
            });
            
            if (!todoValido) {
                // Enfocar el primer campo con error
                if (primerError) {
                    primerError.focus();
                }
                return;
            }
            
            // Si todo está válido, enviar
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            var formData = new FormData();
            formData.append('name', camposForm.name.input.value.trim());
            formData.append('email', camposForm.email.input.value.trim());
            formData.append('phone', camposForm.phone.input.value.trim());
            formData.append('message', camposForm.message.input.value.trim());
            
            // Enviar usando XMLHttpRequest (compatible con todos los navegadores)
            var xhr = new XMLHttpRequest();
            xhr.open('POST', PHP_ENDPOINT, true);
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    // Éxito
                    if (successMessage) successMessage.style.display = 'block';
                    if (errorMessage) errorMessage.style.display = 'none';
                    form.reset();
                    
                    // Limpiar bordes verdes
                    Object.keys(camposForm).forEach(function(name) {
                        var input = camposForm[name].input;
                        if (input) {
                            input.classList.remove('success', 'error');
                        }
                    });
                } else {
                    // Error del servidor
                    if (errorMessage) errorMessage.style.display = 'block';
                    if (successMessage) successMessage.style.display = 'none';
                }
                
                // Restaurar botón
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
            };
            
            xhr.onerror = function() {
                // Error de conexión
                if (errorMessage) errorMessage.style.display = 'block';
                if (successMessage) successMessage.style.display = 'none';
                
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
            };
            
            xhr.send(formData);
        });
        
        console.log('TecnoSOS: Formulario de contacto inicializado correctamente.');
    }

    // =============================================
    // INICIALIZAR TODO CUANDO EL DOM ESTÉ LISTO
    // =============================================

    function inicializarTodo() {
        inicializarCotizador();
        inicializarFormulario();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarTodo);
    } else {
        inicializarTodo();
    }

})();
