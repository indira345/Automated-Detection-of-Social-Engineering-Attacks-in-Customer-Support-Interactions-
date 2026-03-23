import cv2
import pytesseract

# Windows users only
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load image
image_path = "data/raw_images/chat2.jpeg"
img = cv2.imread(image_path)

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# OCR config
custom_config = r'--oem 3 --psm 6'

# Extract text
text = pytesseract.image_to_string(gray, config=custom_config)

print("===== OCR OUTPUT =====")
print(text)
