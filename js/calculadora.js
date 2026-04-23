
/**
 * TecnoSOS - Calculadora + Formulario
 * Versión: 4.2 (Simplificada para Android)
 */

// ============ CALCULADORA (Función global para Android) ============

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

// Función GLOBAL (se llama desde los onclick y onchange del HTML)
function calcularTotal() {
    var total = 0;
    
    // Redes Sociales
    var redesSelect = document.getElementById('redes_sociales');
    if (redesSelect && redesSelect.value && PRECIOS.redes[redesSelect.value]) {
        total = total + PRECIOS.redes[redesSelect.value];
    }
    
    // Reels
    var reelsSelect = document.getElementById('reels');
    if (reelsSelect) {
        var reels = parseInt(reelsSelect.value) || 0;
        total = total + (reels * PRECIOS.reelUnitario);
    }
    
    // Flyers
    var flyersSelect = document.getElementById('flyers');
    if (flyersSelect) {
        var flyers = parseInt(flyersSelect.value) || 0;
        total = total + (flyers * PRECIOS.flyerUnitario);
    }
    
    // Portadas
    var portadasSelect = document.getElementById('portadas');
    if (portadasSelect) {
        var portadas = parseInt(portadasSelect.value) || 0;
        total = total + (portadas * PRECIOS.portadaUnitaria);
    }
    
    // Páginas Web
    var webSelect = document.getElementById('pagina_web');
    if (webSelect) {
        var paginasWeb = parseInt(webSelect.value) || 0;
        total = total + (paginasWeb * PRECIOS.paginaWebUnitaria);
    }
    
    // Checkboxes
    if (document.getElementById('embudo') && document.getElementById('embudo').checked) {
        total = total + PRECIOS.adicionales.embudo;
    }
    if (document.getElementById('leads') && document.getElementById('leads').checked) {
        total = total + PRECIOS.adicionales.leads;
    }
    if (document.getElementById('guiones') && document.getElementById('guiones').checked) {
        total = total + PRECIOS.adicionales.guiones;
    }
    
    // Mostrar total
    var totalDisplay = document.getElementById('total');
    if (totalDisplay) {
        totalDisplay.textContent = '$' + total.toLocaleString('en-US');
    }
}

// Ejecutar al cargar la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        calcularTotal();
    });
} else {
    calcularTotal();
}

// ============ FORMULARIO DE CONTACTO ============

(function() {
    'use strict';
    
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
        if (!form) return;
        
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
                    if (!primerError) primerError = camposForm[name].input;
                }
            });
            
            if (!todoValido) {
                if (primerError) primerError.focus();
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
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
                
                if (xhr.status >= 200 && xhr.status < 400) {
                    if (successMessage) successMessage.style.display = 'block';
                    if (errorMessage) errorMessage.style.display = 'none';
                    form.reset();
                    Object.keys(camposForm).forEach(function(name) {
                        var input = camposForm[name].input;
                        if (input) input.classList.remove('success', 'error');
                    });
                } else {
                    if (errorMessage) errorMessage.style.display = 'block';
                    if (successMessage) successMessage.style.display = 'none';
                }
            };
            
            xhr.onerror = function() {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
                if (errorMessage) errorMessage.style.display = 'block';
                if (successMessage) successMessage.style.display = 'none';
            };
            
            xhr.send(formData);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarFormulario);
    } else {
        inicializarFormulario();
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
