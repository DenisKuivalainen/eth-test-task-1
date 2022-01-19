import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Minting from "./Minting";
import Swap from "./Swap";

ReactDOM.render(
  <React.StrictMode>
    <div style={{ height: "40vh" }}>
      <Minting />
    </div>
    <Swap />
  </React.StrictMode>,
  document.getElementById("root")
);
