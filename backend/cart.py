from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models import get_db, Cart, CartItem, Product, User
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class CartItemRequest(BaseModel):
    product_id: int
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product_name: str
    product_price: float
    product_image: str
    total_price: float

    class Config:
        from_attributes = True

@router.get("/cart", response_model=List[CartItemResponse])
def get_cart_items(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        return []
    
    cart_items = []
    for item in cart.items:
        cart_items.append(CartItemResponse(
            id=item.id,
            product_id=item.product_id,
            quantity=item.quantity,
            product_name=item.product.name,
            product_price=item.product.price,
            product_image=item.product.image_url,
            total_price=item.quantity * item.product.price
        ))
    return cart_items

@router.post("/cart")
def add_to_cart(item: CartItemRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    # Check if product exists
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already in cart
    existing_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item.product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += item.quantity
    else:
        new_item = CartItem(cart_id=cart.id, product_id=item.product_id, quantity=item.quantity)
        db.add(new_item)
    
    db.commit()
    return {"message": "Item added to cart"}

@router.delete("/cart/{item_id}")
def remove_from_cart(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}
