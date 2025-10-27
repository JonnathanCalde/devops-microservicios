variable "provider" {
  description = "Cloud provider to deploy (fixed to azure)"
  type        = string
  default     = "azure"
}

variable "env" {
  description = "Environment name (staging, master)"
  type        = string
  default     = "staging"

  validation {
    condition     = contains(["staging", "master"], var.env)
    error_message = "env must be one of: staging, master"
  }
}

variable "region" {
  description = "Cloud region (kept for compatibility)"
  type        = string
  default     = "eastus"
}

variable "repo_name" {
  description = "Repository name to create (without suffix)"
  type        = string
  default     = "devops-microservicios"
}

# Azure specific variables
variable "resource_group_name" {
  description = "Resource group to create/use for Azure resources"
  type        = string
  default     = "rg-devops-microservicios"
}

variable "location" {
  description = "Azure location/region"
  type        = string
  default     = "eastus"
}

variable "node_count" {
  description = "Number of nodes for the AKS cluster"
  type        = number
  default     = 2
}

variable "node_size" {
  description = "VM size for AKS node pool"
  type        = string
  default     = "Standard_DS2_v2"
}

variable "cluster_name" {
  description = "Name for the AKS cluster"
  type        = string
  default     = "devops-aks-cluster"
}

variable "k8s_version" {
  description = "Kubernetes version for AKS (leave empty for provider default)"
  type        = string
  default     = ""
}

variable "ssh_public_key" {
  description = "SSH public key for node access (optional)"
  type        = string
  default     = ""
}
