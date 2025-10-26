# Módulo AWS (ECR)

Este módulo crea un repositorio ECR para almacenar imágenes de contenedor.

Entradas (variables):

- repo_name: nombre del repositorio
- env: entorno (staging/prod)
- region: región AWS

Salidas:

- registry: endpoint del repositorio (p. ej. <account>.dkr.ecr.<region>.amazonaws.com)

Requisitos:

- Terraform >= 1.5.0
- AWS provider configurado en el root module

Uso:

- Llamar desde el root module con `module "aws"` y pasar `repo_name` y `env`.

Seguridad:

- No incluir credenciales en ficheros. Use IAM roles para CI y `aws configure` localmente si hace pruebas manuales.
