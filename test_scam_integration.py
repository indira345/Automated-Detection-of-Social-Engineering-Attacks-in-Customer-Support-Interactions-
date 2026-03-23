#!/usr/bin/env python3
"""
Test script for scam detection integration in chat app
"""

import requests
import json
import base64

# Test configuration
BASE_URL = "http://localhost:8000"
TEST_MESSAGES = [
    "Hey, how are you doing today?",  # Normal message
    "URGENT! Your account will be suspended. Call now!",  # High risk scam
    "Congratulations! You won $1000. Click here to claim.",  # Prize scam
    "Meeting at 3pm tomorrow. See you there.",  # Normal message
    "FINAL NOTICE: Pay your tax refund fee immediately.",  # Tax scam
]

def test_text_analysis():
    """Test the spam detection endpoint"""
    print("🧪 Testing Scam Detection Integration")
    print("=" * 50)
    
    for i, message in enumerate(TEST_MESSAGES, 1):
        print(f"\n📝 Test {i}: {message[:50]}...")
        
        try:
            response = requests.post(
                f"{BASE_URL}/api/spam/analyze-text",
                json={"text": message},
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()['data']
                print(f"✅ Analysis Complete:")
                print(f"   🎯 Scam Type: {data['scam_type']}")
                print(f"   📈 Confidence: {data['confidence']:.3f} ({data['confidence']*100:.1f}%)")
                print(f"   ⚠️  Risk Level: {data['risk_level']}")
                print(f"   🚨 Is Scam: {'YES' if data['is_spam'] else 'NO'}")
                print(f"   🔍 Indicators: {', '.join(data['indicators']) if data['indicators'] else 'None'}")
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Request failed: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Scam Detection Test Complete!")

def test_model_status():
    """Test model status endpoint"""
    print("\n🔍 Checking Model Status...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/spam/model-status")
        if response.status_code == 200:
            status = response.json()
            print(f"📊 Model Status:")
            print(f"   🤖 Model Available: {status.get('model_available', False)}")
            print(f"   🎓 Is Trained: {status.get('is_trained', False)}")
            print(f"   🔄 Fallback Mode: {status.get('fallback_mode', True)}")
            print(f"   💬 Message: {status.get('message', 'N/A')}")
        else:
            print(f"❌ Status check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Status request failed: {e}")

if __name__ == "__main__":
    print("🚀 Starting Scam Detection Integration Test")
    print("Make sure your backend server is running on http://localhost:8000")
    print()
    
    # Test model status first
    test_model_status()
    
    # Test text analysis
    test_text_analysis()
    
    print("\n🎉 Integration test completed!")
    print("\nNext steps:")
    print("1. Start your chat app frontend")
    print("2. Send test messages to see scam detection in action")
    print("3. Check notifications for red scam alerts")