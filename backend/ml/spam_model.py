import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import pandas as pd
import joblib
import os

class SpamDetectionModel:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.is_trained = False
        
    def build_model(self, input_dim):
        """Build deep neural network model"""
        self.model = Sequential([
            Dense(512, activation='relu', input_shape=(input_dim,)),
            BatchNormalization(),
            Dropout(0.3),
            
            Dense(256, activation='relu'),
            BatchNormalization(),
            Dropout(0.3),
            
            Dense(128, activation='relu'),
            BatchNormalization(),
            Dropout(0.2),
            
            Dense(64, activation='relu'),
            Dropout(0.2),
            
            Dense(1, activation='sigmoid')
        ])
        
        self.model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=['accuracy', tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
        )
        
    def prepare_features(self, texts, labels=None):
        """Prepare features for training/prediction"""
        features_list = []
        tfidf_vectors = []
        
        for text in texts:
            # Extract manual features
            basic_features, cleaned_text = self.preprocessor.extract_features(text)
            features_list.append(list(basic_features.values()))
            
            # Get TF-IDF vector
            tfidf_vector = self.preprocessor.vectorize_text(text)
            tfidf_vectors.append(tfidf_vector)
        
        # Combine features
        basic_features_array = np.array(features_list)
        tfidf_array = np.array(tfidf_vectors)
        
        # Concatenate all features
        X = np.concatenate([basic_features_array, tfidf_array], axis=1)
        
        if labels is not None:
            y = np.array(labels)
            return X, y
        
        return X
    
    def train(self, texts, labels, preprocessor, validation_split=0.2):
        """Train the model"""
        self.preprocessor = preprocessor
        
        # Fit vectorizer on training data
        self.preprocessor.fit_vectorizer(texts)
        
        # Prepare features
        X, y = self.prepare_features(texts, labels)
        
        # Build model
        self.build_model(X.shape[1])
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=validation_split, random_state=42, stratify=y
        )
        
        # Train model
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=50,
            batch_size=32,
            verbose=1,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
                tf.keras.callbacks.ReduceLROnPlateau(patience=5, factor=0.5)
            ]
        )
        
        # Evaluate
        y_pred = (self.model.predict(X_val) > 0.5).astype(int)
        print("\nValidation Results:")
        print(classification_report(y_val, y_pred))
        
        self.is_trained = True
        return history
    
    def predict(self, text):
        """Predict if text is spam"""
        if not self.is_trained:
            raise Exception("Model not trained yet")
        
        X = self.prepare_features([text])
        prediction = self.model.predict(X)[0][0]
        
        return {
            'is_spam': bool(prediction > 0.5),
            'confidence': float(prediction),
            'risk_level': self._get_risk_level(prediction)
        }
    
    def _get_risk_level(self, confidence):
        """Determine risk level based on confidence"""
        if confidence >= 0.7:
            return 'High'
        elif confidence >= 0.4:
            return 'Medium'
        else:
            return 'Low'
    
    def save_model(self, model_path, preprocessor_path):
        """Save trained model and preprocessor"""
        if self.model:
            self.model.save(model_path)
        if self.preprocessor:
            joblib.dump(self.preprocessor, preprocessor_path)
    
    def load_model(self, model_path, preprocessor_path):
        """Load trained model and preprocessor"""
        if os.path.exists(model_path):
            self.model = tf.keras.models.load_model(model_path)
            self.is_trained = True
        
        if os.path.exists(preprocessor_path):
            self.preprocessor = joblib.load(preprocessor_path)