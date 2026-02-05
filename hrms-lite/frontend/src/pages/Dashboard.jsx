import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard/summary")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>Failed to load dashboard</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Total Employees</p>
          <p className="text-3xl font-bold">{data.total_employees}</p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Attendance Records</p>
          <p className="text-3xl font-bold">
            {data.total_attendance_records}
          </p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Present Today</p>
          <p className="text-3xl font-bold text-green-600">
            {data.present_today}
          </p>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-500">Absent Today</p>
          <p className="text-3xl font-bold text-red-600">
            {data.absent_today}
          </p>
        </div>
      </div>
    </div>
  );
}
