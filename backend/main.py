# backend/main.py
import os
import shutil
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from PyPDF2 import PdfReader
from jose import jwt, JWTError
from models import Base, User, UserCreate, UserLogin, UserResponse, PrintOrder, OrderCreate, OrderResponse
from security import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM


DATABASE_URL = "postgresql://postgres:1234@localhost:5432/print_platform_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Print Platform API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper Auth
def get_current_user(authorization: str = Header(...), db: Session = Depends(get_db)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Format token invalide")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise HTTPException(status_code=401, detail="Token invalide")
        
        user = db.query(User).filter(User.email == email).first()
        if user is None: raise HTTPException(status_code=401, detail="Utilisateur inconnu")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expiré ou invalide")

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user: 
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
   
    new_user = User(
        full_name=user.full_name,          
        email=user.email, 
        hashed_password=get_password_hash(user.password)
    )
    
    db.add(new_user); db.commit(); db.refresh(new_user)
    return new_user

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    access_token = create_access_token(data={"sub": db_user.email, "id": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        reader = PdfReader(file_path)
        num_pages = len(reader.pages)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Impossible de lire le PDF: {str(e)}")
    
    return {"filename": file.filename, "num_pages": num_pages}


PRICE_BW = 0.50
PRICE_COLOR = 1.00

@app.post("/calculate-price")
def calculate_price_endpoint(pages: int, mode: str):
    if mode not in ["bw", "color"]:
        raise HTTPException(status_code=400, detail="Mode d'impression invalide")
    
    unit_price = PRICE_COLOR if mode == "color" else PRICE_BW
    total = round(pages * unit_price, 2)
    
    return {
        "pages": pages,
        "mode": mode,
        "unit_price": unit_price,
        "total": total
    }


@app.post("/order", response_model=OrderResponse)
def create_order(order: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_order = PrintOrder(
        user_id=current_user.id,
        filename=order.filename,
        num_pages=order.num_pages,
        color_mode=order.color_mode,
        total_price=order.total_price,
        status="pending"
    )
    db.add(new_order); db.commit(); db.refresh(new_order)
    return new_order

@app.get("/")
def read_root():
    return {"message": "API Print Platform is running!"}