# Troubleshooting Guide

## Common Issues & Solutions

### 1. **Model Not Trained Error**
```
Error: "Model not trained. Please train the model first."
```
**Solution:**
```bash
cd backend/ml
python train_model.py
```

### 2. **Tesseract Not Found (OCR)**
```
Error: "Tesseract not found"
```
**Solution:**
- Windows: Install from https://github.com/UB-Mannheim/tesseract/wiki
- Add to PATH or update ocr_service.py with tesseract path

### 3. **CORS Error**
```
Error: "Access blocked by CORS policy"
```
**Solution:**
- Ensure backend is running on port 8000
- Check CORS settings in main.py

### 4. **Dependencies Missing**
```
Error: "No module named 'tensorflow'"
```
**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### 5. **Frontend Build Issues**
```
Error: "Module not found"
```
**Solution:**
```bash
cd frontend/chat-app
npm install
npm start
```

## Quick Health Check

Run this to verify everything is working:

```bash
# Check backend
curl http://localhost:8000/api/spam-detection/model-status

# Check frontend
curl http://localhost:3000
```

## Performance Tips

- **Training Time**: First training takes 5-10 minutes
- **Memory**: Requires 4GB+ RAM for training
- **Storage**: Model files ~50MB after training