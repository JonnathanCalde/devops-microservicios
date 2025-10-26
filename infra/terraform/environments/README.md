Examples for using the root terraform module per environment.

Usage examples:

# AWS staging

terraform init -backend-config="bucket=<bucket>" -backend-config="key=envs/aws/staging/terraform.tfstate" \
 -backend-config="region=us-east-1"
terraform plan -var-file=./aws/staging.tfvars

# AWS prod

terraform init -backend-config="bucket=<bucket>" -backend-config="key=envs/aws/prod/terraform.tfstate" \
 -backend-config="region=us-east-1"
terraform plan -var-file=./aws/prod.tfvars

# Azure staging

terraform init -backend-config="storage_account_name=<sa>" -backend-config="container_name=tfstate" -backend-config="key=envs/azure/staging/terraform.tfstate"
terraform plan -var-file=./azure/staging.tfvars

# Notes

- Do NOT commit real backend configuration files with credentials.
- Use CI secret variables to pass backend configuration in automated pipelines.
