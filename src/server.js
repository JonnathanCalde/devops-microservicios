/**
 * Punto de entrada principal del microservicio DevOps.
 * Configura Express, registra rutas y levanta el servidor.
 */
require("dotenv").config();
const express = require("express");

// En environments distintos de test exigir SECRET_KEY para seguridad
if (process.env.NODE_ENV !== "test" && !process.env.SECRET_KEY) {
  console.error("ERROR: la variable de entorno SECRET_KEY debe estar definida");
  process.exit(1);
}

const app = express();
const devopsRouter = require("./routes/devops");
let tokenRouter;
try {
  tokenRouter = require("./routes/token");
} catch (err) {
  // Si no existe el router de token no interrumpe el arranque; se puede omitir en prod
  tokenRouter = null;
}
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use("/DevOps", devopsRouter);
if (tokenRouter) app.use("/token", tokenRouter);
app.use((req, res) => res.status(405).json({ message: "ERROR" }));

// Levantar servidor solo si no estamos en entorno de pruebas (jest establece NODE_ENV=test)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log("Servidor en puerto " + PORT));
}

// Health endpoint para readiness/liveness checks
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

module.exports = app;
