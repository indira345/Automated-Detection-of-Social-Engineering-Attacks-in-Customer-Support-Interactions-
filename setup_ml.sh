#!/bin/bash

echo "Setting up ML environment for spam detection..."

# Navigate to backend directory
cd backend

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Navigate to ML directory
cd ml

# Train the model
echo "Training spam detection model..."
python train_model.py

echo "Setup complete! The spam detection model is ready to use."