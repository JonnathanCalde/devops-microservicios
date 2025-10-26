provider "aws" {
  region = var.region
}

# (Este módulo crea el repositorio ECR para el proyecto en AWS)

# Optional ECR registry
resource "aws_ecr_repository" "app" {
  name = "${var.env}-${var.repo_name}-repo"
}

output "registry" {
  value = aws_ecr_repository.app.repository_url
}
