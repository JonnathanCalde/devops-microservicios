variable "env" { type = string }
variable "region" { type = string }
variable "cluster_name" { type = string }
variable "node_count" { type = number }
variable "node_size" { type = string }
variable "k8s_version" { type = string }
variable "repo_name" { type = string }
variable "resource_group_name" { type = string }
variable "location" { type = string }
variable "ssh_public_key" { 
  type = string
  default = ""
}
