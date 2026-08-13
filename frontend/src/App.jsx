import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCheckIn from "./pages/admin/AdminCheckIn";
import { isAuthenticated, removeToken } from "./utils/auth";
import "./App.css";

function App() {
  const [page, setPage] = useState("register");
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  function handleLogin() {
    setAuthenticated(true);
    setPage("dashboard");
  }

  function handleLogout() {
    removeToken();
    setAuthenticated(false);
    setPage("register");
  }

  return (
    <>
      <nav className="navbar">
        <h2>QR Event Check-In</h2>

        <div className="nav-buttons">
          <button onClick={() => setPage("register")}>
            Register
          </button>

          {!authenticated ? (
            <button onClick={() => setPage("login")}>
              Admin Login
            </button>
          ) : (
            <>
              <button onClick={() => setPage("checkin")}>
                Admin Check-In
              </button>

              <button onClick={() => setPage("dashboard")}>
                Admin Dashboard
              </button>

              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {page === "register" && <Register />}

      {page === "login" && (
        <Login onLogin={handleLogin} />
      )}

      {page === "checkin" && authenticated && (
        <AdminCheckIn />
      )}

      {page === "dashboard" && authenticated && (
        <AdminDashboard />
      )}
    </>
  );
}

export default App;