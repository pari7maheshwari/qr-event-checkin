import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    roll_number: "",
    email: "",
  });

  const [participant, setParticipant] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setParticipant(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/participants/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      setParticipant(data);

      setFormData({
        name: "",
        roll_number: "",
        email: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="card">
        <h1>QR Event Check-In</h1>
        <p className="subtitle">
          Register for the event and receive your unique QR code.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </label>

          <label>
            Roll Number
            <input
              type="text"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleChange}
              placeholder="Enter your roll number"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {participant && (
          <section className="success">
            <h2>Registration Successful 🎉</h2>

            <p>
              <strong>{participant.name}</strong> has been registered.
            </p>

            <img
              src={`${API_URL}/api/participants/${participant.id}/qr`}
              alt="Participant QR code"
              className="qr-code"
            />

            <p className="instruction">
              Show this QR code at the event entrance.
            </p>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;