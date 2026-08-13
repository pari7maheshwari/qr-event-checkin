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

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");
    setParticipant(null);

    if (qrUrl) {
      URL.revokeObjectURL(qrUrl);
      setQrUrl("");
    }

    try {
      // --------------------------------------------------
      // STEP 1: Register participant
      // --------------------------------------------------

      const response = await fetch(`${API_URL}/api/participants/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to register participant.",
        );
      }

      setParticipant(data);

      // --------------------------------------------------
      // STEP 2: Generate QR code
      // --------------------------------------------------

      const qrResponse = await fetch(
        `${API_URL}/api/participants/${data.id}/qr`,
      );

      if (!qrResponse.ok) {
        let qrError = null;

        try {
          qrError = await qrResponse.json();
        } catch {
          // Response wasn't JSON
        }

        throw new Error(
          qrError?.detail ||
            "Participant registered, but QR generation failed.",
        );
      }

      // --------------------------------------------------
      // STEP 3: Convert QR response to image
      // --------------------------------------------------

      const qrBlob = await qrResponse.blob();

      if (!qrBlob || qrBlob.size === 0) {
        throw new Error("QR code was generated but the image is empty.");
      }

      const qrImageUrl = URL.createObjectURL(qrBlob);

      setQrUrl(qrImageUrl);

      // Clear form after successful registration
      setFormData({
        name: "",
        roll_number: "",
        email: "",
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.message === "Failed to fetch") {
        setError(
          "Unable to connect to the server. Please make sure the backend is running.",
        );
      } else {
        setError(error.message);
      }
    } finally {
      // VERY IMPORTANT:
      // Always stop the loading state.
      setLoading(false);
    }
  }

  return (
    <main className="registration-page">
      <section className="registration-shell">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="registration-intro">
          <div className="brand-mark">EP</div>

          <p className="eyebrow">EVENTPASS</p>

          <h1>
            Your event
            <span> starts here.</span>
          </h1>

          <p className="intro-text">
            Register once, get your personal QR pass, and enjoy
            a seamless check-in experience.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <span>✓</span>

              <div>
                <strong>Instant QR Pass</strong>

                <p>
                  Get your unique pass immediately after registration.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <span>✓</span>

              <div>
                <strong>Fast Check-In</strong>

                <p>
                  Scan your QR code at the event entrance.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <span>✓</span>

              <div>
                <strong>Secure Attendance</strong>

                <p>
                  Your QR pass is uniquely generated for you.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="registration-card">

          {!participant || !qrUrl ? (
            <>
              <div className="form-heading">

                <p className="eyebrow">
                  GET YOUR PASS
                </p>

                <h2>
                  Join the event
                </h2>

                <p>
                  Enter your details below to create your event pass.
                </p>

              </div>

              <form onSubmit={handleSubmit}>

                {/* NAME */}

                <label>
                  Full Name

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="name"
                    required
                  />
                </label>

                {/* ROLL NUMBER */}

                <label>
                  Roll Number

                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    placeholder="e.g. 23CSE1042"
                    required
                  />
                </label>

                {/* EMAIL */}

                <label>
                  College Email

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@college.edu"
                    autoComplete="email"
                    required
                  />
                </label>

                {/* ERROR */}

                {error && (
                  <div className="registration-error">
                    <strong>
                      Registration failed
                    </strong>

                    <p>
                      {error}
                    </p>
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="primary-action"
                  disabled={loading}
                >
                  {loading
                    ? "Creating your pass..."
                    : "Register & Generate QR Pass →"}
                </button>

              </form>

              <p className="privacy-note">
                Your information is used only for event
                registration and attendance.
              </p>
            </>
          ) : (

            /* =================================================
               QR SUCCESS SCREEN
            ================================================= */

            <div className="qr-success">

              <div className="success-icon">
                ✓
              </div>

              <p className="eyebrow">
                REGISTRATION COMPLETE
              </p>

              <h2>
                You're all set!
              </h2>

              <p className="success-description">
                Welcome,{" "}
                <strong>
                  {participant.name}
                </strong>
                . Your event pass is ready.
              </p>

              <div className="qr-pass">

                <p>
                  YOUR QR PASS
                </p>

                <img
                  src={qrUrl}
                  alt="Participant QR Code"
                  className="qr-code"
                />

                <span>
                  {participant.roll_number}
                </span>

              </div>

              <p className="scan-instruction">
                Show this QR code at the entrance for
                a quick check-in.
              </p>

              <a
                href={qrUrl}
                download={`${participant.roll_number}-qr.png`}
                className="download-button"
              >
                Download QR Pass
              </a>

            </div>
          )}

        </div>
      </section>
    </main>
  );
}

export default Register;