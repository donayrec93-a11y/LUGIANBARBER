// ==================== MENÚ MÓVIL ====================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ==================== SCROLL SUAVE ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== HEADER SCROLL EFFECT ====================
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(139, 0, 255, 0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// ==================== CARRUSEL 3D - CONTROL DE VELOCIDAD ====================
const carousel = document.getElementById('galleryCarousel');
const speedButtons = document.querySelectorAll('.speed-btn');

if (carousel && speedButtons.length > 0) {
    let currentSpeed = 15;

    speedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            speedButtons.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            // Obtener velocidad
            currentSpeed = btn.getAttribute('data-speed');
            
            // Aplicar nueva velocidad
            carousel.style.animation = `galaxySpin ${currentSpeed}s linear infinite`;
        });
    });

    // Pausar rotación al hacer hover
    carousel.addEventListener('mouseenter', () => {
        carousel.style.animationPlayState = 'paused';
    });

    carousel.addEventListener('mouseleave', () => {
        carousel.style.animationPlayState = 'running';
    });
}

// ==================== FORMULARIO DE CONTACTO ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Crear mensaje para WhatsApp
        const whatsappMessage = `
🔥 *NUEVA RESERVA - LUGIAN BARBER SHOP* 🔥

👤 *Nombre:* ${nombre}
📧 *Email:* ${email}
📱 *Teléfono:* ${telefono}
💬 *Mensaje:* ${mensaje}

✂️ _Enviado desde la web_
        `.trim();
        
        // Número de WhatsApp (reemplaza con tu número real)
        const whatsappNumber = '51910599756';
        
        // Codificar mensaje para URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Crear URL de WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Limpiar formulario
        contactForm.reset();
        
        // Mensaje de confirmación
        alert('¡Gracias! Serás redirigido a WhatsApp para completar tu reserva. 🚀');
    });
}

// ==================== BOTÓN SCROLL TO TOP ====================
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== ANIMACIONES AL HACER SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos con animación
document.querySelectorAll('.service-card, .info-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c🔥 LUGIAN BARBER SHOP 🔥', 'color: #8B00FF; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #8B00FF;');
console.log('%c✂️ Sitio web desarrollado con estilo urbano', 'color: #00D9FF; font-size: 14px;');
console.log('%c💈 ¿Necesitas un sitio web? Contáctanos', 'color: #ff006e; font-size: 12px;');
// ==================== SISTEMA DE COMENTARIOS ====================
const comentarioForm = document.getElementById('comentarioForm');
const comentariosGrid = document.getElementById('comentariosGrid');
const btnVerMas = document.getElementById('btnVerMas');
let comentariosMostrados = 4;

// Función para sanitizar HTML y prevenir XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Cargar comentarios al iniciar
function cargarComentarios(mostrarTodos = false) {
    fetch('comentarios.json')
        .then(response => {
            if (!response.ok) {
                // Si el archivo no existe, puede ser la primera vez, no es un error fatal.
                if (response.status === 404) {
                    return []; 
                }
                throw new Error('No se pudo cargar comentarios.json, status: ' + response.status);
            }
            return response.json();
        })
        .then(comentarios => {
            // Ordenar comentarios por fecha, los más nuevos primero
            const comentariosAprobados = comentarios
                .filter(c => c.aprobado)
                .sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO));

            if (!comentariosGrid) return;

            if (comentariosAprobados.length === 0) {
                comentariosGrid.innerHTML = `
                    <div class="no-comentarios">
                        <p style="font-size: 3rem; margin-bottom: 1rem;">😊</p>
                        <p>Sé el primero en dejar un comentario</p>
                    </div>
                `;
                if (btnVerMas) btnVerMas.classList.add('oculto');
                return;
            }

            const cantidadMostrar = mostrarTodos ? comentariosAprobados.length : Math.min(comentariosMostrados, comentariosAprobados.length);
            const comentariosAMostrar = comentariosAprobados.slice(0, cantidadMostrar);

            comentariosGrid.innerHTML = comentariosAMostrar.map(comentario => `
                <div class="comentario-card">
                    <div class="comentario-header">
                        <div class="comentario-nombre">${sanitizeHTML(comentario.nombre)}</div>
                        <div class="comentario-estrellas">${'⭐'.repeat(comentario.calificacion)}</div>
                    </div>
                    <p class="comentario-texto">"${sanitizeHTML(comentario.comentario)}"</p>
                    <small class="comentario-fecha">${new Date(comentario.fechaISO).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                </div>
            `).join('');

            if (btnVerMas) {
                if (comentariosAprobados.length > comentariosMostrados && !mostrarTodos) {
                    btnVerMas.classList.remove('oculto');
                    btnVerMas.textContent = `👇 VER MÁS COMENTARIOS (${comentariosAprobados.length - comentariosMostrados} más)`;
                } else {
                    btnVerMas.classList.add('oculto');
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar y procesar los comentarios:', error);
            if (comentariosGrid) {
                comentariosGrid.innerHTML = `
                    <div class="no-comentarios">
                        <p style="font-size: 3rem; margin-bottom: 1rem;">😕</p>
                        <p>No se pudieron cargar los comentarios en este momento.</p>
                    </div>
                `;
            }
            if (btnVerMas) btnVerMas.classList.add('oculto');
        });
}

// Botón Ver Más
if (btnVerMas) {
    btnVerMas.addEventListener('click', () => {
        cargarComentarios(true);
        btnVerMas.textContent = '✓ MOSTRANDO TODOS LOS COMENTARIOS';
        setTimeout(() => {
            btnVerMas.classList.add('oculto');
        }, 2000);
    });
}

// Enviar comentario
if (comentarioForm) {
    comentarioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombreComentario').value;
        const calificacion = document.querySelector('input[name="rating"]:checked').value;
        const comentario = document.getElementById('textoComentario').value;
        
        const fechaActual = new Date();
        const nuevoComentario = {
            id: Date.now(), // ID único para gestionar el comentario
            nombre: sanitizeHTML(nombre),
            calificacion: parseInt(calificacion),
            comentario: sanitizeHTML(comentario),
            fecha: fechaActual.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            fechaISO: fechaActual.toISOString(), // Añadir fecha en formato ISO para ordenar
            aprobado: false // Por defecto pendiente de aprobación
        };
        
        // Guardar en localStorage
        let comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentarios.unshift(nuevoComentario);
        localStorage.setItem('comentarios', JSON.stringify(comentarios));
        
        // Limpiar formulario
        comentarioForm.reset();
        
        // Resetear estrellas
        const ratingLabels = document.querySelectorAll('.rating-input label');
        ratingLabels.forEach(label => {
            label.style.color = '#555';
            label.style.filter = 'grayscale(100%)';
            label.style.transform = 'scale(1)';
        });
        
        // Mensaje de confirmación
        alert('¡Gracias por tu comentario! 🎉\n\nTu comentario está pendiente de aprobación y será visible pronto.');
        
        // Recargar comentarios
        cargarComentarios();
    });
}

// Cargar comentarios al iniciar
if (comentariosGrid) {
    cargarComentarios();
}

// Sistema de calificación interactivo
document.addEventListener('DOMContentLoaded', function() {
    const ratingInputs = document.querySelectorAll('.rating-input input[type="radio"]');
    const ratingLabels = document.querySelectorAll('.rating-input label');
    
    ratingInputs.forEach((input, index) => {
        input.addEventListener('change', function() {
            const value = parseInt(this.value);
            
            // Resetear todas las estrellas
            ratingLabels.forEach(label => {
                label.style.color = '#555';
                label.style.filter = 'grayscale(100%)';
                label.style.transform = 'scale(1)';
            });
            
            // Iluminar las estrellas seleccionadas
            ratingLabels.forEach((label, labelIndex) => {
                const labelValue = 5 - labelIndex;
                if (labelValue <= value) {
                    label.style.color = '#ffd700';
                    label.style.filter = 'grayscale(0%) drop-shadow(0 0 10px rgba(255, 215, 0, 1))';
                    label.style.transform = 'scale(1.1)';
                }
            });
        });
    });
    
    // Efecto hover
    ratingLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', function() {
            const value = 5 - index;
            ratingLabels.forEach((l, i) => {
                const lValue = 5 - i;
                if (lValue <= value) {
                    l.style.color = '#ffd700';
                    l.style.filter = 'grayscale(0%) drop-shadow(0 0 10px rgba(255, 215, 0, 1))';
                    l.style.transform = 'scale(1.2)';
                }
            });
        });
        
        label.addEventListener('mouseleave', function() {
            const checkedInput = document.querySelector('.rating-input input[type="radio"]:checked');
            if (checkedInput) {
                const value = parseInt(checkedInput.value);
                ratingLabels.forEach((l, i) => {
                    const lValue = 5 - i;
                    if (lValue <= value) {
                        l.style.color = '#ffd700';
                        l.style.filter = 'grayscale(0%) drop-shadow(0 0 10px rgba(255, 215, 0, 1))';
                        l.style.transform = 'scale(1.1)';
                    } else {
                        l.style.color = '#555';
                        l.style.filter = 'grayscale(100%)';
                        l.style.transform = 'scale(1)';
                    }
                });
            } else {
                ratingLabels.forEach(l => {
                    l.style.color = '#555';
                    l.style.filter = 'grayscale(100%)';
                    l.style.transform = 'scale(1)';
                });
            }
        });
    });
});

