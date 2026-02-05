from sqlalchemy.orm import Session
from models import Employee, Attendance

def create_employee(db: Session, employee):
    emp = Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp



def get_employees(db: Session):
    return db.query(Employee).all()


def delete_employee(db: Session, employee_id: str):
    emp = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if emp:
        db.delete(emp)
        db.commit()
    return emp


# def mark_attendance(db: Session, attendance):
#     record = Attendance(**attendance.dict())
#     db.add(record)
#     db.commit()
#     db.refresh(record)
#     return record


# def get_attendance(db: Session, employee_id: str):
#     return db.query(Attendance).filter(
#         Attendance.employee_id == employee_id
#     ).all()

from datetime import date
from models import Attendance, Employee
from sqlalchemy.orm import Session

def mark_attendance(db: Session, attendance):
    # Check employee exists
    emp = db.query(Employee).filter(
        Employee.employee_id == attendance.employee_id
    ).first()

    if not emp:
        return None, "Employee not found"

    # 🚫 Prevent future dates
    if attendance.date > date.today():
        return None, "Attendance cannot be marked for future dates"

    # Prevent duplicate attendance
    existing = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    ).first()

    if existing:
        return None, "Attendance already marked for this date"

    record = Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record, None



def get_attendance(db: Session, employee_id: str):
    return (
        db.query(Attendance)
        .filter(Attendance.employee_id == employee_id)
        .order_by(Attendance.date.desc())
        .all()
    )
