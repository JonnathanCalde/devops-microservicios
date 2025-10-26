/**
 * Endpoint para generar JWT de prueba.
 * Protegido con API Key para evitar uso indiscriminado.
 */
const express = require("express");
const router = express.Router();
const { validarApiKey } = require("../middlewares/auth");
const { generarTokenJwtUnico } = require("../utils/jwt");

router.post("/", (req, res) => {
  const apiKey = req.header("X-Parse-REST-API-Key");
  if (!validarApiKey(apiKey)) return res.status(401).json({ message: "ERROR" });

  const { duration = 60, to = "test", from = "test" } = req.body || {};
  const token = generarTokenJwtUnico({ to, from }, duration);
  return res.json({ jwt: token });
});

module.exports = router;
