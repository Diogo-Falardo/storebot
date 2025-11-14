from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional
# models, schemas: shop
from app.models.shop_model import Product,Cart, CartItem
from app.models.schemas.shop_schema import productCreate, cartItemBaseExtended
# utils: exceptions
from app.utils.exceptions import THROW_ERROR

def sProduct(value: str, db: Session,title: Optional[str] = "id"):
    if title == "id":
        id = int(value)
        product = db.query(Product).filter(Product.id_product == id).first()
        if product:
            return product
        else:
            return None
    elif title == "name":
        name = value
        product = db.query(Product).filter(Product.product_name == name).first()
        if product:
            return product
        else: 
            return None
    else:
        return None
    
def sCart(user_id: int, db: Session):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if cart: return cart
    else: return None

def sCartItem_Product(id_product: int, db: Session):
    cartItem = db.query(CartItem).filter(CartItem.id_product == id_product).first()
    if cartItem: return cartItem
    else: return None

# inserts

def ins_product(payload: dict, db: Session):

    images_csv = None
    if "images_url" in payload and payload["images_url"]:
        images_csv = ','.join(str(u) for u in payload["images_url"])
    else:
        images_csv = None

    try:
        new_product = Product(
            product_name = payload["product_name"],
            product_desc = payload["product_desc"],
            product_price = payload["product_price"],
            quantity = payload["quantity"],
            images_url = images_csv,
            discount = payload.get("discount")  
        )

        db.add(new_product)
        db.commit()
        db.refresh(new_product)

        return new_product

    except Exception:
        db.rollback()
        THROW_ERROR("Error inserting product...", 500)

def ins_cart(user_id: int, db: Session):
    try:
        new_cart = Cart(
            user_id = user_id
        )

        db.add(new_cart)
        db.commit()
        db.refresh(new_cart)

        return new_cart
    except Exception:
        db.rollback()
        THROW_ERROR("Error while creating cart...", 500)

def ins_cartItem(payload: cartItemBaseExtended, db: Session):
    try:
        newItem = CartItem(
            id_cart=payload.id_cart,
            id_product=payload.id_product,
            quantity=payload.quantity,
            price_at_time= payload.price_at_time,
            discout = payload.price_at_time
        )

        db.add(newItem)
        db.commit()
        db.refresh(newItem)

        return newItem
    except Exception:
        db.rollback()
        THROW_ERROR("Error while adding item...", 500)