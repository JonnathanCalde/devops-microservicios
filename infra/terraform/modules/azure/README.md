# Módulo Azure (ACR)

Este módulo crea un Azure Container Registry (ACR) para almacenar imágenes de contenedor.

Entradas (variables):

- repo_name: nombre del repositorio/registro
- env: entorno (staging/prod)
- resource_group_name: resource group donde crear el ACR
- location: región

Salidas:

- registry: host del ACR

Requisitos:

- Terraform >= 1.5.0
- AzureRM provider configurado en el root module

Uso:

- Llamar desde el root module con `module "azure"` y pasar `repo_name`, `resource_group_name` y `location`.

Seguridad:

- No incluir credenciales en ficheros. Use Service Principal con permisos mínimos en CI.
