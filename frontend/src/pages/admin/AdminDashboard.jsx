import { useEffect, useState } from "react";
import { getToken } from "../../utils/auth";
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
      console.error("Dashboard error:", error);

      setError(
        error.message === "Failed to fetch"
          ? "Unable to connect to the server."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="admin-page">
        <section className="admin-dashboard-loading">
          <div className="loading-spinner"></div>

          <h2>Loading dashboard</h2>

          <p>Fetching the latest event data...</p>
        </section>
      </main>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <main className="admin-page">
        <section className="admin-dashboard-error">
          <div className="error-icon">!</div>

          <p className="admin-eyebrow">DASHBOARD ERROR</p>

          <h1>Unable to load dashboard</h1>

          <p>{error}</p>

          <button
            className="admin-primary-button"
            onClick={fetchDashboardData}
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-dashboard">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="dashboard-header">
          <div>
            <p className="admin-eyebrow">EVENT MANAGEMENT</p>

            <h1>Event Dashboard</h1>

            <p className="dashboard-description">
              Monitor registrations and attendance in real time.
            </p>
          </div>

          <div className="event-status">
            <span className="status-dot"></span>

            <div>
              <strong>Event Active</strong>
              <span>Live attendance tracking</span>
            </div>
          </div>
        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="admin-stats-grid">
          <div className="admin-stat-card participants-stat">
            <div className="stat-icon">👥</div>

            <div className="stat-content">
              <span>Total Participants</span>

              <strong>{stats.total_participants}</strong>

              <small>Registered for the event</small>
            </div>
          </div>

          <div className="admin-stat-card checked-stat">
            <div className="stat-icon">✓</div>

            <div className="stat-content">
              <span>Checked In</span>

              <strong>{stats.checked_in}</strong>

              <small>Successfully entered</small>
            </div>
          </div>

          <div className="admin-stat-card remaining-stat">
            <div className="stat-icon">⌛</div>

            <div className="stat-content">
              <span>Remaining</span>

              <strong>{stats.not_checked_in}</strong>

              <small>Yet to check in</small>
            </div>
          </div>
        </div>

        {/* =================================================
            ATTENDANCE
        ================================================= */}

        <section className="attendance-card">
          <div className="attendance-header">
            <div>
              <p className="admin-eyebrow">ATTENDANCE</p>

              <h2>Event attendance</h2>
            </div>

            <strong className="attendance-percentage">
              {stats.attendance_percentage}%
            </strong>
          </div>

          <div className="attendance-progress">
            <div
              className="attendance-progress-fill"
              style={{
                width: `${stats.attendance_percentage}%`,
              }}
            ></div>
          </div>

          <div className="attendance-footer">
            <span>
              <strong>{stats.checked_in}</strong> people checked in
            </span>

            <span>
              <strong>{stats.not_checked_in}</strong> remaining
            </span>
          </div>
        </section>

        {/* =================================================
            PARTICIPANTS
        ================================================= */}

        <section className="participants-panel">
          <div className="participants-header">
            <div>
              <p className="admin-eyebrow">REGISTRATION LIST</p>

              <h2>Participants</h2>
            </div>

            <span className="participant-count">
              {stats.total_participants} registered
            </span>
          </div>

          {participants.length === 0 ? (
            <div className="empty-participants">
              <div className="empty-icon">👥</div>

              <h3>No participants yet</h3>

              <p>
                Participants will appear here after they register for
                the event.
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-participants-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Roll Number</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td>
                        <div className="participant-name">
                          <span className="participant-avatar">
                            {participant.name
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <strong>{participant.name}</strong>
                        </div>
                      </td>

                      <td>
                        <span className="roll-number">
                          {participant.roll_number}
                        </span>
                      </td>

                      <td>
                        <span className="participant-email">
                          {participant.email}
                        </span>
                      </td>

                      <td>
                        {participant.checked_in ? (
                          <span className="admin-status checked">
                            <span>✓</span>
                            Checked In
                          </span>
                        ) : (
                          <span className="admin-status pending">
                            <span>—</span>
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;