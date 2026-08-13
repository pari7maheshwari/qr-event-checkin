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
      const response = await apiFetch("/api/checkin/", {
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
      setError(error.message);
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
    <main className="app">
      <section className="card scanner-card">
        <h1>Event Check-In</h1>

        <p className="subtitle">Scan the participant's QR code.</p>

        <QRScanner onScan={handleScan} onError={handleScannerError} />

        {processing && <p className="processing">Processing check-in...</p>}

        {result && (
          <div className="success">
            <h2>✅ Check-In Successful</h2>

            <p>
              Welcome, <strong>{result.participant.name}</strong>!
            </p>

            <p>
              Roll Number: <strong>{result.participant.roll_number}</strong>
            </p>
          </div>
        )}

        {error && (
          <div className="error">
            <h2>⚠️ Check-In Failed</h2>
            <p>{error}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminCheckIn;
