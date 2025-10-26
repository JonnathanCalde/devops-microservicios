variable "provider" {
  description = "Cloud provider to deploy (aws, azure)"
  type        = string
  default     = "aws"
}

variable "env" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.env)
    error_message = "env must be one of: dev, staging, prod"
  }
}

variable "region" {
  description = "Cloud region"
  type        = string
  default     = "us-east-1"
}

variable "repo_name" {
  description = "Repository name to create (without suffix)"
  type        = string
  default     = "devops-microservicio"
}
