from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.db import get_db
from app.models import UserSignup, UserLogin
from app.auth import hash_password, verify_password, create_access_token
from app.chat import router as chat_router
from app.spam_detection import router as spam_router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(spam_router, prefix="/api/spam-detection", tags=["spam-detection"])

@app.post("/api/signup")
async def signup(user: UserSignup):
    db = get_db()
    
    if db["users"].find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if db["users"].find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user_doc = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password)
    }
    
    db["users"].insert_one(user_doc)
    db["users"].create_index("username", unique=True)
    
    return {"success": True, "message": "User created successfully"}

@app.post("/api/login")
async def login(user: UserLogin):
    db = get_db()
    
    db_user = db["users"].find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "username": user.username}

@app.post("/test-db")
async def test_db():
    try:
        db = get_db()
        collection = db["test_connection"]
        
        document = {
            "message": "MongoDB connection successful",
            "status": "ok"
        }
        
        result = collection.insert_one(document)
        
        return {
            "success": True,
            "message": "Document inserted successfully",
            "inserted_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
