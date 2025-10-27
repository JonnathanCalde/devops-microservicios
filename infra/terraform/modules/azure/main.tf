# Este módulo crea un Azure Container Registry
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "acr" {
  name                = lower(replace("${var.env}${var.repo_name}repo", "[^a-z0-9]", ""))
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = false
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = lower(replace(var.cluster_name, "[^a-z0-9]", ""))

  default_node_pool {
    name       = "agentpool"
    node_count = var.node_count
    vm_size    = var.node_size
  }

  identity {
    type = "SystemAssigned"
  }

  linux_profile {
    admin_username = "azureuser"

    ssh_key {
      key_data = var.ssh_public_key
    }
  }

  kubernetes_version = var.k8s_version == "" ? null : var.k8s_version
}

resource "azurerm_public_ip" "lb_ip" {
  name                = "${var.cluster_name}-lb-ip"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  allocation_method   = "Static"
  sku                 = "Standard"
}

output "registry" {
  value = azurerm_container_registry.acr.login_server
}

output "lb_public_ip" {
  value = azurerm_public_ip.lb_ip.ip_address
}
