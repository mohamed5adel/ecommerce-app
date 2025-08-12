# Terraform outputs for DevOps demo infrastructure

output "instance_public_ip" {
  description = "Public IP address of the k3s EC2 instance"
  value       = aws_instance.k3s.public_ip
}

output "instance_id" {
  description = "ID of the k3s EC2 instance"
  value       = aws_instance.k3s.id
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "ID of the subnet"
  value       = aws_subnet.main.id
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.k3s.id
}

output "ecr_repository_url" {
  description = "URL of the ECR repository (if created)"
  value       = var.create_ecr ? aws_ecr_repository.app[0].repository_url : "ECR repository not created"
}

output "ssh_command" {
  description = "SSH command to connect to the k3s instance"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ec2-user@${aws_instance.k3s.public_ip}"
}

output "kubectl_command" {
  description = "Command to copy kubeconfig from the k3s instance"
  value       = "scp -i ~/.ssh/${var.key_name}.pem ec2-user@${aws_instance.k3s.public_ip}:/etc/rancher/k3s/k3s.yaml ~/.kube/config"
}

output "application_urls" {
  description = "URLs for accessing the application and monitoring"
  value = {
    app_health_check = "http://${aws_instance.k3s.public_ip}:30000/health"
    prometheus      = "http://${aws_instance.k3s.public_ip}:30090"
    grafana         = "http://${aws_instance.k3s.public_ip}:30300"
    pgadmin         = "http://${aws_instance.k3s.public_ip}:30080"
  }
}

output "cost_estimate" {
  description = "Estimated monthly cost for this setup (Free Tier eligible)"
  value = {
    ec2_instance = "~$0.00/month (Free Tier: 750 hours/month)"
    ebs_storage  = "~$0.00/month (Free Tier: 30GB/month)"
    data_transfer = "~$0.00/month (Free Tier: 15GB/month)"
    total_estimate = "~$0.00/month (Free Tier eligible)"
    note = "Costs may apply after Free Tier period or if usage exceeds limits"
  }
}

