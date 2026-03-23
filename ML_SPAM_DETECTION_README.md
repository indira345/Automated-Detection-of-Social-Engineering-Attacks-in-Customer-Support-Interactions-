# ML-Powered Social Engineering Detection System

## Architecture Overview

This system implements a **Deep Learning-based spam detection** module with OCR capabilities, fully integrated into a web application backend.

### 🏗️ **Backend ML Architecture**

```
/backend
  /ml
    - spam_model.py        # Deep Neural Network (TensorFlow)
    - preprocessor.py      # Text preprocessing & feature extraction
    - ocr_service.py       # Tesseract OCR engine
    - ml_service.py        # Main ML service integration
    - train_model.py       # Model training script
  /app
    - spam_detection.py    # FastAPI endpoints
    - main.py             # Updated with ML routes
```

### 🧠 **Deep Learning Model**

**Architecture:**
- Input Layer: Combined features (TF-IDF + Manual features)
- Hidden Layers: 512 → 256 → 128 → 64 neurons
- Batch Normalization & Dropout for regularization
- Output: Sigmoid activation for binary classification

**Features:**
- **TF-IDF Vectors**: 5000 most important words
- **Manual Features**: Length, word count, special characters, URLs, phone numbers
- **Training**: Early stopping, learning rate reduction
- **Metrics**: Accuracy, Precision, Recall

### 📊 **Dataset Integration**

**Primary Source:** SMS Spam Collection Dataset (UCI)
- Automatic download from GitHub repository
- Fallback to sample dataset if download fails
- Binary classification: Spam (1) vs Ham (0)

### 🔧 **API Endpoints**

```
POST /api/spam-detection/analyze-text
POST /api/spam-detection/analyze-image  
GET  /api/spam-detection/model-status
```

### 🎯 **Frontend Integration**

**UI Components:**
- `DetectionDashboard.jsx` - Main interface with toggle
- `ResultsCard.jsx` - ML results display
- `ScamDetection.jsx` - Dedicated page

**Features:**
- Text input analysis
- Image upload with OCR
- Real-time confidence scoring
- Risk level visualization

## Setup Instructions

### 1. **Install Dependencies**

```bash
# Backend ML dependencies
cd backend
pip install -r requirements.txt

# Frontend (already installed)
cd ../frontend/chat-app
npm install
```

### 2. **Train the Model**

```bash
# Windows
setup_ml.bat

# Linux/Mac
chmod +x setup_ml.sh
./setup_ml.sh
```

### 3. **Start Services**

```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend  
cd frontend/chat-app
npm start
```

## Model Performance

### **Training Configuration**
- **Epochs**: 50 (with early stopping)
- **Batch Size**: 32
- **Optimizer**: Adam (lr=0.001)
- **Loss**: Binary Crossentropy
- **Validation Split**: 20%

### **Expected Metrics**
- **Accuracy**: >95%
- **Precision**: >90%
- **Recall**: >85%
- **F1-Score**: >87%

## Usage Workflow

### **Text Analysis**
1. User pastes suspicious text
2. Frontend sends to `/analyze-text`
3. Backend preprocesses text
4. ML model predicts spam probability
5. Results returned with confidence score

### **Image Analysis**  
1. User uploads screenshot
2. Frontend converts to base64
3. Backend extracts text via OCR
4. Text analyzed by ML model
5. Results include extracted text + analysis

## Response Format

```json
{
  "success": true,
  "data": {
    "is_spam": true,
    "confidence": 0.87,
    "risk_level": "High",
    "scam_type": "OTP Credential Theft",
    "extracted_text": "Your account suspended..."
  }
}
```

## Security Features

- **No Data Persistence**: Analysis performed in real-time
- **Server-side Processing**: All ML logic in backend
- **Token Authentication**: Protected API endpoints
- **Input Validation**: Pydantic models for request validation

## Scam Type Classification

The system automatically classifies detected spam into categories:

- **OTP Credential Theft**: Banking/verification scams
- **Lottery/Prize Scam**: Fake winnings
- **Account Suspension Scam**: Security alerts
- **Tax/Refund Scam**: Government impersonation
- **Generic Spam**: Other malicious content

## Model Retraining

To retrain with new data:

1. Add new samples to training dataset
2. Run `python train_model.py`
3. Model automatically saves to `spam_model.h5`
4. Restart backend to load new model

## Technical Requirements

**Backend:**
- Python 3.8+
- TensorFlow 2.13+
- Tesseract OCR installed
- 4GB+ RAM for model training

**Frontend:**
- Node.js 16+
- React 18+
- Modern browser with FileReader API

This implementation provides enterprise-grade spam detection with deep learning, suitable for production deployment with high accuracy and real-time performance.