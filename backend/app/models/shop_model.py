from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    DECIMAL,
    Boolean,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from ._base import Base


class Product(Base):
    __tablename__ = "products"

    id_product = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False)
    product_desc = Column(Text, nullable=True)
    product_price = Column(DECIMAL(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    images_url = Column(Text, nullable=True)        
    discount = Column(DECIMAL(5, 2), default=0)       
    active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<Product(id={self.id_product}, name='{self.product_name}')>"


class Cart(Base):
    __tablename__ = "cart"

    id_cart = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("auth.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    active = Column(Boolean, default=True)

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Cart(id={self.id_cart}, user_id={self.user_id})>"


class CartItem(Base):
    __tablename__ = "cart_items"

    id_item = Column(Integer, primary_key=True, index=True)
    id_cart = Column(Integer, ForeignKey("cart.id_cart"), nullable=False)
    id_product = Column(Integer, ForeignKey("products.id_product"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    price_at_time = Column(DECIMAL(10, 2), nullable=False)
    discount_at_time = Column(DECIMAL(5, 2), default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")

    def __repr__(self):
        return (
            f"<CartItem(id={self.id_item}, cart={self.id_cart}, "
            f"product={self.id_product}, qty={self.quantity})>"
        )
