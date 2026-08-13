import { useState } from "react";
import QRScanner from "../../components/QRScanner";
import "../../App.css";
import { getToken } from "../../utils/auth";

const API_URL = "http://127.0.0.1:8000";

function AdminCheckIn() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  async function handleScan(detectedCodes) {
    if (!detectedCodes || detectedCodes.length === 0) {
      return;
    }

    if (processing) {
      return;
    }

    const qrToken = detectedCodes[0]?.rawValue;

    if (!qrToken) {
      return;
    }

    setProcessing(true);
    setError("");
    setResult(null);

    const token = getToken();

    if (!token) {
      setError("You are not logged in.");
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/checkin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          qr_token: qrToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Check-in failed.");
      }

      setResult(data);
    } catch (error) {
      console.error("Check-in error:", error);

      setError(
        error.message === "Failed to fetch"
          ? "Unable to connect to the check-in server."
          : error.message,
      );
    } finally {
      setTimeout(() => {
        setProcessing(false);
      }, 2000);
    }
  }

  function handleScannerError(error) {
    console.error("Scanner error:", error);
  }

  return (
    <main className="checkin-page">
      <section className="checkin-shell">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="checkin-header">
          <div>
            <p className="admin-eyebrow">EVENT ENTRY</p>

            <h1>Check-In Station</h1>

            <p>
              Scan a participant's QR pass to verify their registration
              and record attendance.
            </p>
          </div>

          <div className="scanner-live-status">
            <span></span>
            Scanner Ready
          </div>
        </div>

        {/* =================================================
            SCANNER
        ================================================= */}

        <div className="scanner-section">
          <div className="scanner-title">
            <div className="scanner-number">01</div>

            <div>
              <h2>Scan QR Pass</h2>

              <p>
                Position the participant's QR code inside the scanner.
              </p>
            </div>
          </div>

          <div className="scanner-frame">
            <QRScanner
              onScan={handleScan}
              onError={handleScannerError}
            />

            {!processing && !result && !error && (
              <div className="scanner-overlay">
                <div className="scan-corners">
                  <span className="corner top-left"></span>
                  <span className="corner top-right"></span>
                  <span className="corner bottom-left"></span>
                  <span className="corner bottom-right"></span>
                </div>
              </div>
            )}
          </div>

          <div className="scanner-hint">
            <span className="hint-icon">⌁</span>

            <span>
              Make sure the entire QR code is visible and well lit.
            </span>
          </div>
        </div>

        {/* =================================================
            PROCESSING
        ================================================= */}

        {processing && (
          <div className="checkin-processing">
            <div className="processing-spinner"></div>

            <div>
              <strong>Verifying QR pass...</strong>

              <span>Checking participant registration</span>
            </div>
          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {result && (
          <div className="checkin-result success-result">
            <div className="result-icon">✓</div>

            <div className="result-content">
              <p className="result-eyebrow">CHECK-IN CONFIRMED</p>

              <h2>Welcome to the event!</h2>

              <p className="result-message">
                Participant successfully verified and checked in.
              </p>

              <div className="participant-result-card">
                <div className="result-avatar">
                  {result.participant.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>{result.participant.name}</strong>

                  <span>
                    Roll Number:{" "}
                    {result.participant.roll_number}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="checkin-result error-result">
            <div className="result-icon">!</div>

            <div className="result-content">
              <p className="result-eyebrow">CHECK-IN UNSUCCESSFUL</p>

              <h2>Unable to verify pass</h2>

              <p className="result-message">{error}</p>

              <div className="retry-message">
                Please ask the participant to present a valid QR
                pass and try again.
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="checkin-footer">
          <span>
            <span className="footer-dot"></span>
            Attendance system online
          </span>

          <span>Secure QR verification</span>
        </div>
      </section>
    </main>
  );
}

export default AdminCheckIn;