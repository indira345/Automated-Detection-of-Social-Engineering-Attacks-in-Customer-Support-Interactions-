# Sample Test Cases for Spam Detection

## High Risk Spam Examples:

1. **OTP Credential Theft:**
   "Dear customer, your bank account has been suspended due to suspicious activity. Please verify your OTP code by calling 555-0123 immediately to avoid permanent closure."

2. **Lottery Scam:**
   "CONGRATULATIONS! You have won $1,000,000 in our exclusive international lottery! Act now to claim your prize before it expires in 24 hours. Call 555-PRIZE."

3. **Tax Refund Scam:**
   "Official IRS Notice: You are eligible for a tax refund of $2,847. Click the link below to verify your information and receive your refund immediately."

4. **Account Suspension:**
   "URGENT: Your PayPal account has been limited due to security concerns. Verify your identity within 48 hours or face permanent suspension."

## Low Risk (Normal) Examples:

1. **Normal Message:**
   "Hi there! Hope you're having a great day. Let me know if you'd like to meet for coffee sometime this week."

2. **Business Communication:**
   "The meeting has been rescheduled to 3 PM tomorrow. Please bring the quarterly reports. Thanks!"

3. **Personal Chat:**
   "Thanks for helping me with the project yesterday. Really appreciate your support!"

## Testing Instructions:

1. Start the application (backend + frontend)
2. Login to the system
3. Navigate to "Scam Detection" 
4. Test with above examples
5. Check confidence scores and classifications

Expected Results:
- Confidence above 25% (0.25) = SPAM
- High risk examples should score 0.5+ confidence
- Normal examples should score below 0.25
- Scam types should be correctly classified