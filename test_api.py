import requests
import base64
import json

# Backend URL
BASE_URL = "http://localhost:8000"

def test_text_analysis():
    """Test text analysis endpoint"""
    print("Testing text analysis...")
    
    # Get auth token first (use existing user or create one)
    login_data = {
        "username": "testuser",
        "password": "testpass"
    }
    
    try:
        # Try to login
        response = requests.post(f"{BASE_URL}/api/login", json=login_data)
        if response.status_code != 200:
            print("Login failed. Please create a user first through the frontend.")
            return
        
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test spam text
        spam_text = "URGENT! Your account will be suspended. Call 555-0123 immediately to verify your OTP code!"
        
        response = requests.post(
            f"{BASE_URL}/api/spam-detection/analyze-text",
            json={"text": spam_text},
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Text Analysis Success!")
            print(f"Text: {spam_text}")
            print(f"Is Spam: {result['data']['is_spam']}")
            print(f"Confidence: {result['data']['confidence']:.2f}")
            print(f"Risk Level: {result['data']['risk_level']}")
            print(f"Scam Type: {result['data']['scam_type']}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

def test_model_status():
    """Test model status endpoint"""
    print("\nTesting model status...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/spam-detection/model-status")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Model Status:")
            print(f"Is Trained: {result['is_trained']}")
            print(f"Model Available: {result['model_available']}")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing Spam Detection API\n")
    test_model_status()
    test_text_analysis()
    print("\n✅ Testing completed!")