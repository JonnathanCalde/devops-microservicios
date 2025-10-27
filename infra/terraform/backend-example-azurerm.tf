# Example backend configuration for Azure (do NOT commit real credentials)
terraform {
  backend "azurerm" {
    resource_group_name  = "<tfstate-rg>"
    storage_account_name = "<tfstate-storage-account>"
    container_name       = "tfstate"
    key                  = "envs/azure/${var.env}/terraform.tfstate"
  }
}
