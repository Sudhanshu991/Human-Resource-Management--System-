HRMS Lite – Full-Stack Application

A lightweight Human Resource Management System (HRMS Lite) built as a full-stack web application.
This project focuses on core HR operations such as employee management and attendance tracking, with a clean UI and real backend persistence.

The goal of this project is to demonstrate end-to-end full-stack development skills, not to over-engineer features.

🚀 Features
✅ Core Features
1.Add, view, and delete employees
2.Mark daily attendance (Present / Absent)
3.Prevent duplicate attendance for the same employee and date
4.Server-side validation (required fields, valid email, duplicates)
5.Persistent storage using SQLite
6.Proper API error handling with meaningful messages


⭐ Bonus Features
1.Display total present days per employee
2.Filter attendance and attendance count between selected date ranges
3.Dashboard summary:
    >Total employees
    >Total attendance records
    >Present today
    >Absent today

🛠️ Tech Stack
Frontend
->React (Vite)
->Tailwind CSS
->Axios
->React Router


Backend
->FastAPI
->SQLAlchemy
->SQLite
->Pydantic


Development Tools
->Uvicorn
->Swagger UI (API testing)

📂 Project Structure
hrms-lite/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── hrms.db
│   └── venv/
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Employees.jsx
    │   │   ├── Attendance.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json


⚙️ How to Run Locally

1️⃣ Backend Setup
    
    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    

->Backend will run at:
    http://127.0.0.1:8000


->Swagger UI:
    http://127.0.0.1:8000/docs

2️⃣ Frontend Setup

    cd frontend
    npm install
    npm run dev


->Frontend will run at:
    http://localhost:5173


📊 Application Flow

1.Admin adds employees
2.Employees are stored in the database
3.Admin marks attendance for employees
4.Attendance is validated and stored
5.Attendance records and analytics are displayed in real time
6.Dashboard provides a quick HR overview


->🧠 Design Decisions & Assumptions
    .Single admin user (no authentication)
    .SQLite used for simplicity and fast setup
    .Attendance is treated as historical data (future dates not allowed)
    .Backend validations are prioritized over frontend-only checks
    .Clean, minimal UI over heavy styling


⚠️ Limitations
No authentication or role management
No payroll or leave management
Designed for learning/demo purposes, not large-scale production use


->🎯 What This Project Demonstrates
    .Full-stack development from scratch
    .RESTful API design
    .Database modeling and relationships
    .Frontend–backend integration
    .Real-world bug fixing and debugging
    .Clean and readable code structure


📌 Conclusion

HRMS Lite is a simple but complete full-stack application that simulates essential HR workflows.
It focuses on correctness, clarity, and usability, making it a strong foundation for further expansion into a full HR system.