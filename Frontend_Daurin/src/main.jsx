import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.jsx";
import "@fontsource/poppins/300.css"; // light
import "@fontsource/poppins/400.css"; // regular
import "@fontsource/poppins/600.css"; // semi-bold
import "@fontsource/poppins/700.css"; // bold
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Register from "./auth/Register.jsx";
import Login from "./auth/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RecyAssistant from "./Landing/RecyAssistant.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recy" element={<RecyAssistant />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
