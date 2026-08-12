import { Scanner } from "@yudiel/react-qr-scanner";

function QRScanner({ onScan, onError }) {
  return (
    <div className="scanner-container">
      <Scanner
        onScan={onScan}
        onError={onError}
        constraints={{
          facingMode: "environment",
        }}
      />
    </div>
  );
}

export default QRScanner;