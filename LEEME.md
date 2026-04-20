# Patentes App — Consulta de patentes argentinas

## Instrucciones para correr (3 pasos)

### 1. Abrir la carpeta en VS Code

Mové esta carpeta `patentes-app` a tu Escritorio (o donde quieras). Después abrila desde VS Code:

- Archivo → Abrir carpeta → seleccionar `patentes-app`.

### 2. Instalar las dependencias (solo la primera vez)

Abrí la terminal dentro de VS Code (menú Terminal → New Terminal).

En la terminal, escribí:

```
npm install
```

Esto tarda entre 30 segundos y 2 minutos. Al final vas a ver algo como `added 95 packages`.

### 3. Correr la aplicación

En la misma terminal:

```
npm run dev
```

Vas a ver:

```
====================================
  Servidor corriendo en:
  http://localhost:3000
====================================
```

Abrí tu navegador y andá a **http://localhost:3000**. Probá con una patente como `AA123BB` o `ABC123`.

## Comandos útiles

- **Apagar el servidor**: en la terminal, `Ctrl + C`.
- **Volver a encender**: `npm run dev`.

## Estructura del proyecto

```
patentes-app/
├── public/
│   ├── app.js         ← Lógica del frontend
│   └── index.html     ← Página que ve el usuario
├── .env               ← Variables secretas (API keys)
├── .gitignore         ← Archivos que Git debe ignorar
├── package.json       ← Configuración del proyecto
└── server.js          ← Backend (servidor Node.js)
```

## Cuando tengas un proveedor de API real

1. Abrí el archivo `.env`.
2. Reemplazá `pegame_aca_tu_clave_cuando_la_tengas` por la clave real que te dio el proveedor.
3. En `server.js`, ajustá la URL y los campos en la función `consultarProveedor`.
4. Reiniciá el servidor (`Ctrl + C` y `npm run dev`).
