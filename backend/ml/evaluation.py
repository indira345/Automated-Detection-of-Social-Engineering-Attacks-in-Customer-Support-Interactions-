"""
ML Model Evaluation Script
Evaluates the spam detection model and displays accuracy metrics
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score, roc_curve
)
import matplotlib.pyplot as plt
import seaborn as sns
from spam_model import SpamDetectionModel
from preprocessor import TextPreprocessor
import os

def load_dataset():
    """Load the spam dataset"""
    try:
        # Try different encodings
        for encoding in ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']:
            try:
                df = pd.read_csv('spam_dataset.csv', encoding=encoding)
                print(f"✓ Dataset loaded: {len(df)} samples")
                
                # Check and fix column names
                print(f"Columns: {list(df.columns)}")
                
                if 'v2' in df.columns and 'v1' in df.columns:
                    df.columns = ['label', 'text'] + list(df.columns[2:])
                elif 'message' in df.columns:
                    df.rename(columns={'message': 'text'}, inplace=True)
                elif 'Message' in df.columns:
                    df.rename(columns={'Message': 'text'}, inplace=True)
                
                # Convert labels to binary
                if df['label'].dtype == 'object':
                    df['label'] = df['label'].map({'ham': 0, 'spam': 1})
                
                return df
            except UnicodeDecodeError:
                continue
        print("✗ Error: Could not decode file with any encoding")
        return None
    except Exception as e:
        print(f"✗ Error loading dataset: {e}")
        return None

def evaluate_model():
    """Evaluate the trained model and display metrics"""
    
    print("\n" + "="*60)
    print("🤖 SPAM DETECTION MODEL EVALUATION")
    print("="*60 + "\n")
    
    # Load dataset
    df = load_dataset()
    if df is None:
        return
    
    # Prepare data
    X = df['text'].values
    y = df['label'].values
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"📊 Dataset Split:")
    print(f"   Training samples: {len(X_train)}")
    print(f"   Testing samples: {len(X_test)}")
    print(f"   Spam ratio: {(y_test.sum() / len(y_test) * 100):.1f}%\n")
    
    # Load trained model
    model = SpamDetectionModel()
    
    if not os.path.exists('spam_model.h5') or not os.path.exists('preprocessor.pkl'):
        print("✗ Model not found. Please train the model first.")
        return
    
    model.load_model('spam_model.h5', 'preprocessor.pkl')
    print("✓ Model loaded successfully\n")
    
    # Make predictions
    print("🔄 Making predictions...")
    y_pred_proba = []
    y_pred = []
    
    for text in X_test:
        result = model.predict(text)
        y_pred_proba.append(result['confidence'])
        y_pred.append(1 if result['is_spam'] else 0)
    
    y_pred = np.array(y_pred)
    y_pred_proba = np.array(y_pred_proba)
    
    # Calculate metrics
    print("\n" + "="*60)
    print("📈 PERFORMANCE METRICS")
    print("="*60 + "\n")
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    try:
        auc = roc_auc_score(y_test, y_pred_proba)
    except:
        auc = 0.0
    
    print(f"🎯 Accuracy:  {accuracy*100:.2f}%")
    print(f"🎯 Precision: {precision*100:.2f}%")
    print(f"🎯 Recall:    {recall*100:.2f}%")
    print(f"🎯 F1-Score:  {f1*100:.2f}%")
    print(f"🎯 ROC-AUC:   {auc*100:.2f}%")
    
    # Confusion Matrix
    print("\n" + "="*60)
    print("📊 CONFUSION MATRIX")
    print("="*60 + "\n")
    
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    print(f"                Predicted")
    print(f"                Not Spam    Spam")
    print(f"Actual Not Spam    {tn:4d}      {fp:4d}")
    print(f"       Spam        {fn:4d}      {tp:4d}")
    
    print(f"\n✓ True Positives:  {tp} (Correctly identified spam)")
    print(f"✓ True Negatives:  {tn} (Correctly identified not spam)")
    print(f"✗ False Positives: {fp} (Incorrectly flagged as spam)")
    print(f"✗ False Negatives: {fn} (Missed spam)")
    
    # Classification Report
    print("\n" + "="*60)
    print("📋 DETAILED CLASSIFICATION REPORT")
    print("="*60 + "\n")
    
    print(classification_report(y_test, y_pred, 
                                target_names=['Not Spam', 'Spam'],
                                digits=4))
    
    # Additional Statistics
    print("="*60)
    print("📊 ADDITIONAL STATISTICS")
    print("="*60 + "\n")
    
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    npv = tn / (tn + fn) if (tn + fn) > 0 else 0
    
    print(f"Specificity (True Negative Rate): {specificity*100:.2f}%")
    print(f"Negative Predictive Value:        {npv*100:.2f}%")
    print(f"False Positive Rate:              {(fp/(fp+tn))*100:.2f}%")
    print(f"False Negative Rate:              {(fn/(fn+tp))*100:.2f}%")
    
    # Save visualizations
    print("\n" + "="*60)
    print("📊 GENERATING VISUALIZATIONS")
    print("="*60 + "\n")
    
    try:
        # Create figure with subplots
        fig, axes = plt.subplots(2, 2, figsize=(14, 12))
        fig.suptitle('Spam Detection Model Evaluation', fontsize=16, fontweight='bold')
        
        # 1. Confusion Matrix Heatmap
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0, 0],
                    xticklabels=['Not Spam', 'Spam'],
                    yticklabels=['Not Spam', 'Spam'])
        axes[0, 0].set_title('Confusion Matrix')
        axes[0, 0].set_ylabel('Actual')
        axes[0, 0].set_xlabel('Predicted')
        
        # 2. Metrics Bar Chart
        metrics_names = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
        metrics_values = [accuracy, precision, recall, f1]
        colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c']
        
        bars = axes[0, 1].bar(metrics_names, metrics_values, color=colors, alpha=0.8)
        axes[0, 1].set_title('Performance Metrics')
        axes[0, 1].set_ylabel('Score')
        axes[0, 1].set_ylim([0, 1])
        axes[0, 1].axhline(y=0.9, color='green', linestyle='--', alpha=0.5, label='90% threshold')
        
        for bar in bars:
            height = bar.get_height()
            axes[0, 1].text(bar.get_x() + bar.get_width()/2., height,
                           f'{height*100:.1f}%',
                           ha='center', va='bottom', fontweight='bold')
        
        # 3. ROC Curve
        if auc > 0:
            fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
            axes[1, 0].plot(fpr, tpr, color='#667eea', lw=2, 
                           label=f'ROC curve (AUC = {auc:.3f})')
            axes[1, 0].plot([0, 1], [0, 1], color='gray', lw=1, linestyle='--')
            axes[1, 0].set_xlim([0.0, 1.0])
            axes[1, 0].set_ylim([0.0, 1.05])
            axes[1, 0].set_xlabel('False Positive Rate')
            axes[1, 0].set_ylabel('True Positive Rate')
            axes[1, 0].set_title('ROC Curve')
            axes[1, 0].legend(loc="lower right")
            axes[1, 0].grid(alpha=0.3)
        
        # 4. Prediction Distribution
        spam_proba = y_pred_proba[y_test == 1]
        not_spam_proba = y_pred_proba[y_test == 0]
        
        axes[1, 1].hist(not_spam_proba, bins=30, alpha=0.6, label='Not Spam', color='green')
        axes[1, 1].hist(spam_proba, bins=30, alpha=0.6, label='Spam', color='red')
        axes[1, 1].set_xlabel('Prediction Confidence')
        axes[1, 1].set_ylabel('Frequency')
        axes[1, 1].set_title('Prediction Distribution')
        axes[1, 1].legend()
        axes[1, 1].grid(alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('model_evaluation.png', dpi=300, bbox_inches='tight')
        print("✓ Visualizations saved to 'model_evaluation.png'")
        
    except Exception as e:
        print(f"✗ Error generating visualizations: {e}")
    
    # Summary
    print("\n" + "="*60)
    print("✅ EVALUATION SUMMARY")
    print("="*60 + "\n")
    
    if accuracy >= 0.95:
        print("🌟 EXCELLENT: Model performance is outstanding!")
    elif accuracy >= 0.90:
        print("✅ GOOD: Model performance is strong!")
    elif accuracy >= 0.80:
        print("⚠️  FAIR: Model performance is acceptable but could be improved")
    else:
        print("❌ POOR: Model needs significant improvement")
    
    print(f"\nThe model correctly identifies {accuracy*100:.1f}% of all messages.")
    print(f"Out of 100 spam messages, it catches {recall*100:.0f} of them.")
    print(f"Out of 100 messages flagged as spam, {precision*100:.0f} are actually spam.")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    evaluate_model()
