# backend/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime

Base = declarative_base()

# ==========================================
# 1. MODÈLES BASE DE DONNÉES (SQLAlchemy)
# ==========================================

class User(Base):
    """Table des utilisateurs authentifiés"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)  # ✅ NOUVEAU CHAMP
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class PrintOrder(Base):
    """Table des commandes d'impression"""
    __tablename__ = "print_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    filename = Column(String, nullable=False)
    num_pages = Column(Integer, nullable=False)
    color_mode = Column(String, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================================
# 2. SCHÉMAS PYDANTIC (Validation API)
# ==========================================

class UserCreate(BaseModel):
    full_name: str          # ✅ AJOUTÉ
    email: EmailStr
    password: str
    confirm_password: str   # ✅ AJOUTÉ

    # Validation automatique : vérifie que les mots de passe correspondent
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Les mots de passe ne correspondent pas')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str  # ✅ AJOUTÉ
    email: str
    
    class Config:
        from_attributes = True

# ... (Le reste des modèles OrderCreate/OrderResponse reste inchangé)
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