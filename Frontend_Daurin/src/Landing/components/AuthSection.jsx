import React from "react";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import Section from "./Section";

const AuthSection = ({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authMessage,
  handleLogin,
  handleRegister,
}) => {
  const onSubmit = authMode === "login" ? handleLogin : handleRegister;

  return (
    <Section
      eyebrow="Akun"
      title="Autentikasi"
      action={
        <div className="flex gap-2">
          <button
            onClick={() => setAuthMode("login")}
            className={`px-3 py-1 rounded-full text-sm border ${
              authMode === "login"
                ? "bg-emerald-500 text-slate-900 border-emerald-400"
                : "border-emerald-500/40 text-emerald-200"
            }`}
          >
            <FiLogIn className="inline mr-1" />
            Login
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className={`px-3 py-1 rounded-full text-sm border ${
              authMode === "register"
                ? "bg-emerald-500 text-slate-900 border-emerald-400"
                : "border-emerald-500/40 text-emerald-200"
            }`}
          >
            <FiUserPlus className="inline mr-1" />
            Register
          </button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {authMode === "register" && (
          <input
            required
            type="text"
            placeholder="Username"
            className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-400 outline-none"
            value={authForm.username}
            onChange={(e) =>
              setAuthForm((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
        )}
        <input
          required
          type="email"
          placeholder="Email"
          className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-400 outline-none"
          value={authForm.email}
          onChange={(e) =>
            setAuthForm((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          required
          type="password"
          placeholder="Password"
          className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-400 outline-none"
          value={authForm.password}
          onChange={(e) =>
            setAuthForm((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
        />
        <button
          type="submit"
          className="md:col-span-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg py-2 flex items-center justify-center gap-2 transition"
        >
          {authMode === "login" ? <FiLogIn /> : <FiUserPlus />}
          {authMode === "login" ? "Login" : "Buat akun"}
        </button>
      </form>
      {authMessage && <p className="text-sm text-emerald-200">{authMessage}</p>}
    </Section>
  );
};

export default AuthSection;
