from pydantic import BaseModel, EmailStr, field_validator, ConfigDict, HttpUrl
from datetime import datetime
from typing import Optional
from decimal import Decimal
# utils: validators
from app.utils import field_V

# product --- base
class productBase(BaseModel):
    product_name: str
    product_desc: str
    product_price: Decimal
    quantity: int

    @field_validator("product_name", mode="before")
    @classmethod
    def _product_name(cls, product_name):
        return field_V.vString(product_name, title="product name", maxlen=45)
    
    @field_validator("product_desc", mode="before")
    @classmethod
    def _product_desc(cls, product_desc):
        return field_V.vString(product_desc, title="product description", maxlen=1000)
    
    @field_validator("product_price", mode="before")
    @classmethod
    def _product_price(cls, product_price):
        return field_V.vDecimal(product_price, title="price")
    
    @field_validator("quantity", mode="before")
    @classmethod
    def _quantity(cls, quantity):
        return field_V.vInt(quantity, title="quantity")

class productCreate(productBase):
    images_url: Optional[list[HttpUrl]] = None
    discount: Optional[Decimal] = None

    @field_validator("images_url", mode="before")
    @classmethod
    def _images_url(cls, url):
        if isinstance(url, list):
            return url
        
        if isinstance(url, str):
            if not url.strip():
                return None
            return [url.strip() for url in url.split(",")]
        
        if url is None:
            return None

        return url

    @field_validator("discount", mode="before")
    @classmethod
    def _discount(cls, discount):
        return field_V.vDecimal(discount, title="discount", maxNumber=90)

# OUT --- product
class productOut(productCreate):
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# cart --- base
class cartBase(BaseModel):
    user_id: int

    @field_validator("user_id", mode="before")
    @classmethod
    def _id(cls, id):
        return field_V.vID(id)

# cart item --- base
class cartItemBase(BaseModel):
    id_cart: Optional[int] = None
    id_product: int
    quantity: int

    @field_validator("id_cart", "id_product", mode="before")
    @classmethod
    def validate_ids(cls, v):
        return field_V.vID(v)
    
    @field_validator("quantity", mode="before")
    @classmethod
    def _quantity(cls, quantity):
        return field_V.vInt(quantity, title="quantity")
    
    
class cartItemBaseExtended(cartItemBase):
    price_at_time: Decimal
    discount_at_time: Decimal

    @field_validator("price_at_time", mode="before")
    @classmethod
    def _product_price(cls, product_price):
        return field_V.vDecimal(product_price, title="price")
    
    @field_validator("discount_at_time", mode="before")
    @classmethod
    def _discount(cls, discount):
        return field_V.vDecimal(discount, title="discount", maxNumber=90)

# OUT --- cart
class cartOut(BaseModel):
    id_product: int
    quantity: int
    price_at_time: Decimal
    discount_at_time: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)






