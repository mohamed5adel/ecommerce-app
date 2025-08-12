#!/bin/bash
# User data script for EC2 instance to install k3s
# This script runs when the EC2 instance first boots

set -e

# Update system
yum update -y

# Install required packages
yum install -y \
    docker \
    git \
    curl \
    wget \
    unzip \
    jq

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl /usr/local/bin/

# Install k3s
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--docker --write-kubeconfig-mode 644" sh -

# Wait for k3s to be ready
echo "Waiting for k3s to be ready..."
until kubectl get nodes >/dev/null 2>&1; do
    echo "Waiting for k3s..."
    sleep 5
done

# Get node info
kubectl get nodes

# Create namespace for the application
kubectl create namespace devops-demo --dry-run=client -o yaml | kubectl apply -f -

# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/baremetal/deploy.yaml

# Wait for ingress controller to be ready
echo "Waiting for NGINX Ingress Controller..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

# Install metrics server for HPA
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Patch metrics server to work with k3s
kubectl patch deployment metrics-server -n kube-system --type='strategic' -p='{"spec":{"template":{"spec":{"containers":[{"name":"metrics-server","args":["--kubelet-insecure-tls","--kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname"]}]}}}}'

# Wait for metrics server to be ready
kubectl wait --namespace kube-system \
  --for=condition=ready pod \
  --selector=k8s-app=metrics-server \
  --timeout=300s

# Create a simple test deployment to verify everything works
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
  namespace: default
spec:
  containers:
  - name: nginx
    image: nginx:alpine
    ports:
    - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: test-service
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
  selector:
    name: test-pod
EOF

# Wait for test pod to be ready
kubectl wait --for=condition=ready pod/test-pod --timeout=300s

# Test the setup
echo "Testing k3s setup..."
kubectl get pods -A
kubectl get services -A
kubectl get nodes

# Create a simple health check endpoint
cat <<EOF > /home/ec2-user/health-check.sh
#!/bin/bash
echo "K3s Health Check:"
echo "=================="
echo "Kubernetes version: \$(kubectl version --short --client)"
echo "Nodes: \$(kubectl get nodes --no-headers | wc -l)"
echo "Pods: \$(kubectl get pods --all-namespaces --no-headers | wc -l)"
echo "Services: \$(kubectl get services --all-namespaces --no-headers | wc -l)"
echo "=================="
EOF

chmod +x /home/ec2-user/health-check.sh

# Print completion message
echo "=========================================="
echo "K3s installation completed successfully!"
echo "=========================================="
echo "Instance is ready for deployment."
echo "Use the following commands to access your cluster:"
echo "1. SSH: ssh -i your-key.pem ec2-user@$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "2. Copy kubeconfig: scp -i your-key.pem ec2-user@$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):/etc/rancher/k3s/k3s.yaml ~/.kube/config"
echo "3. Test: kubectl get nodes"
echo "=========================================="

# Log completion
logger "K3s installation completed successfully on $(hostname)"

