// ============================================
// INFORMEAUTO - Frontend
// URLs verificados por el usuario - abril 2026
// ============================================

const input = document.getElementById('patente');
const btn = document.getElementById('btn');
const errorBox = document.getElementById('error');
const results = document.getElementById('results');
const datosDiv = document.getElementById('datos');
const linksDiv = document.getElementById('links');
const formatoBadge = document.getElementById('formatoBadge');
const toast = document.getElementById('toast');

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

function mostrarToast(msg) {
  toast.textContent = msg + ' ✓';
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2000);
}

function validarPatente(p) {
  const mercosur = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/;
  const viejo = /^[A-Z]{3}[0-9]{3}$/;
  if (mercosur.test(p)) return 'Mercosur';
  if (viejo.test(p)) return 'Anterior';
  return null;
}

function inferirInfo(patente, formato) {
  const info = { 'Dominio': patente, 'Formato': formato };

  if (formato === 'Mercosur') {
    info['Sistema'] = 'Placa regional';
    info['Vigente desde'] = 'Abril 2016';
  } else {
    const primeraLetra = patente.charAt(0);
    const rangos = {
      'A': '1995', 'B': '1995-96', 'C': '1996-97', 'D': '1997-98',
      'E': '1999', 'F': '1999-2000', 'G': '2001-02', 'H': '2003-04',
      'I': '2005-06', 'J': '2007-08', 'K': '2009', 'L': '2010',
      'M': '2011', 'N': '2012-13', 'P': '2013-14', 'R': '2014-15',
      'S': '2015', 'T': '2016'
    };
    const anio = rangos[primeraLetra] || 'No determinado';
    info['Año aprox. de emisión'] = anio;
  }
  return info;
}

function renderDatos(info) {
  datosDiv.innerHTML = '';
  for (const [label, value] of Object.entries(info)) {
    const div = document.createElement('div');
    div.className = 'info-item';
    div.innerHTML = `<div class="label">${label}</div><div class="value">${value}</div>`;
    datosDiv.appendChild(div);
  }
}

function renderLinks(patente) {
  const links = [
    {
      title: '💰 AGIP — Patente CABA',
      desc: 'Pegá la patente con Ctrl+V. Consultá deuda y cuotas del impuesto patente en Ciudad de Buenos Aires.',
      url: 'https://lb.agip.gob.ar/ConsultaPat/'
    },
    {
      title: '💰 ARBA — Deuda Automotor PBA',
      desc: 'Pegá la patente y resolvé el captcha. Impuesto automotor en Provincia de Buenos Aires.',
      url: 'https://app.arba.gov.ar/AvisoDeudas/?imp=1'
    },
    {
      title: '🚦 Infracciones CABA',
      desc: 'Seleccioná "Una patente", pegá el dominio y tildá "No soy robot". Multas de tránsito en CABA.',
      url: 'https://buenosaires.gob.ar/licenciasdeconducir/consulta-de-infracciones/?actas=transito'
    },
    {
      title: '🚦 Infracciones Provincia Bs. As.',
      desc: 'Consultá multas de tránsito bonaerenses ingresando el dominio del vehículo.',
      url: 'https://infraccionesba.gba.gob.ar/consulta-infraccion'
    },
    {
      title: '🚦 Infracciones Nacionales (ANSV)',
      desc: 'Consulta nacional de infracciones: rutas y jurisdicciones adheridas al SINAI.',
      url: 'https://consultainfracciones.seguridadvial.gob.ar/'
    },
    {
      title: '🔧 VTV CABA',
      desc: 'Información y trámites de Verificación Técnica Vehicular en Ciudad de Buenos Aires.',
      url: 'https://buenosaires.gob.ar/gcaba_historico/tramites/verificacion-tecnica-vehicular-obligatoria'
    },
    {
      title: '🔧 VTV Provincia Bs. As.',
      desc: 'Portal oficial VTV bonaerense: turnos, plantas habilitadas y consulta de vigencia.',
      url: 'https://vtv.gba.gob.ar/'
    },
    {
      title: '🏛️ DNRPA — Radicación por patente',
      desc: 'Consultar dónde está radicado el vehículo (registro seccional) ingresando el dominio.',
      url: 'https://www.dnrpa.gov.ar/portal_dnrpa/radicacion2.php'
    },
    {
      title: '📄 Informe oficial de dominio',
      desc: 'Trámite pago del Estado: titular, prendas, embargos y denuncias. Único informe legal completo.',
      url: 'https://www.argentina.gob.ar/servicio/solicitar-un-informe-de-dominio-del-automotor'
    }
  ];

  linksDiv.innerHTML = '';
  links.forEach(l => {
    const a = document.createElement('a');
    a.className = 'link-btn';
    a.href = l.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `<div class="title">${l.title}</div><div class="desc">${l.desc}</div>`;
    a.addEventListener('click', () => {
      navigator.clipboard?.writeText(patente).then(() => {
        mostrarToast(`Patente ${patente} copiada`);
      }).catch(() => {});
    });
    linksDiv.appendChild(a);
  });
}

function consultar() {
  const patente = input.value.trim().toUpperCase();
  errorBox.classList.remove('visible');

  if (!patente) {
    mostrarError('Ingresá una patente para consultar.');
    return;
  }

  const formato = validarPatente(patente);
  if (!formato) {
    mostrarError('Formato inválido. Usá AA123BB (Mercosur) o ABC123 (anterior).');
    return;
  }

  formatoBadge.textContent = formato;
  renderDatos(inferirInfo(patente, formato));
  renderLinks(patente);
  results.classList.add('visible');

  navigator.clipboard?.writeText(patente).then(() => {
    mostrarToast(`Patente ${patente} copiada`);
  }).catch(() => {});

  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
