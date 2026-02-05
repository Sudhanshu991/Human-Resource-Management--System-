import { useEffect, useState } from "react";
import API from "../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEmployee = async () => {
    setError("");
    try {
      await API.post("/employees", form);
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding employee");
    }
  };

  const deleteEmployee = async (id) => {
    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Employee Management</h2>

      {/* Form */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          placeholder="Employee ID"
          className="border p-2"
        />
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2"
        />
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          className="border p-2"
        />
      </div>

      <button
        onClick={addEmployee}
        className="bg-blue-600 text-white px-4 py-2 mb-4"
      >
        Add Employee
      </button>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p>No employees added yet.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employee_id}>
                <td className="border p-2">{emp.employee_id}</td>
                <td className="border p-2">{emp.full_name}</td>
                <td className="border p-2">{emp.email}</td>
                <td className="border p-2">{emp.department}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteEmployee(emp.employee_id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
