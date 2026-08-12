import { useState } from "react";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCheckIn from "./pages/admin/AdminCheckIn";
import "./App.css";

function App() {
  const [page, setPage] = useState("register");

  return (
    <>
      <nav className="navbar">
        <h2>QR Event Check-In</h2>

        <div className="nav-buttons">
          <button onClick={() => setPage("register")}>
            Register
          </button>

          <button onClick={() => setPage("checkin")}>
            Admin Check-In
          </button>

          <button onClick={() => setPage("dashboard")}>
            Admin Dashboard
          </button>
        </div>
      </nav>

      {page === "register" && <Register />}

      {page === "checkin" && <AdminCheckIn />}

      {page === "dashboard" && <AdminDashboard />}
    </>
  );
}

export default App;