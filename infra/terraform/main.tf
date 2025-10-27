locals {
  provider = "azure"
}

provider "azurerm" {
  features {}
}

module "azure" {
  source = "./modules/azure"

  env                 = var.env
  repo_name           = var.repo_name
  resource_group_name = var.resource_group_name
  location            = var.location
  region              = var.region
  node_count          = var.node_count
  node_size           = var.node_size
  cluster_name        = var.cluster_name
  k8s_version         = var.k8s_version
}

output "registry" {
  description = "Container registry info"
  value       = module.azure.registry
}

output "lb_public_ip" {
  description = "IP pública del load balancer"
  value       = module.azure.lb_public_ip
}
