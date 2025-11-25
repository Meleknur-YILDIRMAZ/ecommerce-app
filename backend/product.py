from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models import get_db, Product
from pydantic import BaseModel

router = APIRouter()

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int

    class Config:
        from_attributes = True

@router.get("/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).all()
    return products

@router.get("/products/{category}", response_model=List[ProductResponse])
def get_products_by_category(category: str, db: Session = Depends(get_db)):
    products = db.query(Product).filter(
        Product.category == category, 
        Product.is_active == True
    ).all()
    return products
