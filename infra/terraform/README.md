# Infra / Terraform — devops-microservicios

Este README centraliza las instrucciones para ejecutar y mantener la infraestructura Terraform del proyecto `devops-microservicios`.

Resumen

- Plataforma objetivo: Azure (ACR + AKS)
- Ambientes soportados: `staging`, `master` (solo estos dos)
- Objetivo: crear ACR, AKS con 2 nodos y una IP pública (Load Balancer)
- Política de ejecución: `plan` se ejecuta automáticamente en push a `staging`/`master`; `apply` se ejecuta automáticamente tras el plan (configurable), con control de concurrencia.

Estructura del directorio

- infra/terraform/
  - main.tf -> root module que llama a modules/azure
  - variables.tf -> variables globales (env, rg, location, node_count...)
  - versions.tf -> versiones requeridas de Terraform y providers
  - outputs.tf -> (opcional) salidas consolidadas
  - modules/azure/ -> módulo que crea RG, ACR, AKS y public IP
  - environments/azure/
    - staging.tfvars
    - prod.tfvars (o master.tfvars según convención)

Requisitos locales

- Terraform >= 1.5.0
- az CLI (para pruebas locales o depuración de AKS): https://learn.microsoft.com/cli/azure/install-azure-cli
- Cuenta y permisos en Azure (Service Principal con permisos suficientes para crear RG, ACR, AKS, Public IP)

Backend remoto (recomendado y obligatorio en CI)

- Configure un backend remoto (Azure Storage Account / container) para guardar el state y habilitar locking.
- No suba `backend.tf` con credenciales al repo. En CI pase los parámetros con `terraform init -backend-config=...` o configure variables de pipeline.
- Ejemplo de backend (no comitear):
  terraform init -backend-config="storage_account_name=<sa>" -backend-config="container_name=tfstate" -backend-config="key=envs/azure/${var.env}/terraform.tfstate"

Variables y tfvars

- `infra/terraform/variables.tf` contiene las variables que usa el root module.
- Proporcione `environments/azure/staging.tfvars` y `environments/azure/prod.tfvars` con valores por entorno.
- Ejemplo (staging.tfvars):
  env = "staging"
  resource_group_name = "rg-devops-microservicios-staging"
  location = "eastus"
  node_count = 2
  node_size = "Standard_B2s"
  cluster_name = "devops-aks-staging"
  repo_name = "devops-microservicios"

CI / GitHub Actions

- Workflow principal: `.github/workflows/terraform.yml`
  - Trigger: `push` a ramas `staging` y `master`.
  - Job `plan`: corre `terraform init` y `terraform plan -out=plan.tfplan`, sube el plan como artifact.
  - Job `apply`: por defecto configurado para ejecutarse automáticamente tras `plan`. (Se puede cambiar para dejar `apply` manual si se prefiere.)
  - `concurrency` configurado por branch para evitar ejecuciones simultáneas.

Secrets/credenciales necesarias en GitHub (repositorio)

- AZURE_CREDENTIALS: JSON del Service Principal (recomendado). Contiene clientId, clientSecret, subscriptionId, tenantId.
- TF*BACKEND*\* (si el backend requiere credenciales separadas), p.ej. STORAGE_ACCOUNT_KEY.
- API_KEY: valor runtime para la aplicación.
- SECRET_KEY: clave para firmar JWT.
- REDIS_URL: opcional, si se usará Redis para jti (replay protection).
- ACR credentials (si no se usa `az login` con AZURE_CREDENTIALS): ACR_LOGIN_SERVER, ACR_USERNAME, ACR_PASSWORD.

Política de ejecución (idempotencia y seguridad)

- El backend remoto garantiza que Terraform conozca el estado actual; si no hay cambios, `apply` no recreará recursos.
- Para proteger recursos críticos: considerar `lifecycle { prevent_destroy = true }` en recursos como pools de nodos o en AKS.
- Evite cambiar nombres y IDs de recursos entre ejecuciones (esto provoca recreaciones).
- Recomendado: revisar `terraform plan` antes de permitir `apply` automático en producción.

Implementación segura (opciones)

- Opción conservadora (recomendada): `plan` automático + `apply` manual (workflow_dispatch). Requiere revisión humana.
- Opción semi-automática: `plan` automático y `apply` automático solo si el plan JSON no contiene acciones `delete`/destructivas (el workflow puede analizar `terraform show -json plan.tfplan`).
- Opción agresiva: `plan` + `apply` automáticos (riesgo de cambios inesperados si no se valida el plan).

Tareas pendientes sugeridas

- Configurar backend remoto y colocar secretos en GitHub.
- Revisar y, si conviene, añadir `lifecycle.prevent_destroy` en recursos críticos.
- Decidir si `apply` será automático o manual según política de cambios.

Contacto y mantenimiento

- Mantenga este README actualizado si cambia la estrategia de despliegue o las variables.
- Para cambios en el pipeline de CI, editar `.github/workflows/terraform.yml` y documentarlo aquí.

---

Si quieres, aplico ahora:

- A) Forzar `apply` manual (workflow_dispatch) en lugar de automático (más seguro).
- B) Implementar el análisis JSON del plan y aplicar automáticamente solo si no hay acciones `delete`.
- C) Añadir `outputs.tf` y normalizar `variables.tf`.

Responde A, B o C (o combina) y lo hago.
