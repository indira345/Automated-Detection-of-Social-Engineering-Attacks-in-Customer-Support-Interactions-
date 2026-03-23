@echo off
echo Setting up ML environment for spam detection...

cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

cd ml

echo Training spam detection model...
python train_model.py

echo Setup complete! The spam detection model is ready to use.
pause