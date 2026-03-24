from spam_model import SpamDetectionModel
from preprocessor import TextPreprocessor
from ocr_service import OCRService
import os

class MLService:
    def __init__(self):
        self.model = SpamDetectionModel()
        self.ocr_service = OCRService()
        self.load_trained_model()
    
    def load_trained_model(self):
        """Load pre-trained model if available"""
        model_path = 'spam_model.h5'
        preprocessor_path = 'preprocessor.pkl'
        
        try:
            if os.path.exists(model_path) and os.path.exists(preprocessor_path):
                self.model.load_model(model_path, preprocessor_path)
                print("Pre-trained model loaded successfully")
            else:
                print("No pre-trained model found. Please train the model first.")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Please retrain the model by running: python ml/train_model.py")
    
    def analyze_text(self, text):
        """Analyze text for spam detection"""
        try:
            if not self.model.is_trained:
                return {
                    'error': 'Model not trained. Please train the model first.',
                    'success': False
                }
            
            result = self.model.predict(text)
            
            return {
                'success': True,
                'is_spam': result['is_spam'],
                'confidence': result['confidence'],
                'risk_level': result['risk_level'],
                'scam_type': self._determine_scam_type(text, result['confidence']),
                'extracted_text': text
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'success': False
            }
    
    def analyze_image(self, image_data):
        """Extract text from image and analyze for spam"""
        try:
            # Extract text using OCR
            extracted_text = self.ocr_service.extract_text_from_image(image_data)
            
            if not extracted_text.strip():
                return {
                    'error': 'No text found in the image',
                    'success': False
                }
            
            # Analyze extracted text
            result = self.analyze_text(extracted_text)
            result['extracted_text'] = extracted_text
            
            return result
            
        except Exception as e:
            return {
                'error': str(e),
                'success': False
            }
    
    def _determine_scam_type(self, text, confidence):
        """Determine scam type based on text content"""
        text_lower = text.lower()
        
        if confidence < 0.25:
            return 'Not Spam'
        
        if any(word in text_lower for word in ['otp', 'verification', 'code', 'password']):
            return 'OTP Credential Theft'
        elif any(word in text_lower for word in ['lottery', 'winner', 'prize', 'congratulations']):
            return 'Lottery/Prize Scam'
        elif any(word in text_lower for word in ['suspended', 'blocked', 'account']):
            return 'Account Suspension Scam'
        elif any(word in text_lower for word in ['tax', 'refund', 'irs']):
            return 'Tax/Refund Scam'
        else:
            return 'Generic Spam'

# Global ML service instance
ml_service = MLService()