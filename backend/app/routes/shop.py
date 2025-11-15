from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
# system: db, security
from app.system.db import db
from app.system.system import validate_auth_token, validate_sender
# schemas: shop
from app.models.schemas.shop_schema import productCreate, productOut, cartItemBase, cartOut
# controllers: shop
from app.controllers import shop_controller
# utils: exceptions
from app.utils.exceptions import THROW_ERROR

router = APIRouter(prefix="/shop", tags=["shop"])

# add product -> ADMIN
@router.post("/addProduct", response_model=productOut, name="addProduct")
def add_product(
    payload: productCreate,
    sender_id = Depends(validate_auth_token),
    db: Session = Depends(db)
):
    validate_sender(sender_id, db)

    return shop_controller.add_product(payload,db)

# cart system
@router.post("/cart", response_model=cartOut, name="newCart")
def add_cart(
    payload: cartItemBase,
    sender_id = Depends(validate_auth_token),
    db: Session = Depends(db)
):
    return shop_controller.new_cart(sender_id,payload,db)

@router.get("/my-cart", response_model=list[cartOut], name="userCart")
def get_cart(
    sender_id = Depends(validate_auth_token),
    db: Session = Depends(db)
):
    return shop_controller.get_cart(sender_id,db)

 