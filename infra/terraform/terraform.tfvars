# Terraform variables example file
# Copy this to terraform.tfvars and fill in your values

# AWS Configuration
aws_region = "us-east-1"

# Project Configuration
project_name = "devops-demo"
environment  = "demo"

# EC2 Instance Configuration (Free Tier)
instance_type = "t3.micro"  # Free Tier eligible
key_name      = "my-key-pair"  # Must exist in AWS

# Network Configuration
vpc_cidr         = "10.0.0.0/16"
subnet_cidr      = "10.0.1.0/24"
availability_zone = "us-east-1a"

# Security Configuration
ssh_cidr = "41.69.174.222/32"  # Replace with your actual IP address
# Example: ssh_cidr = "203.0.113.1/32"

# Optional: ECR Repository
create_ecr = false  # Set to true if you want to use ECR

# Additional Tags
tags = {
  Owner       = "your-name"
  Department  = "engineering"
  CostCenter  = "devops"
}

