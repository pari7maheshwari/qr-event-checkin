import { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
import { apiFetch } from "../../utils/api";
import "../../App.css";
const API_URL = "http://127.0.0.1:8000";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const [statsResponse, participantsResponse] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/api/participants/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const statsData = await statsResponse.json();
      const participantsData = await participantsResponse.json();

      if (!statsResponse.ok) {
        throw new Error(
          statsData.detail || "Failed to load dashboard statistics.",
        );
      }

      if (!participantsResponse.ok) {
        throw new Error(
          participantsData.detail || "Failed to load participants.",
        );
      }

      setStats(statsData);
      setParticipants(participantsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <main className="app">
        <section className="card">
          <h1>Event Dashboard</h1>
          <p>Loading dashboard...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app">
        <section className="card">
          <h1>Event Dashboard</h1>

          <div className="error">
            <h2>⚠️ Failed to Load Dashboard</h2>
            <p>{error}</p>
          </div>

          <button onClick={fetchDashboardData}>Try Again</button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="card dashboard-card">
        <h1>Event Dashboard</h1>

        <p className="subtitle">Overview of event attendance.</p>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>{stats.total_participants}</h2>
            <p>Total Participants</p>
          </div>

          <div className="stat-card">
            <h2>{stats.checked_in}</h2>
            <p>Checked In</p>
          </div>

          <div className="stat-card">
            <h2>{stats.not_checked_in}</h2>
            <p>Remaining</p>
          </div>
        </div>

        {/* Attendance */}
        <div className="attendance">
          <h2>Attendance: {stats.attendance_percentage}%</h2>

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${stats.attendance_percentage}%`,
              }}
            />
          </div>
        </div>

        {/* Participants */}
        <div className="participants-section">
          <h2>Participants</h2>

          {participants.length === 0 ? (
            <p>No participants registered yet.</p>
          ) : (
            <div className="table-container">
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td>{participant.name}</td>

                      <td>{participant.roll_number}</td>

                      <td>{participant.email}</td>

                      <td>
                        {participant.checked_in ? (
                          <span className="status checked">✓ Checked In</span>
                        ) : (
                          <span className="status pending">— Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
