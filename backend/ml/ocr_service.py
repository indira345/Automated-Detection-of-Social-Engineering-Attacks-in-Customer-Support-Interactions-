import pytesseract
import cv2
import numpy as np
from PIL import Image
import io
import base64
import os

class OCRService:
    def __init__(self):
        # Set Tesseract path for Windows
        pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        
        try:
            pytesseract.get_tesseract_version()
            print("Tesseract found and working")
        except Exception as e:
            print(f"Tesseract error: {e}")
    
    def extract_text_from_image(self, image_data):
        """Extract text from base64 encoded image using OpenCV + Tesseract"""
        try:
            print(f"Processing image data...")
            
            # Handle data URL format
            if ',' in image_data:
                image_bytes = base64.b64decode(image_data.split(',')[1])
            else:
                image_bytes = base64.b64decode(image_data)
            
            # Convert to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            
            # Decode image using OpenCV
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise Exception("Could not decode image")
            
            print(f"Image loaded: {img.shape}")
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # OCR config for better text extraction
            custom_config = r'--oem 3 --psm 6'
            
            # Extract text
            text = pytesseract.image_to_string(gray, config=custom_config)
            
            print(f"Extracted text: '{text[:100]}...'")
            
            return text.strip()
            
        except Exception as e:
            print(f"OCR extraction error: {str(e)}")
            raise Exception(f"OCR extraction failed: {str(e)}")
    
    def extract_text_from_file(self, file_path):
        """Extract text from image file using OpenCV + Tesseract"""
        try:
            # Load image with OpenCV
            img = cv2.imread(file_path)
            
            if img is None:
                raise Exception(f"Could not load image from {file_path}")
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # OCR config
            custom_config = r'--oem 3 --psm 6'
            
            # Extract text
            text = pytesseract.image_to_string(gray, config=custom_config)
            
            return text.strip()
            
        except Exception as e:
            raise Exception(f"OCR extraction failed: {str(e)}")