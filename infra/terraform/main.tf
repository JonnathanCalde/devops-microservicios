locals {
  provider = lower(var.provider)
}

terraform {
  required_providers {
    aws     = { source = "hashicorp/aws" }
    azurerm = { source = "hashicorp/azurerm" }
  }
}

provider "aws" {
  region = var.region
}
provider "azurerm" {
}

module "provider_selector" {
  source = "./modules/${local.provider}"

  providers = {
    aws     = aws
    azurerm = azurerm
  }

  env          = var.env
  region       = var.region
}

output "registry" {
  description = "Container registry info"
  value       = module.provider_selector.registry
}
