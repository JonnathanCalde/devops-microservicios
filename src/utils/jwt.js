/**
 * Utilidades para generación de tokens JWT únicos.
 */
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
require("dotenv").config();

// Clave secreta para firmar/verificar JWT. En producción usar una variable de entorno segura.
const SECRET_KEY = process.env.SECRET_KEY || "clave_por_defecto";

// Redis opcional: si REDIS_URL está presente, usaremos Redis para almacenar jti usados
const REDIS_URL = process.env.REDIS_URL || null;
let redisClient = null;
let redisAvailable = false;
if (REDIS_URL) {
  try {
    const Redis = require("ioredis");
    redisClient = new Redis(REDIS_URL);
    redisAvailable = true;
  } catch (err) {
    // si no está instalada la dependencia o falla la conexión, caemos a fallback en memoria
    console.warn("Redis no disponible, se usará fallback en memoria para jti");
    redisAvailable = false;
  }
}

// Fallback en memoria (solo para desarrollo/local). En producción usar REDIS_URL.
const usedJti = new Set();

/**
 * Genera un JWT único por transacción con jti.
 * datos: objeto con información que quieras incluir (p.ej. to, from, timeToLifeSec)
 * duracion: segundos de vida del token
 */
function generarTokenJwtUnico(datos = {}, duracion = 60) {
  const ahora = Math.floor(Date.now() / 1000);
  const payload = {
    jti: randomUUID(),
    iat: ahora,
    exp: ahora + duracion,
    ...datos,
  };
  return jwt.sign(payload, SECRET_KEY, { algorithm: "HS256" });
}

/**
 * Verifica y consume (marca) un jti. Si Redis está disponible usa Redis con TTL.
 * Lanza error si el token es inválido, expirado o jti ya fue usado.
 */
async function verifyAndConsumeJwt(token) {
  if (!token) throw new Error("Token ausente");
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY, { algorithms: ["HS256"] });
  } catch (err) {
    throw new Error("Token inválido");
  }

  if (!payload || !payload.jti) throw new Error("Token sin jti");

  const jti = payload.jti;

  if (redisAvailable && redisClient) {
    // Intenta marcar el jti en Redis con NX y TTL igual al exp-iat
    const ttl = payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 60;
    if (ttl <= 0) throw new Error("Token expirado");
    const key = `used_jti:${jti}`;
    const setResult = await redisClient.set(key, "1", "NX", "EX", ttl);
    if (!setResult) {
      throw new Error("Token ya usado");
    }
  } else {
    // Fallback en memoria
    if (usedJti.has(jti)) throw new Error("Token ya usado");
    usedJti.add(jti);
  }

  return payload;
}

module.exports = { generarTokenJwtUnico, verifyAndConsumeJwt };
