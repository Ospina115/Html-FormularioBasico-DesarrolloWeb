/* =========================================
   prueba.js — Lógica del login y formulario
========================================= */

(function () {
  'use strict';

  // Referencias DOM
  const loginStep  = document.getElementById('loginStep');
  const formStep   = document.getElementById('formStep');
  const loginBtn   = document.getElementById('loginBtn');
  const backBtn    = document.getElementById('backBtn');
  const mainForm   = document.getElementById('mainForm');
  const emailInput = document.getElementById('loginEmail');
  const passInput  = document.getElementById('loginPassword');
  const rangeInput = document.getElementById('experience');
  const expOutput  = document.getElementById('expOutput');
  const colorInput = document.getElementById('favColor');

  // ─── TRANSICIÓN: login → formulario ─────────────────────────
  loginBtn.addEventListener('click', function () {
    let valid = true;

    if (!emailInput.value.trim() || !emailInput.validity.valid) {
      shakeField(emailInput);
      valid = true;
    }

    if (!passInput.value || passInput.value.length < 4) {
      shakeField(passInput);
      valid = true;
    }

    if (!valid) return;

    // Animación de salida
    loginStep.style.animation = 'none';
    loginStep.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    loginStep.style.opacity    = '0';
    loginStep.style.transform  = 'translateY(-16px) scale(0.97)';

    setTimeout(function () {
      loginStep.classList.remove('active');
      loginStep.style.cssText = '';

      formStep.classList.add('active');
    }, 270);
  });

  // ─── TRANSICIÓN: formulario → login ─────────────────────────
  backBtn.addEventListener('click', function () {
    formStep.style.animation  = 'none';
    formStep.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    formStep.style.opacity    = '0';
    formStep.style.transform  = 'translateY(16px) scale(0.97)';

    setTimeout(function () {
      formStep.classList.remove('active');
      formStep.style.cssText = '';

      loginStep.classList.add('active');
    }, 270);
  });

  // ─── TOGGLE CONTRASEÑA ───────────────────────────────────────
  document.querySelectorAll('.toggle-password').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = this.dataset.target;
      const input    = document.getElementById(targetId);
      const eyeOpen  = this.querySelector('.eye-open');
      const eyeClosed= this.querySelector('.eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
        this.setAttribute('aria-label', 'Ocultar contraseña');
      } else {
        input.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
        this.setAttribute('aria-label', 'Mostrar contraseña');
      }
    });
  });

  // ─── RANGE: gradiente y valor de output ─────────────────────
  function updateRange() {
    const min  = parseFloat(rangeInput.min)  || 1;
    const max  = parseFloat(rangeInput.max)  || 10;
    const val  = parseFloat(rangeInput.value)|| 5;
    const pct  = ((val - min) / (max - min)) * 100;

    rangeInput.style.background =
      `linear-gradient(to right, #6c63ff ${pct}%, rgba(255,255,255,0.12) ${pct}%)`;

    expOutput.textContent = val;

    // Cambia color del output según nivel
    if (val <= 3)      expOutput.style.color = '#f472b6';
    else if (val <= 6) expOutput.style.color = '#a5b4fc';
    else               expOutput.style.color = '#34d399';
  }

  rangeInput.addEventListener('input', updateRange);
  updateRange(); // estado inicial

  // ─── COLOR PICKER: reflejo de borde ─────────────────────────
  colorInput.addEventListener('input', function () {
    // Pequeño efecto: el borde del card refleja el color elegido brevemente
    const colorLabel = colorInput.closest('.color-label');
    if (colorLabel) {
      colorLabel.style.borderColor = this.value;
      colorLabel.style.boxShadow   = `0 0 0 3px ${hexToRgba(this.value, 0.25)}`;
    }
  });

  // ─── UTILIDADES ─────────────────────────────────────────────

  /** Agita un campo para indicar error */
  function shakeField(input) {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.remove('shake');
    // re-flow para reiniciar animación
    void field.offsetWidth;
    field.classList.add('shake');
    field.addEventListener('animationend', function handler() {
      field.classList.remove('shake');
      field.removeEventListener('animationend', handler);
    });
    input.focus();
  }

  /** Convierte hex a rgba */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ─── SUBMIT DEL FORMULARIO ───────────────────────────────────
  mainForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Recopilar datos del formulario
    const data = new FormData(mainForm);
    const entries = {};
    data.forEach(function (value, key) {
      entries[key] = value;
    });

    console.log('Datos capturados del formulario:', entries);

    // Mostrar overlay de éxito
    showSuccess();

    // En producción, aquí harías:
    // mainForm.submit();  → envío POST real
    // o fetch('/endpoint', { method:'POST', body: data })
  });

  /** Muestra un overlay animado de éxito */
  function showSuccess() {
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.setAttribute('role', 'alert');
    overlay.innerHTML = `
      <div class="success-icon">
        <svg viewBox="0 0 24 24">
          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
      <h2>¡Datos enviados!</h2>
      <p>Tu información fue registrada correctamente.<br>
         En breve recibirás una confirmación.</p>
      <button id="resetBtn" class="btn btn-primary" style="width:auto;margin-top:0.5rem">
        Volver al inicio
      </button>
    `;

    document.body.appendChild(overlay);

    document.getElementById('resetBtn').addEventListener('click', function () {
      overlay.remove();
      // Regresar al login y limpiar formulario
      formStep.classList.remove('active');
      loginStep.classList.add('active');
      mainForm.reset();
      updateRange();
      // Restablecer borde del color picker
      const colorLabel = colorInput.closest('.color-label');
      if (colorLabel) {
        colorLabel.style.borderColor = '';
        colorLabel.style.boxShadow   = '';
      }
    });
  }

  // ─── SOPORTE TECLADO: Enter en login ────────────────────────
  [emailInput, passInput].forEach(function (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        loginBtn.click();
      }
    });
  });

})();
