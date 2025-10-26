/**
 * Ruta /DevOps - sólo permite POST con validación de API Key y genera JWT.
 */
const express = require("express");
const router = express.Router();
const { validarApiKey } = require("../middlewares/auth");
const { verifyAndConsumeJwt } = require("../utils/jwt");

router.post("/", async (req, res) => {
  // Validación de API Key
  const apiKey = req.header("X-Parse-REST-API-Key");
  if (!validarApiKey(apiKey)) return res.status(401).json({ message: "ERROR" });

  // Validación de JWT suministrado por el cliente
  const jwtHeader = req.header("X-JWT-KWY");
  if (!jwtHeader) return res.status(401).json({ message: "ERROR" });

  try {
    await verifyAndConsumeJwt(jwtHeader); // lanza error si inválido o jti ya usado
  } catch (err) {
    return res.status(401).json({ message: "ERROR" });
  }

  // Validación del body esperado
  const { message, to, from, timeToLifeSec } = req.body || {};
  if (!message || !to || !from || typeof timeToLifeSec === "undefined") {
    return res.status(400).json({ message: "ERROR" });
  }

  // Responder exactamente con el JSON requerido (en inglés) y sin campos adicionales
  return res.json({ message: `Hello ${to} your message will be sent` });
});

// Cualquier otro método en /DevOps devuelve ERROR
router.all("/", (req, res) => res.status(405).json({ message: "ERROR" }));
module.exports = router;
