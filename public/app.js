// ============================================
// FRONTEND - Lógica de la consulta
// ============================================

const input = document.getElementById('patente');
const btn = document.getElementById('btn');
const errorBox = document.getElementById('error');
const loader = document.getElementById('loader');
const results = document.getElementById('results');
const datosDiv = document.getElementById('datos');
const warningDiv = document.getElementById('warning');

input.addEventListener('input', (e) => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  errorBox.classList.remove('visible');
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') consultar();
});

function mostrarError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.add('visible');
  results.classList.remove('visible');
}

async function consultar() {
  const patente = input.value.trim();

  if (!patente) {
    mostrarError('Ingresá una patente.');
    return;
  }

  errorBox.classList.remove('visible');
  results.classList.remove('visible');
  loader.classList.add('visible');
  btn.disabled = true;

  try {
    const respuesta = await fetch(`/api/patente/${patente}`);
    const data = await respuesta.json();

    if (!respuesta.ok) {
      mostrarError(data.error || 'Error desconocido');
      return;
    }

    renderDatos(data);
    results.classList.add('visible');

  } catch (err) {
    mostrarError('No se pudo conectar al servidor. ¿Está corriendo?');
    console.error(err);
  } finally {
    loader.classList.remove('visible');
    btn.disabled = false;
  }
}

function renderDatos(data) {
  datosDiv.innerHTML = '';

  const campos = [
    ['Dominio', 'dominio'],
    ['Formato', 'formato'],
    ['Marca', 'marca'],
    ['Modelo', 'modelo'],
    ['Año', 'anio'],
    ['Color', 'color'],
    ['Combustible', 'combustible'],
    ['Cilindrada (cc)', 'motor_cc'],
    ['Origen', 'origen'],
  ];

  campos.forEach(([label, key]) => {
    if (data[key] === undefined || data[key] === null) return;
    const div = document.createElement('div');
    div.className = 'info-item';
    div.innerHTML = `<div class="label">${label}</div><div class="value">${data[key]}</div>`;
    datosDiv.appendChild(div);
  });

  if (data.ADVERTENCIA) {
    warningDiv.textContent = '⚠ ' + data.ADVERTENCIA;
    warningDiv.style.display = 'block';
  } else {
    warningDiv.style.display = 'none';
  }
}
