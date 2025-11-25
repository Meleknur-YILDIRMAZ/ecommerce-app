from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import SessionLocal, Product, User
from auth import router as auth_router, get_password_hash
from product import router as product_router
from cart import router as cart_router
from payment import router as payment_router
import os

app = FastAPI(title="Ecommerce API")

# CORS middleware - Ubuntu server için tüm origin'lere izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ubuntu server için tüm origin'lere izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, tags=["auth"])
app.include_router(product_router, prefix="/api", tags=["products"])
app.include_router(cart_router, prefix="/api", tags=["cart"])
app.include_router(payment_router, prefix="/api", tags=["payment"])

@app.on_event("startup")
def startup():
    db = SessionLocal()
    try:
        # Create sample products if they don't exist
        if db.query(Product).count() == 0:
            sample_products = [
                # Electronics (10 products)
                Product(
                    name="iPhone 15 Pro",
                    description="Latest Apple smartphone with advanced camera",
                    price=999.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
                    stock=15
                ),
                Product(
                    name="Samsung Galaxy S24",
                    description="Powerful Android smartphone",
                    price=899.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
                    stock=12
                ),
                Product(
                    name="MacBook Pro 16",
                    description="Professional laptop for creative work",
                    price=2399.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
                    stock=8
                ),
                Product(
                    name="Sony WH-1000XM5",
                    description="Noise cancelling wireless headphones",
                    price=349.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
                    stock=20
                ),
                Product(
                    name="iPad Air",
                    description="Versatile tablet for work and entertainment",
                    price=599.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
                    stock=10
                ),
                Product(
                    name="Apple Watch Series 9",
                    description="Advanced smartwatch with health monitoring",
                    price=399.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1579586337278-3f43610277a5?w=500",
                    stock=18
                ),
                Product(
                    name="Dell XPS 13",
                    description="Compact and powerful laptop",
                    price=1199.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500",
                    stock=7
                ),
                Product(
                    name="AirPods Pro",
                    description="Wireless earbuds with spatial audio",
                    price=249.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500",
                    stock=25
                ),
                Product(
                    name="PlayStation 5",
                    description="Next-gen gaming console",
                    price=499.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
                    stock=5
                ),
                Product(
                    name="Nintendo Switch",
                    description="Hybrid gaming console",
                    price=299.99,
                    category="electronics",
                    image_url="https://images.unsplash.com/photo-1580327344181-c1163234e4a5?w=500",
                    stock=12
                ),
                
                # Clothing (10 products)
                Product(
                    name="Classic White T-Shirt",
                    description="100% cotton comfortable t-shirt",
                    price=24.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
                    stock=30
                ),
                Product(
                    name="Denim Jacket",
                    description="Vintage style denim jacket",
                    price=79.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
                    stock=15
                ),
                Product(
                    name="Black Hoodie",
                    description="Warm and comfortable hoodie",
                    price=45.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
                    stock=20
                ),
                Product(
                    name="Running Shoes",
                    description="Lightweight running shoes",
                    price=89.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                    stock=18
                ),
                Product(
                    name="Summer Dress",
                    description="Elegant summer dress",
                    price=59.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
                    stock=12
                ),
                Product(
                    name="Leather Belt",
                    description="Genuine leather belt",
                    price=34.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
                    stock=25
                ),
                Product(
                    name="Winter Coat",
                    description="Warm winter coat",
                    price=129.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
                    stock=8
                ),
                Product(
                    name="Sports Shorts",
                    description="Breathable sports shorts",
                    price=29.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=500",
                    stock=22
                ),
                Product(
                    name="Formal Shirt",
                    description="Business formal shirt",
                    price=49.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
                    stock=16
                ),
                Product(
                    name="Wool Sweater",
                    description="100% wool warm sweater",
                    price=69.99,
                    category="clothing",
                    image_url="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
                    stock=14
                ),
                
                # Books (10 products)
                Product(
                    name="The Great Gatsby",
                    description="Classic American novel",
                    price=12.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
                    stock=20
                ),
                Product(
                    name="Python Programming",
                    description="Learn Python programming",
                    price=39.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
                    stock=15
                ),
                Product(
                    name="The Hobbit",
                    description="Fantasy adventure novel",
                    price=15.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500",
                    stock=18
                ),
                Product(
                    name="Atomic Habits",
                    description="Build good habits and break bad ones",
                    price=18.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1589998059171-988d887df646?w=500",
                    stock=22
                ),
                Product(
                    name="The Art of War",
                    description="Ancient military treatise",
                    price=11.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
                    stock=16
                ),
                Product(
                    name="JavaScript Guide",
                    description="Complete JavaScript programming guide",
                    price=34.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500",
                    stock=14
                ),
                Product(
                    name="1984",
                    description="Dystopian social science fiction",
                    price=13.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500",
                    stock=19
                ),
                Product(
                    name="The Alchemist",
                    description="Philosophical novel",
                    price=14.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
                    stock=21
                ),
                Product(
                    name="Clean Code",
                    description="Software development best practices",
                    price=42.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
                    stock=12
                ),
                Product(
                    name="Harry Potter Collection",
                    description="Complete Harry Potter series",
                    price=89.99,
                    category="books",
                    image_url="https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500",
                    stock=8
                )
            ]
            
            for product in sample_products:
                db.add(product)
            
            # Create admin user
            admin_user = User(
                email="admin@admin.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Admin User"
            )
            db.add(admin_user)
            
            db.commit()
            print("✅ Sample products and admin user created successfully!")
    except Exception as e:
        print(f"❌ Error during startup: {e}")
        db.rollback()
    finally:
        db.close()

# Health check endpoint
@app.get("/")
def read_root():
    return {"message": "Ecommerce API is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Server is running"}

import os

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
