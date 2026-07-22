# backend/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, EmailStr
from datetime import datetime

# ==========================================
# 1. MODÈLES BASE DE DONNÉES (SQLAlchemy)
# ==========================================
Base = declarative_base()

class User(Base):
    """Table des utilisateurs authentifiés"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class PrintOrder(Base):
    """Table des commandes d'impression (Milestone 4)"""
    __tablename__ = "print_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    filename = Column(String, nullable=False)
    num_pages = Column(Integer, nullable=False)
    color_mode = Column(String, nullable=False)  # 'bw' ou 'color'
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================================
# 2. SCHÉMAS PYDANTIC (Validation API)
# ==========================================

# --- Utilisateur ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    
    class Config:
        from_attributes = True

# --- Commande & Options ---
class PrintOptions(BaseModel):
    color_mode: str

class OrderCreate(BaseModel):
    filename: str
    num_pages: int
    color_mode: str
    total_price: float

class OrderResponse(BaseModel):
    id: int
    filename: str
    num_pages: int
    color_mode: str
    total_price: float
    status: str
    
    class Config:
        from_attributes = True