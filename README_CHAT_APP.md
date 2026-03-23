# Secure Messenger Chat Application

A simple full-stack chat application with authentication built using FastAPI, React, and MongoDB Atlas.

## Features

- User Authentication (Signup/Login with JWT)
- Secure Messaging between users
- Real-time chat with polling
- Protected routes
- MongoDB Atlas integration

---

## Project Structure

```
OCR-Spam-Detection/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app with auth endpoints
│   │   ├── auth.py          # JWT authentication logic
│   │   ├── chat.py          # Chat API endpoints
│   │   ├── models.py        # Pydantic models
│   │   └── db.py            # MongoDB connection
│   ├── .env                 # Environment variables
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    └── chat-app/
        ├── src/
        │   ├── pages/
        │   │   ├── Login.jsx
        │   │   ├── Signup.jsx
        │   │   ├── Home.jsx
        │   │   └── SecureMessenger.jsx
        │   ├── components/
        │   │   ├── ChatWindow.jsx
        │   │   └── MessageBubble.jsx
        │   ├── App.js
        │   └── index.js
        └── package.json
```

---

## Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Activate virtual environment (Windows)
```bash
venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Verify .env file
Make sure your `.env` file contains:
```
MONGODB_URI=mongodb+srv://smdhanush2003_db_user:1db6esqOGct3Et1I@cluster0.w2wrmit.mongodb.net/?retryWrites=true&w=majority
DB_NAME=OCR
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
```

### 5. Run FastAPI server
```bash
uvicorn app.main:app --reload
```

Backend will run on: **http://localhost:8000**

---

## Frontend Setup

### 1. Navigate to frontend folder
```bash
cd frontend\chat-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start React app
```bash
npm start
```

Frontend will run on: **http://localhost:3000**

---

## API Endpoints

### Authentication
- **POST** `/api/signup` - Create new user
- **POST** `/api/login` - Login and get JWT token

### Chat (Protected - requires JWT)
- **GET** `/api/chat/search-user/{username}` - Search user by username
- **POST** `/api/chat/send-message` - Send message to user
- **GET** `/api/chat/chat-history/{other_username}` - Get chat history

---

## MongoDB Collections

### users
```json
{
  "username": "string (unique)",
  "email": "string",
  "password": "string (hashed)"
}
```

### messages
```json
{
  "sender_username": "string",
  "receiver_username": "string",
  "message": "string",
  "timestamp": "datetime"
}
```

---

## Usage Flow

1. **Signup**: Create a new account at `/signup`
2. **Login**: Login with credentials at `/login`
3. **Home**: After login, see two options:
   - Spam Detection (UI only)
   - Secure Messenger
4. **Chat**: 
   - Search for a user by username
   - Select user to start chatting
   - Messages auto-refresh every 2 seconds

---

## Testing

### Create Test Users

**User 1:**
```bash
POST http://localhost:8000/api/signup
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

**User 2:**
```bash
POST http://localhost:8000/api/signup
{
  "username": "bob",
  "email": "bob@example.com",
  "password": "password123"
}
```

### Test Chat
1. Login as `alice`
2. Search for `bob`
3. Send messages
4. Login as `bob` in another browser/incognito
5. Search for `alice` and reply

---

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- Protected routes require valid JWT token
- CORS enabled for localhost:3000

---

## Tech Stack

**Backend:**
- FastAPI
- PyMongo
- JWT (python-jose)
- Passlib (bcrypt)

**Frontend:**
- React 18
- React Router v6
- Axios

**Database:**
- MongoDB Atlas

---

## Troubleshooting

**Backend not starting:**
- Ensure virtual environment is activated
- Check MongoDB Atlas connection string
- Verify all dependencies installed

**Frontend not starting:**
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

**Authentication errors:**
- Clear localStorage in browser
- Check if SECRET_KEY is set in .env
- Verify MongoDB connection

**Chat not working:**
- Check if both users exist in database
- Verify JWT token is valid
- Check browser console for errors

---

## Future Enhancements

- WebSocket for real-time messaging
- Message read receipts
- Group chat
- File sharing
- Spam detection integration
- User online status
- Message encryption
