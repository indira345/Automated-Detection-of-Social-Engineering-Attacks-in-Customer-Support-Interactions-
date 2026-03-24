from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Message(BaseModel):
    sender_username: str
    receiver_username: str
    message: str

class MessageResponse(BaseModel):
    sender_username: str
    receiver_username: str
    message: str
    timestamp: datetime
    is_read: bool = False

class ChatSummary(BaseModel):
    username: str
    email: str
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0
