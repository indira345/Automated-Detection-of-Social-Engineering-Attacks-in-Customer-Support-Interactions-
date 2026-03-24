from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
import os

load_dotenv()

# Global client instance
_client = None
_db = None

def get_db():
    global _client, _db
    
    if _client is None:
        try:
            mongo_uri = os.getenv("MONGODB_URI")
            if not mongo_uri:
                raise Exception("MONGODB_URI not found in environment variables")
            
            _client = MongoClient(
                mongo_uri, 
                serverSelectionTimeoutMS=5000,
                maxPoolSize=10,
                minPoolSize=1,
                maxIdleTimeMS=30000
            )
            _client.admin.command('ping')
            _db = _client[os.getenv("DB_NAME", "OCR")]
        except Exception as e:
            raise Exception(f"MongoDB connection failed: {str(e)}")
    
    return _db
