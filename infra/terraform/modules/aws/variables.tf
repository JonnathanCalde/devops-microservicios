// Reuse common variables
variable "env" { type = string }
variable "region" { type = string }
variable "cluster_name" { type = string }
variable "node_count" { type = number }
variable "node_size" { type = string }
variable "k8s_version" { type = string }

// Module variables for AWS registry
variable "repo_name" { type = string }
