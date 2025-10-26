# Este módulo crea un Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = lower(replace("${var.env}${var.repo_name}repo", "[^a-z0-9]", ""))
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = false
}

output "registry" {
  value = azurerm_container_registry.acr.login_server
}
