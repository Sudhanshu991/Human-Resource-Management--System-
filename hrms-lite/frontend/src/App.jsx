import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white px-6 py-4 flex gap-6">
          <Link to="/" className="font-semibold hover:underline">
            Employees
          </Link>
          <Link to="/attendance" className="font-semibold hover:underline">
            Attendance
          </Link>
          <Link to="/dashboard" className="font-semibold hover:underline">
            Dashboard
          </Link>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
