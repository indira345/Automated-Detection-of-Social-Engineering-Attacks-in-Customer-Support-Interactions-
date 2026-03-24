import uvicorn
import sys
import os

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting spam detection server...")
    print("Server will be available at: http://localhost:8000")
    print("API docs at: http://localhost:8000/docs")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )