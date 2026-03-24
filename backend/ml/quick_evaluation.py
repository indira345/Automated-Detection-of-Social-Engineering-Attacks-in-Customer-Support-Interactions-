"""
Quick ML Model Evaluation - Terminal Only
Shows accuracy and metrics without visualization dependencies
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from spam_model import SpamDetectionModel
import os

def quick_evaluate():
    """Quick evaluation with terminal output only"""
    
    print("\n" + "="*70)
    print(" "*20 + "🤖 ML MODEL EVALUATION")
    print("="*70 + "\n")
    
    # Load dataset
    try:
        # Try different encodings
        df = None
        for encoding in ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']:
            try:
                df = pd.read_csv('spam_dataset.csv', encoding=encoding)
                print(f"✓ Dataset loaded: {len(df)} samples\n")
                break
            except UnicodeDecodeError:
                continue
        
        if df is None:
            print("✗ Error: Could not decode CSV file")
            return
    except Exception as e:
        print(f"✗ Error: {e}")
        return
    
    # Check and fix column names
    print(f"Columns found: {list(df.columns)}")
    
    # Handle different column name formats
    if 'v2' in df.columns and 'v1' in df.columns:
        df.columns = ['label', 'text'] + list(df.columns[2:])
    elif 'message' in df.columns:
        df.rename(columns={'message': 'text'}, inplace=True)
    elif 'Message' in df.columns:
        df.rename(columns={'Message': 'text'}, inplace=True)
    
    # Convert labels to binary
    if df['label'].dtype == 'object':
        df['label'] = df['label'].map({'ham': 0, 'spam': 1})
    
    print(f"Using columns: text, label\n")
    
    # Prepare data
    X = df['text'].values
    y = df['label'].values
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Load model
    model = SpamDetectionModel()
    
    if not os.path.exists('spam_model.h5'):
        print("✗ Model not found. Run: python train_model.py")
        return
    
    model.load_model('spam_model.h5', 'preprocessor.pkl')
    print("✓ Model loaded\n")
    
    # Predictions
    print("🔄 Evaluating model...\n")
    y_pred = []
    
    for text in X_test:
        result = model.predict(text)
        y_pred.append(1 if result['is_spam'] else 0)
    
    y_pred = np.array(y_pred)
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print("="*70)
    print(" "*25 + "📊 PERFORMANCE METRICS")
    print("="*70 + "\n")
    
    print(f"  🎯 Accuracy:  {accuracy*100:6.2f}%  - Overall correctness")
    print(f"  🎯 Precision: {precision*100:6.2f}%  - Spam detection accuracy")
    print(f"  🎯 Recall:    {recall*100:6.2f}%  - Spam catch rate")
    print(f"  🎯 F1-Score:  {f1*100:6.2f}%  - Balanced performance")
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    print("\n" + "="*70)
    print(" "*25 + "📊 CONFUSION MATRIX")
    print("="*70 + "\n")
    
    print(f"                    Predicted")
    print(f"                 Not Spam    Spam")
    print(f"  Actual Not Spam    {tn:4d}      {fp:4d}")
    print(f"         Spam        {fn:4d}      {tp:4d}")
    
    print(f"\n  ✓ Correctly identified spam:     {tp:4d}")
    print(f"  ✓ Correctly identified not spam: {tn:4d}")
    print(f"  ✗ False alarms:                  {fp:4d}")
    print(f"  ✗ Missed spam:                   {fn:4d}")
    
    # Summary
    print("\n" + "="*70)
    print(" "*28 + "✅ SUMMARY")
    print("="*70 + "\n")
    
    if accuracy >= 0.95:
        status = "🌟 EXCELLENT"
        color = "green"
    elif accuracy >= 0.90:
        status = "✅ GOOD"
        color = "green"
    elif accuracy >= 0.80:
        status = "⚠️  FAIR"
        color = "yellow"
    else:
        status = "❌ NEEDS IMPROVEMENT"
        color = "red"
    
    print(f"  Model Status: {status}")
    print(f"\n  • Correctly classifies {accuracy*100:.1f}% of all messages")
    print(f"  • Catches {recall*100:.0f} out of 100 spam messages")
    print(f"  • {precision*100:.0f} out of 100 flagged messages are actually spam")
    print(f"  • Misses only {(1-recall)*100:.0f} spam messages per 100")
    
    print("\n" + "="*70 + "\n")

if __name__ == "__main__":
    quick_evaluate()
