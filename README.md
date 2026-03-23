# OCR-Spam Detection System 🛡️

A comprehensive spam detection system that combines Optical Character Recognition (OCR) with Machine Learning to detect spam in both text messages and images. Built with FastAPI backend and React frontend.

## 🌟 Features

- **Text Spam Detection**: Advanced ML-based spam detection for text messages
- **Image OCR**: Extract and analyze text from images using Tesseract OCR
- **Real-time Analysis**: Live spam detection with trained ML models
- **User Authentication**: Secure JWT-based authentication system
- **Interactive Dashboard**: User-friendly web interface
- **Chat Interface**: Secure messaging with spam detection
- **Multi-format Support**: Analyze various image formats (PNG, JPEG, etc.)

## 🏗️ Architecture

```
OCR-Spam-Detection/
├── backend/                 # FastAPI backend server
│   ├── app/                # API endpoints and models
│   ├── ml/                 # Machine learning models and services
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   └── chat-app/          # Main React app
├── data/                   # Sample data and test images
├── ocr/                    # OCR processing modules
└── docs/                   # Documentation files
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Git
- Tesseract OCR

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/OCR-Spam-Detection.git
   cd OCR-Spam-Detection
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   ```bash
   cp .env.template .env
   # Edit .env with your MongoDB URI and secret key
   ```

4. **Train ML Model**
   ```bash
   cd ml
   python train_model.py
   cd ..
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend/chat-app
   npm install
   ```

### Running the Application

1. **Start Backend** (from backend directory)
   ```bash
   python start_server.py
   ```
   Backend runs on: http://localhost:8000

2. **Start Frontend** (from frontend/chat-app directory)
   ```bash
   npm start
   ```
   Frontend runs on: http://localhost:3000

## 📖 Detailed Setup

For comprehensive setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 🔧 API Documentation

Once running, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/spam-detection/analyze-text` - Analyze text for spam
- `POST /api/spam-detection/analyze-image` - Analyze image for spam

## 🧪 Testing

Run the test suite:

```bash
# Test OCR functionality
python tesseract_test.py

# Test API endpoints
python test_api.py

# Test spam detection integration
python test_scam_integration.py
```

See [TEST_CASES.md](TEST_CASES.md) for detailed testing procedures.

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **TensorFlow/Keras** - Machine learning models
- **Tesseract OCR** - Text extraction from images
- **MongoDB** - Database for user data and chat history
- **JWT** - Authentication tokens

### Frontend
- **React** - User interface framework
- **JavaScript/JSX** - Frontend logic
- **CSS** - Styling and responsive design

### Machine Learning
- **Natural Language Processing** - Text preprocessing and analysis
- **Neural Networks** - Spam classification models
- **Image Processing** - OCR and text extraction

## 📊 Model Performance

The spam detection model achieves:
- **Accuracy**: 95%+ on test dataset
- **Precision**: 94%+ for spam detection
- **Recall**: 96%+ for spam identification

## 🔒 Security Features

- JWT-based authentication
- Environment variable protection
- Input validation and sanitization
- CORS configuration
- Secure password handling

## 📝 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete installation instructions
- [API Documentation](http://localhost:8000/docs) - Interactive API docs
- [Test Cases](TEST_CASES.md) - Testing procedures
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Tesseract OCR team for the OCR engine
- TensorFlow team for the ML framework
- FastAPI team for the excellent web framework
- React team for the frontend framework

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review the [Test Cases](TEST_CASES.md)
3. Open an issue on GitHub

---

**Made with ❤️ for spam-free communication**