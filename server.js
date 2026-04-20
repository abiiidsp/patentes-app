// ============================================
// SERVIDOR BACKEND - Consulta de patentes AR
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// CACHE EN MEMORIA
// ============================================
const cache = new Map();
const CACHE_DURACION_MS = 1000 * 60 * 60 * 24; // 24 horas

// ============================================
// VALIDACIÓN DE PATENTES
// ============================================
function validarPatente(patente) {
  const p = patente.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(p)) return { ok: true, patente: p, formato: 'Mercosur' };
  if (/^[A-Z]{3}[0-9]{3}$/.test(p)) return { ok: true, patente: p, formato: 'Anterior' };
  return { ok: false };
}

// ============================================
// ENDPOINT PRINCIPAL
// ============================================
app.get('/api/patente/:dominio', async (req, res) => {
  const validacion = validarPatente(req.params.dominio);

  if (!validacion.ok) {
    return res.status(400).json({
      error: 'Formato de patente inválido',
      formatos_validos: ['AA123BB (Mercosur)', 'ABC123 (anterior)']
    });
  }

  const { patente, formato } = validacion;

  const cacheado = cache.get(patente);
  if (cacheado && Date.now() - cacheado.timestamp < CACHE_DURACION_MS) {
    console.log(`[CACHE HIT] ${patente}`);
    return res.json({ ...cacheado.data, desde_cache: true });
  }

  try {
    const datos = await consultarProveedor(patente, formato);
    cache.set(patente, { data: datos, timestamp: Date.now() });
    res.json(datos);
  } catch (error) {
    console.error('Error consultando proveedor:', error.message);
    res.status(500).json({ error: 'Error al consultar datos del vehículo' });
  }
});

// ============================================
// FUNCIÓN QUE LLAMA AL PROVEEDOR
// ============================================
async function consultarProveedor(patente, formato) {

  // MODO SIMULACIÓN (mientras no tengas API real)
  if (!process.env.API_KEY_PATENTES ||
      process.env.API_KEY_PATENTES.startsWith('pegame_aca')) {

    console.log(`[MOCK] Simulando consulta de ${patente}`);
    await new Promise(r => setTimeout(r, 800));

    const marcasMock = ['Toyota', 'Volkswagen', 'Ford', 'Chevrolet', 'Fiat', 'Peugeot'];
    const modelosMock = ['Corolla', 'Gol', 'Focus', 'Cruze', 'Palio', '208'];
    const i = patente.charCodeAt(0) % marcasMock.length;

    return {
      dominio: patente,
      formato: formato,
      marca: marcasMock[i],
      modelo: modelosMock[i],
      anio: 2015 + (patente.charCodeAt(1) % 10),
      color: ['Blanco', 'Gris', 'Negro', 'Rojo'][patente.charCodeAt(2) % 4],
      combustible: 'Nafta',
      motor_cc: 1600,
      origen: 'Argentina',
      ADVERTENCIA: 'ESTOS SON DATOS SIMULADOS. Configurá tu API_KEY real en .env',
      fuente: 'mock',
      consultado_en: new Date().toISOString()
    };
  }

  // MODO PRODUCCIÓN (cuando tengas proveedor real)
  const URL_PROVEEDOR = `https://api.tu-proveedor.com/v1/vehiculos/${patente}`;

  const respuesta = await fetch(URL_PROVEEDOR, {
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY_PATENTES}`,
      'Accept': 'application/json'
    }
  });

  if (!respuesta.ok) {
    throw new Error(`Proveedor respondió con código ${respuesta.status}`);
  }

  const data = await respuesta.json();

  return {
    dominio: patente,
    formato: formato,
    marca: data.marca,
    modelo: data.modelo,
    anio: data.anio,
    color: data.color,
    combustible: data.combustible,
    motor_cc: data.cilindrada,
    origen: data.origen,
    fuente: 'proveedor',
    consultado_en: new Date().toISOString()
  };
}

// ============================================
// INICIAR EL SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('');
  console.log('====================================');
  console.log(`  Servidor corriendo en:`);
  console.log(`  http://localhost:${PORT}`);
  console.log('====================================');
  console.log('');
});
