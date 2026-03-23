import pytesseract
import os

def test_tesseract():
    try:
        version = pytesseract.get_tesseract_version()
        print(f"✅ Tesseract is working! Version: {version}")
        return True
    except Exception as e:
        print(f"❌ Tesseract not found: {e}")
        
        # Try common Windows paths
        paths = [
            r'C:\Program Files\Tesseract-OCR\tesseract.exe',
            r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            r'C:\Users\{}\AppData\Local\Tesseract-OCR\tesseract.exe'.format(os.getenv('USERNAME', ''))
        ]
        
        for path in paths:
            if os.path.exists(path):
                print(f"Found Tesseract at: {path}")
                pytesseract.pytesseract.tesseract_cmd = path
                try:
                    version = pytesseract.get_tesseract_version()
                    print(f"✅ Tesseract working with path! Version: {version}")
                    return True
                except:
                    continue
        
        print("Please install Tesseract OCR from: https://github.com/UB-Mannheim/tesseract/wiki")
        return False

if __name__ == "__main__":
    test_tesseract()