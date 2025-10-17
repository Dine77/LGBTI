// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";

// ✅ Define your API base URL properly
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "https://lgbti-api-ipsos.nnet-dataviz.com";
// "http://localhost:5000";

// ✅ Optional but good: add default headers
axios.defaults.headers.common["Content-Type"] = "application/json";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
