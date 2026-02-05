import { useEffect, useState } from "react";
import API from "../services/api";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [presentDays, setPresentDays] = useState(0);
  const [filterDate, setFilterDate] = useState("");

const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  // Load employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to load employees", err);
      }
    };
    fetchEmployees();
  }, []);

  const loadAttendance = async (employeeId) => {
  if (!employeeId) return;

  setLoading(true);
  setError("");

  try {
    const attendanceRes = await API.get(`/attendance/${employeeId}`);
    setAttendance(attendanceRes.data);

    const summaryRes = await API.get(
      `/attendance/summary/${employeeId}`
    );
    setPresentDays(summaryRes.data.present_days);
  } catch (err) {
    console.error(err);
    setPresentDays(0);
  } finally {
    setLoading(false);
  }
};


  const markAttendance = async () => {
    setError("");
    try {
      await API.post("/attendance", form);
      loadAttendance(form.employee_id);
    } catch (err) {
      setError(err.response?.data?.detail || "Error marking attendance");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>

      {/* Attendance Form */}
      <div className="flex gap-3 mb-4">
        <select
          className="border p-2"
          value={form.employee_id}
          onChange={(e) => {
            const id = e.target.value;
            setForm({ ...form, employee_id: id });
            loadAttendance(id);
          }}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.employee_id} value={emp.employee_id}>
              {emp.full_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2"
          max={new Date().toISOString().split("T")[0]}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          className="border p-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button
          onClick={markAttendance}
          className="bg-green-600 text-white px-4 py-2"
          disabled={!form.employee_id || !form.date}
        >
          Mark
        </button>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}



{/* ✅ BONUS: TOTAL PRESENT DAYS */}
<div className="mb-3 font-semibold text-green-700">
  Total Present Days: {presentDays}
</div>



<div className="flex gap-3 mb-4">
  <input
    type="date"
    className="border p-2"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />

  <input
    type="date"
    className="border p-2"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />

  <button
    className="bg-blue-600 text-white px-4 py-2"
    disabled={!form.employee_id || !startDate || !endDate}
    onClick={async () => {
      try {
        const res = await API.get(
          `/attendance/summary/${form.employee_id}/range`,
          {
            params: {
              start_date: startDate,
              end_date: endDate,
            },
          }
        );
        setPresentDays(res.data.present_days);
      } catch (err) {
        console.error(err);
      }
    }}
  >
    Apply
  </button>
</div>




<input
  type="date"
  className="border p-2 mb-3"
  value={filterDate}
  onChange={(e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (form.employee_id) {
      API.get(
        `/attendance/${form.employee_id}?date_filter=${selectedDate}`
      ).then((res) => setAttendance(res.data));
    }
  }}
/>


      {/* Attendance Table */}
      {loading ? (
        <p>Loading...</p>
      ) : attendance.length === 0 ? (
        <p>No attendance records.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td className="border p-2">{a.date}</td>
                <td className="border p-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
