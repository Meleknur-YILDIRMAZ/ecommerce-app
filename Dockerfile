FROM python:3.9-slim

# DNS ve network ayarları
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf && \
    echo "nameserver 8.8.4.4" >> /etc/resolv.conf

WORKDIR /app

COPY backend/requirements.txt .
COPY backend/ .

# Pip için mirror kullan
RUN pip install --no-cache-dir -r requirements.txt -i https://pypi.org/simple/ --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org

EXPOSE 8000

CMD ["python", "main.py"]
