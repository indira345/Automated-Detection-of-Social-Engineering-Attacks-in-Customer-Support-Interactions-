// Test the scam detection functionality
import analyzer from '../services/analyzer.js';

// Test cases for different scam types
const testCases = [
  {
    name: "OTP Credential Theft",
    text: "Dear customer, your bank account has been suspended. Please verify your OTP code immediately by calling 555-0123 to avoid permanent closure."
  },
  {
    name: "Lottery Scam", 
    text: "Congratulations! You have won $1,000,000 in our exclusive lottery. Act now to claim your prize before it expires in 24 hours."
  },
  {
    name: "Tax Refund Scam",
    text: "Official IRS notice: You are eligible for a tax refund of $2,500. Click here to verify your information and receive your refund immediately."
  },
  {
    name: "Low Risk Text",
    text: "Hi there! Hope you're having a great day. Let me know if you'd like to meet for coffee sometime this week."
  }
];

console.log("=== SCAM DETECTION TEST RESULTS ===\n");

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Text: "${testCase.text}"`);
  
  const results = analyzer.analyzeText(testCase.text);
  
  console.log(`Scam Type: ${results.scamType}`);
  console.log(`Confidence Score: ${(results.score * 100).toFixed(1)}%`);
  console.log(`Indicators: ${results.indicators.join(', ') || 'None'}`);
  console.log(`Stages: ${Object.entries(results.stages).filter(([k,v]) => v).map(([k,v]) => k).join(', ') || 'None'}`);
  console.log(`Tactics: ${Object.entries(results.tactics).filter(([k,v]) => v).map(([k,v]) => k).join(', ') || 'None'}`);
  console.log("---\n");
});