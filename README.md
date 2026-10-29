# DevOps Demo Project: Local Development to AWS k3s Deployment

A complete DevOps-ready project that demonstrates the journey from local development to production deployment on AWS using k3s on EC2 (Free Tier friendly).

## 🏗️ Architecture Overview

This project implements a modern DevOps pipeline with:
- **Local Development**: Docker Compose with Node.js backend + PostgreSQL
- **Containerization**: Multi-stage Docker builds
- **Infrastructure as Code**: Terraform for AWS resources
- **Kubernetes**: k3s cluster on EC2 (lightweight K8s)
- **CI/CD**: GitHub Actions for automated deployment
- **Monitoring**: Prometheus + Grafana stack
- **Cost Optimization**: Free Tier eligible AWS resources

## 📁 Project Structure

```
├── app/                          # Node.js backend application
│   ├── server.js                # Express server with health checks
│   ├── package.json             # Dependencies and scripts
│   └── Dockerfile               # Multi-stage production build
├── k8s/manifests/               # Kubernetes manifests
│   ├── deployment.yaml          # App deployment with probes
│   ├── service.yaml             # ClusterIP and NodePort services
│   ├── ingress-nginx.yaml       # NGINX Ingress Controller
│   ├── hpa.yaml                 # Horizontal Pod Autoscaler
│   ├── configmap.yaml           # Application configuration
│   ├── secret-template.yaml     # Secrets and PostgreSQL
│   └── monitoring.yaml          # Prometheus + Grafana
├── infra/terraform/              # Infrastructure as Code
│   ├── main.tf                  # Main Terraform configuration
│   ├── variables.tf             # Variable definitions
│   ├── outputs.tf               # Output values
│   ├── user_data.sh             # k3s installation script
│   └── terraform.tfvars.example # Example variables
├── .github/workflows/            # CI/CD pipelines
│   ├── ci-cd.yml                # Build and deploy workflow
│   └── terraform.yml            # Infrastructure workflow
├── docker-compose.yml            # Local development setup
├── init.sql                      # Database initialization
└── env.example                   # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (for local development)
- **Terraform** (for infrastructure)
- **kubectl** (for Kubernetes management)
- **AWS CLI** (for AWS operations)
- **SSH key pair** in AWS

### 1. Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd devops-demo

# Copy environment variables
cp env.example .env
# Edit .env with your values

# Start local development environment
docker-compose up --build

# Test the application
curl http://localhost:3000/health
curl http://localhost:3000/db-health
```

**Local Services:**
- **App**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:8080 (admin@example.com / admin)

### 2. Build Docker Image

```bash
# Build the application image
docker build -t devops-demo-app:latest ./app

# Test the image locally
docker run -p 3000:3000 devops-demo-app:latest
```

### 3. Deploy Infrastructure

```bash
# Navigate to Terraform directory
cd infra/terraform

# Copy and configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply

# Get outputs
terraform output
```

**Expected Outputs:**
- EC2 instance public IP
- SSH command
- kubectl configuration command

### 4. Access k3s Cluster

```bash
# SSH to the instance
ssh -i ~/.ssh/your-key.pem ec2-user@<INSTANCE_IP>

# Copy kubeconfig to local machine
scp -i ~/.ssh/your-key.pem ec2-user@<INSTANCE_IP>:/etc/rancher/k3s/k3s.yaml ~/.kube/config

# Test cluster access
kubectl get nodes
kubectl get pods -A
```

### 5. Deploy Application

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/manifests/

# Check deployment status
kubectl rollout status deployment/devops-demo-app
kubectl get pods -l app=devops-demo-app

# Access the application
# Replace <INSTANCE_IP> with your EC2 public IP
curl http://<INSTANCE_IP>:30000/health
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=password

# AWS (for production)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

### Terraform Variables

Copy `terraform.tfvars.example` to `terraform.tfvars`:

```hcl
aws_region = "us-east-1"
project_name = "devops-demo"
instance_type = "t3.micro"  # Free Tier
key_name = "your-key-pair-name"
ssh_cidr = "YOUR_IP/32"  # Your IP address
```

## 📊 Monitoring & Observability

### Prometheus
- **URL**: http://<INSTANCE_IP>:30090
- **Purpose**: Metrics collection and alerting

### Grafana
- **URL**: http://<INSTANCE_IP>:30300
- **Credentials**: admin / admin
- **Purpose**: Metrics visualization and dashboards

### Application Health Checks
- **Health**: http://<INSTANCE_IP>:30000/health
- **Database**: http://<INSTANCE_IP>:30000/db-health

## 🚀 CI/CD Pipeline

### GitHub Actions Setup

1. **Repository Secrets** (Settings → Secrets and variables → Actions):
   ```
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   KUBE_CONFIG=base64_encoded_kubeconfig
   ```

2. **Repository Variables** (Settings → Secrets and variables → Actions):
   ```
   AWS_REGION=us-east-1
   USE_ECR=false
   ECR_REPOSITORY_NAME=devops-demo-app
   ```

### Pipeline Triggers

- **Push to main**: Automatic build, test, and deploy
- **Pull Request**: Build and test only
- **Manual**: Use workflow dispatch for specific operations

## 💰 Cost Optimization

### Free Tier Eligibility

- **EC2**: t3.micro (750 hours/month)
- **EBS**: 30GB/month
- **Data Transfer**: 15GB/month
- **Estimated Cost**: $0.00/month (Free Tier)

### Production Considerations

- Use larger instance types for production workloads
- Consider EKS for production Kubernetes
- Implement proper backup strategies
- Use RDS for production databases

## 🧹 Cleanup

### Destroy Infrastructure

```bash
cd infra/terraform
terraform destroy
```

### Clean Local Environment

```bash
# Stop and remove containers
docker-compose down -v

# Remove images
docker rmi devops-demo-app:latest
```

## 🔍 Troubleshooting

### Common Issues

1. **EC2 Instance Not Starting**
   - Check security group rules
   - Verify key pair exists
   - Check instance type availability in region

2. **k3s Installation Fails**
   - Check user data script logs
   - Verify internet connectivity
   - Check instance resources

3. **Application Not Accessible**
   - Verify NodePort services
   - Check security group rules
   - Verify pod status

### Debug Commands

```bash
# Check pod logs
kubectl logs -l app=devops-demo-app

# Check pod status
kubectl describe pod -l app=devops-demo-app

# Check service endpoints
kubectl get endpoints

# Check ingress status
kubectl get ingress
```

## 📚 Additional Resources

- [k3s Documentation](https://docs.k3s.io/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with docker-compose
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This is a demo project for learning purposes. For production use, implement proper security measures, backup strategies, and monitoring solutions.
