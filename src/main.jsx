import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppContextt } from "./context/AppContextt";
import AuthProvider from "./Context/Authcontext";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppContextt>
          <App />
          <ToastContainer position="top-right" autoClose={2000} />
        </AppContextt>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
