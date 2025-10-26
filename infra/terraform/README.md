Multi-cloud Terraform template for provisioning cloud resources and a managed Kubernetes cluster.

Principles:

- Provider-agnostic root module that delegates to provider-specific modules.
- Use input variables and workspaces for environment separation.
- Remote state backend configurable (S3/Azure Blob/GCS) — not committed here, set via CI or local `backend.tf`.
- Use minimal resources as example: VPC/network, managed Kubernetes cluster, registry (optional).

Structure:

- modules/aws
- modules/azure
- modules/gke (optional)
- examples

## Versiones recomendadas

- Terraform: >= 1.5.0 (probado con 1.5.x / 1.6.x)
- Providers: use las versiones gestionadas desde el root module (required_providers) — evitar `required_providers` dentro de módulos.

## Módulos incluidos

- modules/aws: crea recursos mínimos en AWS (ECR para registros de contenedores). Diseñado para integrarse con backend S3 si se requiere.
- modules/azure: crea recursos mínimos en Azure (ACR para registro de contenedores).

## Uso recomendado

1. No comites `backend.tf` ni credenciales. Crea un fichero `backend.tf` local o pasa `-backend-config` en `terraform init`.
2. Inicializa Terraform en la carpeta raíz del módulo:
   terraform init
3. Planifica y aplica para el provider deseado, por ejemplo:
   terraform plan -var "provider=aws" -var-file=./environments/aws/staging.tfvars
   terraform apply -var "provider=aws" -var-file=./environments/aws/staging.tfvars

Security:

- Do not commit secrets. Use CI secrets or provider-managed secret stores.
- Use provider IAM roles or service principals configured outside this repo.
- Nunca subas secretos en tfvars ni en el repositorio.
- Use roles/identities gestionadas (IAM, Service Principals) y CI para ejecutar Terraform con permisos mínimos.
