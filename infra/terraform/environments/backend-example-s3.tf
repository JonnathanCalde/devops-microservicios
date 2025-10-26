terraform {
  backend "s3" {
    bucket = "<your-state-bucket>"
    key    = "devops-microservicio/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}
