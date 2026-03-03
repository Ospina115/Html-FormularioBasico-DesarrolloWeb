/* =========================================
   gallery-script.js — Funcionalidad de la galería
========================================= */

(function () {
  'use strict';

  // Animación de entrada suave
  document.addEventListener('DOMContentLoaded', function () {
    console.log('Galería cargada correctamente');
    
    // Agregar funcionalidad de click a las imágenes para expandir
    const imageCards = document.querySelectorAll('.image-card');
    
    imageCards.forEach(function (card, index) {
      card.addEventListener('click', function () {
        const img = this.querySelector('img');
        const imageNum = index + 1;
        
        // Crear modal para mostrar imagen ampliada
        showImageModal(img.src, imageNum);
      });
      
      // Agregar efecto de tilt sutil con el mouse
      card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);
        
        const rotateX = deltaY * 5; // Máximo 5 grados
        const rotateY = deltaX * 5;
        
        this.style.transform = `translateY(-8px) perspective(600px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', function () {
        this.style.transform = '';
      });
    });
  });

  // Función para mostrar modal de imagen
  function showImageModal(imageSrc, imageNum) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', `Imagen ${imageNum} ampliada`);
    
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <img src="${imageSrc}" alt="Imagen ${imageNum} ampliada" />
        <div class="modal-controls">
          <span class="image-info">Imagen ${imageNum} de 7</span>
          <button class="close-modal" aria-label="Cerrar modal">
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal con click en backdrop o botón
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Cerrar modal con tecla Escape
    function handleEscape(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }
    document.addEventListener('keydown', handleEscape);
    
    function closeModal() {
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.9)';
      document.removeEventListener('keydown', handleEscape);
      
      setTimeout(function () {
        if (modal.parentNode) {
          modal.remove();
        }
      }, 200);
    }
    
    // Animar entrada del modal
    setTimeout(function () {
      modal.style.opacity = '1';
      modal.style.transform = 'scale(1)';
    }, 10);
  }

  // Efecto de parallax sutil en el fondo
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach(function (shape, index) {
      const speed = 0.1 + (index * 0.05);
      const yPos = -(scrolled * speed);
      shape.style.transform = `translateY(${yPos}px)`;
    });
  });

})();

// CSS para el modal (se inyecta dinámicamente)
const modalStyles = `
  .image-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 12, 41, 0.9);
    backdrop-filter: blur(8px);
    cursor: pointer;
  }
  
  .modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }
  
  .modal-content img {
    width: 100%;
    height: auto;
    max-height: 80vh;
    object-fit: contain;
    display: block;
  }
  
  .modal-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: rgba(0, 0, 0, 0.3);
    color: white;
  }
  
  .image-info {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .close-modal {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }
  
  .close-modal:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .close-modal svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

// Inyectar estilos del modal
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);