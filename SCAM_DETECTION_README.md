# Social Engineering Pattern Detection Module

## Overview
Module 1 analyzes scam patterns and behavior to protect users from social engineering attacks. This module provides real-time analysis of text content (either pasted directly or extracted from images via OCR) to detect potential scam attempts.

## Features

### 🔍 Dual Input Methods
- **Text Input**: Direct paste of suspicious text
- **Image Upload**: Drag-and-drop screenshot analysis with OCR

### 🧠 Advanced Detection Logic
- **Stage Identification**: Greeting → Trust Building → Urgency → Action
- **Tactic Recognition**: Authority, Fear, Scarcity/Urgency, Reward
- **Confidence Scoring**: 0.0 to 1.0 scale with risk categorization

### 📊 Comprehensive Results
- Scam type classification (OTP Theft, Lottery, Tax Refund, etc.)
- Visual confidence score with color-coded progress bar
- Detailed list of triggered indicators

## Technical Architecture

### Modular Structure
```
/src
  /components
    /ScamDetection
      - DetectionDashboard.jsx  # Main UI component
      - ResultsCard.jsx         # Results display
  /services
    - ocrService.js            # Tesseract.js OCR engine
    - analyzer.js              # Pattern detection logic
  /pages
    - ScamDetection.jsx        # Dedicated page
```

### Dependencies
- **Tesseract.js**: OCR text extraction from images
- **React**: UI framework
- **React Router**: Navigation

## Scam Detection Patterns

### Stages Detected
1. **Greeting**: Hello, Dear, Congratulations
2. **Trust Building**: Bank, Official, Government, Verified
3. **Urgency**: Urgent, Immediately, Expire, Limited time
4. **Action**: Click, Call, Reply, Send, Verify

### Tactics Identified
1. **Authority**: Police, Court, IRS, Bank impersonation
2. **Fear**: Suspended, Blocked, Arrest, Legal action
3. **Scarcity**: Limited offer, Expires soon, Last chance
4. **Reward**: Winner, Prize, Free money, Lottery

### Scam Types Classified
- **OTP Credential Theft**: Banking/account verification scams
- **Lottery/Prize Scam**: Fake winnings and rewards
- **Account Suspension Scam**: Fake security alerts
- **Tax/Refund Scam**: Government impersonation
- **Generic Social Engineering**: Other manipulation attempts

## Usage

### Navigation
1. Login to the application
2. From the home page, click "🛡️ Scam Detection"
3. Choose input method: "📝 Paste Text" or "📷 Upload Screenshot"

### Text Analysis
1. Select "Paste Text" mode
2. Paste suspicious content into the text area
3. Click "🔍 Analyze" button
4. Review results in the analysis card

### Image Analysis
1. Select "Upload Screenshot" mode
2. Drag and drop an image or click to browse
3. Wait for OCR processing
4. Click "🔍 Analyze" button
5. Review extracted text and analysis results

## Risk Assessment

### Score Interpretation
- **0.0 - 0.39**: Low Risk (Green)
- **0.4 - 0.69**: Medium Risk (Yellow)  
- **0.7 - 1.0**: High Risk (Red)

### Confidence Factors
- Number of stages detected (max 4)
- Number of tactics identified (max 4)
- Bonus for multiple stage/tactic combinations
- Pattern matching accuracy

## Security Considerations
- No data persistence - analysis is performed client-side
- Images processed locally via Tesseract.js
- No server-side storage of sensitive content
- Real-time analysis without data retention

## Future Enhancements
- Machine learning model integration
- Expanded pattern database
- Multi-language support
- Batch processing capabilities
- API integration for real-time protection