from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas, crud
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import date

import os

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000))
    )

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/employees", status_code=201)
def add_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Employee).filter(
        (models.Employee.employee_id == employee.employee_id) |
        (models.Employee.email == employee.email)
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Employee already exists")

    return crud.create_employee(db, employee)




@app.get("/employees")
def list_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)


@app.delete("/employees/{employee_id}")
def remove_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = crud.delete_employee(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted"}


@app.post("/attendance", status_code=201)
def add_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    record, error = crud.mark_attendance(db, attendance)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return record




from sqlalchemy import func

@app.get("/attendance/summary/{employee_id}")
def attendance_summary(employee_id: str, db: Session = Depends(get_db)):
    present_count = (
        db.query(func.count())
        .select_from(models.Attendance)
        .filter(
            models.Attendance.employee_id == employee_id,
            models.Attendance.status.ilike("present")

        )
        .scalar()
    )

    return {
        "employee_id": employee_id,
        "present_days": present_count
    }


@app.get("/attendance/{employee_id}")
def view_attendance(
    employee_id: str,
    date_filter: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    )

    if date_filter:
        query = query.filter(models.Attendance.date == date_filter)

    return query.order_by(models.Attendance.date.desc()).all()

from datetime import date
from typing import Optional

@app.get("/attendance/summary/{employee_id}/range")
def attendance_summary_range(
    employee_id: str,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    present_count = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.employee_id == employee_id,
            models.Attendance.status.ilike("present"),
            models.Attendance.date >= start_date,
            models.Attendance.date <= end_date,
        )
        .count()
    )

    return {
        "employee_id": employee_id,
        "start_date": start_date,
        "end_date": end_date,
        "present_days": present_count,
    }

from datetime import date

@app.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_employees = db.query(models.Employee).count()

    today = date.today()

    present_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status.ilike("present")
    ).count()

    absent_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status.ilike("absent")
    ).count()

    total_attendance_records = db.query(models.Attendance).count()

    return {
        "total_employees": total_employees,
        "total_attendance_records": total_attendance_records,
        "present_today": present_today,
        "absent_today": absent_today,
        "date": today
    }

