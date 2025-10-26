terraform {
  backend "azurerm" {
    resource_group_name  = "<rg>"
    storage_account_name = "<storageaccount>"
    container_name       = "tfstate"
    key                  = "devops-microservicio/terraform.tfstate"
  }
}
