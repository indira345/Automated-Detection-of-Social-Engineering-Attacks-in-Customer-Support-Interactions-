import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class TextPreprocessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
    
    def clean_text(self, text):
        """Clean and preprocess text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def extract_features(self, text):
        """Extract features from text"""
        cleaned_text = self.clean_text(text)
        
        # Basic features
        features = {
            'length': len(text),
            'word_count': len(text.split()),
            'exclamation_count': text.count('!'),
            'question_count': text.count('?'),
            'uppercase_ratio': sum(1 for c in text if c.isupper()) / len(text) if text else 0,
            'digit_count': sum(1 for c in text if c.isdigit()),
            'url_count': len(re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)),
            'phone_count': len(re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text))
        }
        
        return features, cleaned_text
    
    def fit_vectorizer(self, texts):
        """Fit TF-IDF vectorizer on training data"""
        cleaned_texts = [self.clean_text(text) for text in texts]
        self.vectorizer.fit(cleaned_texts)
    
    def vectorize_text(self, text):
        """Convert text to TF-IDF vector"""
        cleaned_text = self.clean_text(text)
        return self.vectorizer.transform([cleaned_text]).toarray()[0]