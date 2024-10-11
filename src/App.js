import React, { useState } from "react";
import QRCode from "qrcode";
import BeatLoader from "react-spinners/BeatLoader";
import { FaShareAlt } from "react-icons/fa";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidURL = (string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(string);
  };

  const handleGenerateQR = async () => {
    if (!isValidURL(url)) {
      setErrorMessage("Please enter a valid URL");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        setErrorMessage("");
        const generatedQR = await QRCode.toDataURL(url, {
          width: 600,
          height: 600,
        });
        setQrCode(generatedQR);
      } catch (error) {
        setErrorMessage("Error generating QR code");
      }
      setLoading(false);
    }, 1000);
  };

  const handleShare = async () => {
    if (!qrCode) {
      alert("Please generate a QR code before sharing.");
      return;
    }

    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const file = new File([blob], "qr-code.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "QR Code",
          text: "Check out this QR Code!",
        });
        console.log("Share successful");
      } else {
        console.error("Sharing is not supported in your browser or by the system.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1
        style={{
          fontFamily: "Courier, monospace",
          fontSize: "36px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Generate your own QR
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Paste your URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleGenerateQR}
          style={{
            cursor: "pointer",
            width: "101px",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          Generate QR
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading ? (
          <BeatLoader color="#36d7b7" loading={loading} size={15} />
        ) : (
          qrCode && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Courier, monospace",
                  marginBottom: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginRight: "20px",
                }}
              >
                Your QR Code:
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{
                    marginRight: "10px",
                    width: "150px",
                    height: "150px",
                  }}
                />
                <FaShareAlt
                  onClick={handleShare}
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#36d7b7",
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>

      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}

      <footer
        style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
          textAlign: "center",
          padding: "10px 0",
          backgroundColor: "#f1f1f1",
          fontFamily: "Courier, monospace",
        }}
      >
        <a
          href="https://instagram.com/hacker.__.sheela" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily:"monospace",
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          @HackerSheela💃
        </a>
      </footer>
    </div>
  );
}

export default App;
