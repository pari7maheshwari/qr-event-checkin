import { useEffect, useState } from "react";
import "../../App.css";

const API_URL = "http://127.0.0.1:8000";

function AdminParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchParticipants() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/participants/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load participants."
        );
      }

      setParticipants(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <main className="app">
      <section className="card dashboard-card">
        <h1>Participants</h1>

        <p className="subtitle">
          View all registered event participants.
        </p>

        {loading && <p>Loading participants...</p>}

        {error && (
          <div className="error">
            <h2>Failed to Load Participants</h2>
            <p>{error}</p>

            <button onClick={fetchParticipants}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
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
                            <span className="status checked">
                              ✓ Checked In
                            </span>
                          ) : (
                            <span className="status pending">
                              — Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default AdminParticipants;