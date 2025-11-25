#!/bin/bash
echo "🚀 PRODUCTION DEPLOYMENT BAŞLIYOR..."

# Backend Deployment
echo "🔧 Backend kuruluyor..."
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Backend Service
sudo tee /etc/systemd/system/ecommerce-backend.service > /dev/null <<EOF
[Unit]
Description=Ecommerce Backend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/venv/bin/python3 main.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ecommerce-backend
sudo systemctl restart ecommerce-backend

# Frontend Deployment
echo "🎨 Frontend build ediliyor..."
cd ../frontend
npm install
npm run build

# Frontend Service
sudo tee /etc/systemd/system/ecommerce-frontend.service > /dev/null <<EOF
[Unit]
Description=Ecommerce Frontend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npx serve dist -s -l 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ecommerce-frontend
sudo systemctl restart ecommerce-frontend

# Firewall
echo "🔥 Firewall ayarlanıyor..."
sudo ufw allow 8000
sudo ufw allow 3000
sudo ufw allow 80
sudo ufw allow 22

echo "🎉 DEPLOYMENT TAMAMLANDI!"
echo "📍 Backend: http://$(curl -s ifconfig.me):8000"
echo "📍 Frontend: http://$(curl -s ifconfig.me):3000"
