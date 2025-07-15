import React from "react";
import { QRCodeSVG } from "qrcode.react";
import "./App.css";

function App() {
  return (
    <div className="page">
      <div className="logo-container">
        <img src="/logo.png" alt="logo" />
      </div>
      <div className="container">
        <h1>Visiting Card</h1>
          <div className="output">
            <div className="preview">
              <QRCodeSVG value={"https://visiting-card.risingstoneinfra.com/"} size={200} />
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;
