# devops-microservicio - Correcciones aplicadas

Se aplicaron las correcciones solicitadas: CI mejorado, CD (workflow de deploy), manifiestos Kubernetes, Helm chart, y requisito de API_KEY vía variable de entorno.

## Cambios principales realizados

- La app ahora exige la variable de entorno `API_KEY` en runtime. Si no existe, la app no arranca (evita usar un hardcoded API key).
- CI: Lint es ahora bloqueante. Se añadió un umbral mínimo de cobertura en `package.json` (jest).
- Se añadieron manifests Kubernetes y Helm chart.
- Se añadió workflow de despliegue (CD). El workflow está parametrizado y requiere que agregues secrets en GitHub: `IMAGE_REGISTRY`, `IMAGE_REGISTRY_USERNAME`, `IMAGE_REGISTRY_PASSWORD`, `IMAGE_REPOSITORY`, `KUBECONFIG`.

# Información y versiones de herramientas

Resumen rápido:

- Proyecto: devops-microservicio (microservicio Node.js + Docker).
- Propósito: ejemplo de endpoint protegido por API Key y JWT, con utilidades para evitar replay (opcionalmente usando Redis).

Requisitos (recomendado):

- Node.js: 18.10.0 (gestionado con nvm en este entorno)
- npm: versión compatible con Node 18 (npm 8.x)
- Docker: Engine reciente (20.x+) y Docker Compose v2
- Terraform (solo para la carpeta infra): recomendado >= 1.5.0
- GitHub Actions para CI/CD (workflows en .github/workflows)

Dependencias principales (según package.json):

- express ^4.18.2
- dotenv ^16.3.1
- jsonwebtoken ^9.0.0

Dependencias de desarrollo y herramientas (según package.json):

- eslint ^8.49.0
- jest ^29.7.0
- supertest ^7.1.4
- ioredis ^5.3.2
- nodemon ^3.0.1
- cross-env ^7.0.3

Cómo ejecutar localmente (resumen):

- Este repo está preparado para desplegar en Azure AKS; las instrucciones locales (docker-compose/nginx) han sido removidas para evitar confusión.

Despliegue en Azure (resumen):

1. Configure los secrets en GitHub: AZURE_CREDENTIALS, ACR_LOGIN_SERVER, API_KEY, SECRET_KEY.
2. Push a `staging` o `master` para que el pipeline construya y suba la imagen a ACR.
3. El pipeline de infra (terraform) crea ACR y AKS; el job de deploy puede usar `kubectl`/`helm` para actualizar la imagen en AKS.

Seguridad y secretos:

- No comites `.env` ni secretos. Usa `REPOSITORY secrets` o un gestor de secretos en CI.
- `REDIS_URL` es opcional: si se configura, el sistema usará Redis para llevar el control de jti consumidos (replay protection). Si está vacío, se usa un Set en memoria (no recomendable en producción con varias réplicas).

Notas adicionales:

- El servidor no monta en modo escucha cuando `NODE_ENV=test` para facilitar tests.
- Si usas Windows y nvm, asegúrate de que la versión activa de node sea 18.10.0 (`nvm use 18.10.0`).

## Cómo ejecutar localmente (desarrollo)

1. Copia `.env.example` a `.env` y rellena `API_KEY` y `SECRET_KEY`.
2. Levantar con docker-compose:

   ```bash
   docker compose up --build
   ```

   Esto levantará `app1`, `app2` y `nginx` en puertos 8001/8002 y 8080 para el proxy.

3. Obtener un JWT (ejemplo):

   ```bash
   curl -X POST -H "X-Parse-REST-API-Key: $API_KEY" -H "Content-Type: application/json" -d '{"duration":60}' http://localhost:8001/token
   ```

4. Consumir `/DevOps`:
   ```bash
   curl -X POST      -H "X-Parse-REST-API-Key: $API_KEY"      -H "X-JWT-KWY: <token>"      -H "Content-Type: application/json"      -d '{ "message": "This is a test", "to": "Juan Perez", "from": "Rita Asturia", "timeToLifeSec": 45 }'      http://localhost:8080/DevOps
   ```
