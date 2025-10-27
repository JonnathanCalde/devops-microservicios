locals {
  provider = "azure"
}

terraform {
  required_providers {
    azurerm = { source = "hashicorp/azurerm" }
  }

  # Backend configuration
  # Configure remote state in CI or by creating a local `backend.tf` (do NOT commit credentials).
  # Example: terraform init -backend-config="storage_account_name=<sa>" -backend-config="container_name=tfstate" -backend-config="key=envs/azure/${var.env}/terraform.tfstate"
}

provider "azurerm" {
  features = {}
}

module "azure" {
  source = "./modules/azure"

  env                 = var.env
  repo_name           = var.repo_name
  resource_group_name = var.resource_group_name
  location            = var.location
  node_count          = var.node_count
  node_size           = var.node_size
  cluster_name        = var.cluster_name
  k8s_version         = var.k8s_version
  ssh_public_key      = var.ssh_public_key
}

output "registry" {
  description = "Container registry info"
  value       = module.azure.registry
}

output "lb_public_ip" {
  description = "IP pública del load balancer"
  value       = module.azure.lb_public_ip
}
