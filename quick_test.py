import requests
import json

def test_spam_detection():
    """Quick test of spam detection API"""
    
    # Test model status first
    print("Testing model status...")
    try:
        response = requests.get("http://localhost:8000/api/spam-detection/model-status")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Connection error: {e}")
        return
    
    # Test text analysis (no auth needed for testing)
    print("\nTesting text analysis...")
    test_text = "URGENT! Your account will be suspended. Call now!"
    
    try:
        response = requests.post(
            "http://localhost:8000/api/spam-detection/analyze-text",
            json={"text": test_text}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Text: {test_text}")
            print(f"Is Spam: {result['data']['is_spam']}")
            print(f"Confidence: {result['data']['confidence']}")
            print(f"Risk Level: {result['data']['risk_level']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_spam_detection()