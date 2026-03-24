from fastapi import APIRouter, HTTPException, Depends
from app.models import Message, MessageResponse
from app.auth import verify_token
from app.db import get_db
from datetime import datetime
import sys
import os

# Add parent directory to path for spam detection
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.spam_detection import _analyze_conversation_patterns

router = APIRouter()

@router.get("/search-user/{username}")
async def search_user(username: str, current_user: str = Depends(verify_token)):
    db = get_db()
    user = db["users"].find_one({"username": username}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": user["username"], "email": user["email"]}

@router.post("/send-message")
async def send_message(message: Message, current_user: str = Depends(verify_token)):
    if message.sender_username != current_user:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    db = get_db()
    receiver = db["users"].find_one({"username": message.receiver_username})
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    # Analyze message for scam detection
    scam_analysis = _analyze_conversation_patterns(message.message)
    is_scam = scam_analysis['confidence'] > 0.25
    
    message_doc = {
        "sender_username": message.sender_username,
        "receiver_username": message.receiver_username,
        "message": message.message,
        "timestamp": datetime.utcnow(),
        "read": False,
        "is_scam": is_scam,
        "scam_confidence": scam_analysis['confidence'],
        "scam_type": scam_analysis['scam_type'],
        "risk_level": scam_analysis['risk_level']
    }
    
    db["messages"].insert_one(message_doc)
    return {"success": True, "message": "Message sent", "scam_detected": is_scam}

@router.get("/chat-history/{other_username}")
async def get_chat_history(other_username: str, current_user: str = Depends(verify_token)):
    db = get_db()
    
    messages = db["messages"].find({
        "$or": [
            {"sender_username": current_user, "receiver_username": other_username},
            {"sender_username": other_username, "receiver_username": current_user}
        ]
    }).sort("timestamp", 1)
    
    result = []
    for msg in messages:
        # If message doesn't have scam analysis, analyze it now
        if "is_scam" not in msg:
            scam_analysis = _analyze_conversation_patterns(msg["message"])
            is_scam = scam_analysis['confidence'] > 0.25
            
            # Update the message in database with scam analysis
            db["messages"].update_one(
                {"_id": msg["_id"]},
                {"$set": {
                    "is_scam": is_scam,
                    "scam_confidence": scam_analysis['confidence'],
                    "scam_type": scam_analysis['scam_type'],
                    "risk_level": scam_analysis['risk_level']
                }}
            )
            
            # Use the new analysis results
            msg["is_scam"] = is_scam
            msg["scam_confidence"] = scam_analysis['confidence']
            msg["scam_type"] = scam_analysis['scam_type']
            msg["risk_level"] = scam_analysis['risk_level']
        
        result.append({
            "sender_username": msg["sender_username"],
            "receiver_username": msg["receiver_username"],
            "message": msg["message"],
            "timestamp": msg["timestamp"].isoformat(),
            "read": msg.get("read", True),
            "is_scam": msg.get("is_scam", False),
            "scam_confidence": msg.get("scam_confidence", 0),
            "scam_type": msg.get("scam_type", "Not Spam"),
            "risk_level": msg.get("risk_level", "Low")
        })
    
    # Mark messages as read when viewing chat
    db["messages"].update_many(
        {"sender_username": other_username, "receiver_username": current_user, "read": False},
        {"$set": {"read": True}}
    )
    
    return result

@router.get("/chat-contacts")
async def get_chat_contacts(current_user: str = Depends(verify_token)):
    db = get_db()
    
    # Get all unique users the current user has chatted with
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"sender_username": current_user},
                    {"receiver_username": current_user}
                ]
            }
        },
        {
            "$sort": {"timestamp": -1}
        },
        {
            "$group": {
                "_id": {
                    "$cond": [
                        {"$eq": ["$sender_username", current_user]},
                        "$receiver_username",
                        "$sender_username"
                    ]
                },
                "last_message": {"$first": "$message"},
                "last_timestamp": {"$first": "$timestamp"}
            }
        },
        {
            "$sort": {"last_timestamp": -1}
        }
    ]
    
    contacts = list(db["messages"].aggregate(pipeline))
    
    result = []
    for contact in contacts:
        # Count unread messages from this contact
        unread_count = db["messages"].count_documents({
            "sender_username": contact["_id"],
            "receiver_username": current_user,
            "read": False
        })
        
        result.append({
            "username": contact["_id"],
            "last_message": contact["last_message"],
            "last_timestamp": contact["last_timestamp"].isoformat(),
            "unread_count": unread_count
        })
    
    return result

@router.get("/unread-notifications")
async def get_unread_notifications(current_user: str = Depends(verify_token)):
    db = get_db()
    
    # Get all unread messages for current user
    unread_messages = db["messages"].find({
        "receiver_username": current_user,
        "read": False
    }).sort("timestamp", -1).limit(10)
    
    notifications = []
    for msg in unread_messages:
        notifications.append({
            "sender_username": msg["sender_username"],
            "message": msg["message"],
            "timestamp": msg["timestamp"].isoformat(),
            "is_scam": msg.get("is_scam", False),
            "scam_confidence": msg.get("scam_confidence", 0),
            "scam_type": msg.get("scam_type", "Not Spam"),
            "risk_level": msg.get("risk_level", "Low")
        })
    
    total_unread = db["messages"].count_documents({
        "receiver_username": current_user,
        "read": False
    })
    
    scam_unread = db["messages"].count_documents({
        "receiver_username": current_user,
        "read": False,
        "is_scam": True
    })
    
    return {
        "notifications": notifications,
        "total_unread": total_unread,
        "scam_unread": scam_unread
    }