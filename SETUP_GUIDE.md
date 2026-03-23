# OCR-Spam Detection Project Setup Guide

This guide will help you set up the OCR-Spam Detection project on any PC from scratch.

## 📋 Prerequisites

### Required Software
1. **Python 3.8 or higher** - [Download from python.org](https://www.python.org/downloads/)
2. **Node.js 16 or higher** - [Download from nodejs.org](https://nodejs.org/)
3. **Git** - [Download from git-scm.com](https://git-scm.com/)
4. **Tesseract OCR** - Required for image text extraction

### Installing Tesseract OCR

#### Windows:
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to default location: `C:\Program Files\Tesseract-OCR\`
3. Add to PATH: `C:\Program Files\Tesseract-OCR\`

#### macOS:
```bash
brew install tesseract
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install tesseract-ocr
```

## 🚀 Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd OCR-Spam-Detection
```

### 2. Backend Setup

#### Navigate to backend directory:
```bash
cd backend
```

#### Create Python virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Set up environment variables:
Create a `.env` file in the `backend` directory with:
```env
MONGODB_URI=mongodb+srv://smdhanush2003_db_user:1db6esqOGct3Et1I@cluster0.w2wrmit.mongodb.net/?retryWrites=true&w=majority
DB_NAME=OCR
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
```

#### Train the ML model:
```bash
cd ml
python train_model.py
cd ..
```

### 3. Frontend Setup

#### Navigate to frontend directory:
```bash
cd ../frontend/chat-app
```

#### Install Node.js dependencies:
```bash
npm install
```

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server
```bash
# From the backend directory
python start_server.py
```
The backend will be available at: http://localhost:8000

### 2. Start the Frontend Application
```bash
# From the frontend/chat-app directory
npm start
```
The frontend will be available at: http://localhost:3000

## 🔧 Quick Setup Scripts

### Windows Users:
Run the provided batch script:
```bash
setup_ml.bat
```

### macOS/Linux Users:
Run the provided shell script:
```bash
chmod +x setup_ml.sh
./setup_ml.sh
```

## 📁 Project Structure
```
OCR-Spam-Detection/
├── backend/                 # FastAPI backend server
│   ├── app/                # API endpoints and models
│   ├── ml/                 # Machine learning models
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   └── chat-app/          # Main React app
├── data/                   # Sample data and images
├── ocr/                    # OCR processing modules
└── setup files           # Setup scripts and documentation
```

## 🌐 API Endpoints

Once running, the following endpoints will be available:

- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Frontend App**: http://localhost:3000

### Key API Routes:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/spam-detection/analyze-text` - Analyze text for spam
- `POST /api/spam-detection/analyze-image` - Analyze image for spam

## 🧪 Testing the Setup

### 1. Test OCR functionality:
```bash
python tesseract_test.py
```

### 2. Test API endpoints:
```bash
python test_api.py
```

### 3. Test spam detection:
```bash
python test_scam_integration.py
```

## 🔍 Features

- **Text Spam Detection**: Analyze text messages for spam content
- **Image OCR**: Extract text from images using Tesseract
- **Real-time Analysis**: Live spam detection with ML models
- **User Authentication**: Secure login and registration
- **Interactive Dashboard**: User-friendly web interface

## 🛠️ Troubleshooting

### Common Issues:

1. **Tesseract not found**:
   - Ensure Tesseract is installed and added to PATH
   - Test with: `tesseract --version`

2. **Python dependencies fail**:
   - Ensure you're using Python 3.8+
   - Try upgrading pip: `pip install --upgrade pip`

3. **MongoDB connection issues**:
   - Check internet connection
   - Verify MongoDB URI in `.env` file

4. **Port already in use**:
   - Backend (8000): Change port in `start_server.py`
   - Frontend (3000): React will prompt for alternative port

### Getting Help:
- Check `TROUBLESHOOTING.md` for detailed solutions
- Review `TEST_CASES.md` for testing procedures
- See individual README files for component-specific help

## 📝 Notes

- The ML model will be trained automatically on first setup
- Sample images are provided in the `data/raw_images/` directory
- The application uses MongoDB Atlas for data storage
- All sensitive data should be properly configured in `.env` files

## 🔒 Security Considerations

- Change the `SECRET_KEY` in production
- Use environment-specific MongoDB URIs
- Implement proper CORS settings for production deployment
- Regular security updates for dependencies

---

**Project completed and ready for deployment! 🎉**