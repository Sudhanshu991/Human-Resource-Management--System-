from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True)
    department = Column(String)


# class Attendance(Base):
#     __tablename__ = "attendance"

#     id = Column(Integer, primary_key=True, index=True)
#     employee_id = Column(String, ForeignKey("employees.employee_id"))
#     date = Column(Date)
#     status = Column(String)
class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)

    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="unique_employee_date"),
    )
