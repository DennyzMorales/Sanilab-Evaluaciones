// services/googleDocsService.js

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4f6I2Ddq4QZS__2DxYd3fRcOpiRgDj5COW1LbZdmQfLRRdVaddP-k9DXJAq1zyqQOjA/exec'; // Reemplaza con tu URL

exports.enviarRespuesta = async ({ nombre, puntaje, fecha }) => {
  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, puntaje, fecha })
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error al enviar a Google Docs: ${error}`);
  }

  return await res.json();
};
