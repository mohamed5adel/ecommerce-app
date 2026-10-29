# Terraform variables for DevOps demo infrastructure

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project (used for resource naming)"
  type        = string
  default     = "devops-demo"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "demo"
}

variable "instance_type" {
  description = "EC2 instance type (Free Tier: t2.micro or t3.micro)"
  type        = string
  default     = "t3.micro"
  
  validation {
    condition     = contains(["t2.micro", "t3.micro", "t2.nano"], var.instance_type)
    error_message = "Instance type must be Free Tier eligible (t2.micro, t3.micro, or t2.nano)."
  }
}

variable "key_name" {
  description = "Name of the EC2 key pair for SSH access"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Availability zone for subnet"
  type        = string
  default     = "us-east-1a"
}

variable "ssh_cidr" {
  description = "CIDR block for SSH access (your IP address)"
  type        = string
  default     = "0.0.0.0/0"  # WARNING: Change this to your specific IP for production
  
  validation {
    condition     = can(cidrhost(var.ssh_cidr, 0))
    error_message = "SSH CIDR must be a valid CIDR block."
  }
}

variable "create_ecr" {
  description = "Whether to create an ECR repository"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}

