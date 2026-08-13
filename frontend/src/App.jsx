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
        {/* BRAND */}
        <button
          className="navbar-brand"
          onClick={() =>
            setPage(authenticated ? "dashboard" : "register")
          }
        >
          <span className="brand-icon">QR</span>

          <span className="brand-text">
            <strong>Event</strong>
            <span>Check-In</span>
          </span>
        </button>

        {/* NAVIGATION */}
        <div className="nav-buttons">
          {!authenticated ? (
            <>
              <button
                className={page === "register" ? "nav-active" : ""}
                onClick={() => setPage("register")}
              >
                Register
              </button>

              <button
                className="nav-primary"
                onClick={() => setPage("login")}
              >
                Admin Login
              </button>
            </>
          ) : (
            <>
              <button
                className={page === "checkin" ? "nav-active" : ""}
                onClick={() => setPage("checkin")}
              >
                Check-In
              </button>

              <button
                className={page === "dashboard" ? "nav-active" : ""}
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* PUBLIC REGISTRATION */}
      {page === "register" && <Register />}

      {/* ADMIN LOGIN */}
      {page === "login" && (
        <Login onLogin={handleLogin} />
      )}

      {/* ADMIN CHECK-IN */}
      {page === "checkin" && authenticated && (
        <AdminCheckIn />
      )}

      {/* ADMIN DASHBOARD */}
      {page === "dashboard" && authenticated && (
        <AdminDashboard />
      )}
    </>
  );
}

export default App;