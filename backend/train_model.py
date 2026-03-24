import pandas as pd
import numpy as np
from spam_model import SpamDetectionModel
from preprocessor import TextPreprocessor
import urllib.request
import os

def download_dataset():
    """Download SMS Spam Collection dataset"""
    url = "https://raw.githubusercontent.com/mohitgupta-omg/Kaggle-SMS-Spam-Collection-Dataset-/master/spam.csv"
    filename = "spam_dataset.csv"
    
    if not os.path.exists(filename):
        print("Downloading SMS Spam dataset...")
        urllib.request.urlretrieve(url, filename)
        print("Dataset downloaded successfully!")
    
    return filename

def load_and_prepare_data():
    """Load and prepare the dataset"""
    try:
        # Try to download dataset
        filename = download_dataset()
        df = pd.read_csv(filename, encoding='latin-1')
        
        # Clean column names
        df = df.iloc[:, :2]  # Keep only first 2 columns
        df.columns = ['label', 'message']
        
    except Exception as e:
        print(f"Could not download dataset: {e}")
        print("Creating sample dataset...")
        
        # Create sample dataset if download fails
        sample_data = {
            'label': ['spam', 'ham', 'spam', 'ham', 'spam', 'ham'] * 100,
            'message': [
                'URGENT! Your account will be suspended. Call now!',
                'Hey, how are you doing today?',
                'Congratulations! You won $1000. Click here to claim.',
                'Meeting at 3pm tomorrow. See you there.',
                'FINAL NOTICE: Pay your tax refund fee immediately.',
                'Thanks for the dinner last night!'
            ] * 100
        }
        df = pd.DataFrame(sample_data)
    
    # Convert labels to binary
    df['label'] = df['label'].map({'spam': 1, 'ham': 0})
    
    return df['message'].tolist(), df['label'].tolist()

def train_model():
    """Train the spam detection model"""
    print("Loading dataset...")
    texts, labels = load_and_prepare_data()
    
    print(f"Dataset loaded: {len(texts)} samples")
    print(f"Spam ratio: {sum(labels)/len(labels):.2%}")
    
    # Initialize components
    preprocessor = TextPreprocessor()
    model = SpamDetectionModel()
    
    print("Training model...")
    history = model.train(texts, labels, preprocessor)
    
    # Save model
    print("Saving model...")
    model.save_model('spam_model.h5', 'preprocessor.pkl')
    
    print("Training completed!")
    
    # Test with sample texts
    test_texts = [
        "Congratulations! You have won $1000. Call now to claim your prize!",
        "Hey, are we still meeting for lunch tomorrow?",
        "URGENT: Your bank account has been suspended. Verify immediately.",
        "Thanks for helping me with the project yesterday."
    ]
    
    print("\nTesting model:")
    for text in test_texts:
        result = model.predict(text)
        print(f"Text: {text[:50]}...")
        print(f"Prediction: {'SPAM' if result['is_spam'] else 'HAM'} (Confidence: {result['confidence']:.2f})")
        print()

if __name__ == "__main__":
    train_model()