#!/bin/bash
echo "🚀 Python Monolith Ecommerce Deployment Started..."

# Docker image oluştur
echo "🐳 Building Docker image..."
docker build -t python-ecommerce .

# Eski container'ı durdur ve sil
echo "🛑 Stopping old container..."
docker stop ecommerce-app 2>/dev/null || true
docker rm ecommerce-app 2>/dev/null || true

# Yeni container'ı başlat
echo "▶️ Starting new container..."
docker run -d -p 8000:8000 --name ecommerce-app python-ecommerce

echo "✅ Deployment completed! Check: http://localhost:8000"
echo "📋 Logs: docker logs ecommerce-app"
