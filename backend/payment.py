from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import get_db, Cart, CartItem, Order, OrderItem, User
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class PaymentRequest(BaseModel):
    card_number: str
    expiry_date: str
    cvv: str
    card_holder: str

@router.post("/payment")
def process_payment(payment: PaymentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total amount
    total_amount = sum(item.quantity * item.product.price for item in cart.items)
    
    # Create order
    order = Order(user_id=current_user.id, total_amount=total_amount, status="completed")
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Create order items
    for cart_item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
        db.add(order_item)
    
    # Clear cart
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    
    return {"message": "Payment successful", "order_id": order.id, "total_amount": total_amount}
