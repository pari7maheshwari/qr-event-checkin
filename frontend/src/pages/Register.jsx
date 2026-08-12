import { useState } from "react";
import "../App.css";

const API_URL = "http://127.0.0.1:8000";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    roll_number: "",
    email: "",
  });

  const [participant, setParticipant] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
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

    setLoading(true);
    setError("");
    setParticipant(null);
    setQrUrl("");

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
        throw new Error(data.detail || "Failed to register participant.");
      }

      setParticipant(data);

      const qrResponse = await fetch(
        `${API_URL}/api/participants/${data.id}/qr`,
      );

      if (!qrResponse.ok) {
        throw new Error("Participant registered, but QR generation failed.");
      }

      const qrBlob = await qrResponse.blob();
      const qrImageUrl = URL.createObjectURL(qrBlob);

      setQrUrl(qrImageUrl);

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
        <h1>Participant Registration</h1>

        <p className="subtitle">
          Register a participant and generate their QR code.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter participant name"
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
              placeholder="Enter roll number"
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
              placeholder="Enter email address"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Participant"}
          </button>
        </form>

        {error && (
          <div className="error">
            <h2>Registration Failed</h2>
            <p>{error}</p>
          </div>
        )}

        {participant && qrUrl && (
          <div className="success">
            <h2>Registration Successful!</h2>

            <p>
              <strong>{participant.name}</strong> has been registered.
            </p>

            <p>
              Roll Number: <strong>{participant.roll_number}</strong>
            </p>

            <p className="instruction">Give this QR code to the participant.</p>

            <img src={qrUrl} alt="Participant QR Code" className="qr-code" />

            <a
              href={qrUrl}
              download={`${participant.roll_number}-qr.png`}
              className="download-button"
            >
              Download QR Code
            </a>
          </div>
        )}
      </section>
    </main>
  );
}

export default Register;
