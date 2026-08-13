# EventPass — QR-Based Event Registration & Check-In System

EventPass is a full-stack event management system that simplifies participant registration and event attendance using secure QR passes.

Participants register with their basic details and receive a unique QR pass. Administrators can securely log in, view registered participants, and scan QR passes at the entrance to verify and record attendance.

## 🚀 Live Demo

**Frontend:**
https://eventpass-frontend.onrender.com

**Backend API:**
https://eventpass-backend-swsz.onrender.com

## ✨ Features

### Participant

* Register for an event
* Prevent duplicate email and roll-number registration
* Automatically generate a unique QR pass
* View the QR pass immediately after registration
* Download the QR code as an image
* Use the QR pass for event check-in

### Admin

* Secure admin login
* JWT-based authentication
* Protected admin dashboard
* View registered participants
* View attendance statistics
* Scan participant QR passes using the device camera
* Record attendance instantly
* Prevent duplicate check-ins

### 🔐 Security

* Passwords hashed using Argon2
* JWT access-token authentication
* Unique randomly generated QR tokens
* Protected admin endpoints
* Duplicate registration validation
* Duplicate check-in prevention
* Environment variables used for secrets and database configuration

## 🧑‍💻 User Flow

```text
Participant
    │
    ▼
Register
    │
    ▼
Participant stored in PostgreSQL
    │
    ▼
Unique QR token generated
    │
    ▼
QR Pass displayed
    │
    ▼
Participant arrives at event
    │
    ▼
Admin scans QR
    │
    ▼
Backend verifies QR token
    │
    ▼
Attendance recorded
```

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* `@yudiel/react-qr-scanner`

### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT
* Argon2
* QR code generation

### Deployment

* Render
* GitHub

## 🏗️ Architecture

```text
┌───────────────────────┐
│       Participant     │
│     Mobile / Desktop  │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│   React + Vite        │
│      Frontend         │
└──────────┬────────────┘
           │ REST API
           ▼
┌───────────────────────┐
│      FastAPI          │
│       Backend         │
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│     PostgreSQL        │
│       Database        │
└───────────────────────┘
```

## 📁 Project Structure

```text
qr-event-checkin/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   ├── auth.py
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd qr-event-checkin
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

Start the backend:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## 🔑 Admin Setup

Create an admin account using the backend admin creation script:

```bash
cd backend
python create_admin.py
```

Enter the requested username, email, and password.

The admin can then log in through the EventPass admin interface.

## 📡 API Overview

### Authentication

```text
POST /auth/login
```

Authenticates an administrator and returns a JWT access token.

### Participants

```text
POST /api/participants/
GET  /api/participants/
GET  /api/participants/{participant_id}/qr
```

### Check-In

```text
POST /api/checkin/
```

Verifies the QR token and records attendance.

### Health Check

```text
GET /health
```

Used to verify that the backend and database connection are operational.

## 🔄 QR Check-In Logic

Each participant receives a cryptographically random QR token during registration.

The QR code represents the participant's unique token rather than exposing sensitive participant information.

During check-in:

1. Admin scans the QR code.
2. Frontend extracts the QR token.
3. Token is sent to the FastAPI backend.
4. Backend verifies the participant.
5. Backend checks whether the participant has already checked in.
6. Attendance is recorded.
7. Admin receives the verification result.

## 📱 Responsive & Mobile Support

EventPass is designed to work across desktop and mobile devices.

The mobile version supports:

* Participant registration
* QR pass viewing
* Admin authentication
* QR camera scanning
* Event check-in

The production deployment was tested on a mobile device using the deployed HTTPS application.

## 🌐 Deployment

EventPass is deployed using Render.

```text
Frontend
React + Vite
       │
       ▼
Render Static Site

Backend
FastAPI
       │
       ▼
Render Web Service
       │
       ▼
PostgreSQL
```

Production environment variables are configured separately from local development.

## 🧠 What This Project Demonstrates

EventPass demonstrates practical full-stack development concepts including:

* REST API design
* React frontend development
* FastAPI backend development
* Relational database integration
* SQLAlchemy ORM
* Authentication and authorization
* Password hashing
* JWT-based sessions
* QR generation and scanning
* API integration
* CORS configuration
* Environment variable management
* Responsive UI development
* Production deployment
* Mobile testing

## 🔮 Future Improvements

Possible future enhancements include:

* Event creation and management
* Multiple events
* Role-based admin permissions
* CSV attendance export
* Email confirmation after registration
* Real-time attendance analytics
* QR pass expiry
* Event-specific QR tokens
* Automated deployment tests

## 👩‍💻 Author

**Pari Maheshwari**

Built as a full-stack event registration and attendance management project.

---

⭐ If you find this project useful, consider giving the repository a star.
