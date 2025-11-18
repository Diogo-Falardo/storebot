from sqlalchemy.orm import Session
# services: shop
from app.services import shop_service
# schemas: shop
from app.models.schemas.shop_schema import productCreate, cartItemBase, cartItemBaseExtended
# utils: excepitons
from app.utils.exceptions import THROW_ERROR

# insert new product
def add_product(payload: productCreate, db: Session):
    
    if shop_service.sProduct(payload.product_name, db, title="name") is not None:
        THROW_ERROR("Product name already in use", 400)

    data = payload.model_dump(exclude_unset=True)   

    return shop_service.ins_product(data,db)

def products(db: Session):

    return shop_service.get_products(db)


# cart system logic
# new cart
def new_cart(user_id: int, payload: cartItemBase, db: Session):

    product = shop_service.sProduct(payload.id_product, db)
    if not product:
        THROW_ERROR("Product not found!", 404)

    cart = shop_service.sCart(user_id,db)
    if cart:
        cart_item = shop_service.sCartItem_Product(product.id_product, db)
        if cart_item:
            if cart_item.quantity == payload.quantity:
                return cart_item
            else:
                cart_item.quantity = payload.quantity
                cart_item.price_at_time = product.product_price
                cart_item.discount_at_time = product.discount

                db.commit()
                db.refresh(cart_item)

                return cart_item
        else:
            newCartItem = cartItemBaseExtended(
                id_cart = cart.id_cart,
                id_product =  product.id_product,
                quantity = payload.quantity,
                price_at_time = product.product_price,
                discount_at_time = product.discount
            )

            cart_item = shop_service.ins_cartItem(newCartItem,db)
            return cart_item
    else:
        cart = shop_service.ins_cart(user_id,db)

        newCartItem = cartItemBaseExtended(
            id_cart = cart.id_cart,
            id_product =  product.id_product,
            quantity = payload.quantity,
            price_at_time = product.product_price,
            discount_at_time = product.discount
        )

        cart_item = shop_service.ins_cartItem(newCartItem,db)
        return cart_item
    
# get user cart
def get_cart(user_id: int, db: Session): 
    cart = shop_service.sCart(user_id,db)
    if cart is None:
        THROW_ERROR("No cart items", 404)
    
    items = shop_service.sCartItem_idCart(cart.id_cart, db)
    if items is None:
        THROW_ERROR("No cart items", 404)

    print(items)
    return items

                



    








    

