/**
 * Middleware de autenticación - valida la API Key configurada.
 * Ahora exige que la variable de entorno API_KEY esté definida en runtime.
 * Si no existe, la aplicación fallará al arrancar para evitar usar un valor por defecto inseguro.
 */
require("dotenv").config();

// Use provided API_KEY; for tests only allow a safe default so unit tests/CI run
let EXPECTED_API_KEY = process.env.API_KEY;
if (!EXPECTED_API_KEY && process.env.NODE_ENV === "test") {
  EXPECTED_API_KEY = "2f5ae96c-b558-4c7b-a590-a501ae1c3f6c";
}

if (!EXPECTED_API_KEY) {
  console.error(
    "ERROR: La variable de entorno API_KEY no está definida. Defínela en .env o en el entorno."
  );
  throw new Error("API_KEY no definida");
}

/**
 * Valida si la API Key proporcionada coincide con la esperada.
 * Devuelve true si válida, false en caso contrario.
 */
function validarApiKey(apiKey) {
  return apiKey === EXPECTED_API_KEY;
}

module.exports = { validarApiKey };
