import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialState = {
  username: "",
  email: "",
  password: "",
  identifier: "",
};

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login({
          email: form.identifier.includes("@") ? form.identifier : undefined,
          username: form.identifier.includes("@") ? undefined : form.identifier,
          password: form.password,
        });
      } else {
        await register({
          username: form.username,
          email: form.email,
          password: form.password,
        });
      }

      navigate("/chat", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to authenticate");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-6">
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[0.6fr_0.4fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Welcome back
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            {mode === "login"
              ? "Connect with your team and keep every conversation moving."
              : "Set up your credentials to start collaborating instantly."}
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "login" ? (
              <label className="block text-sm text-slate-200">
                Email or username
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>
            ) : (
              <>
                <label className="block text-sm text-slate-200">
                  Username
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="stormy"
                    required
                  />
                </label>
                <label className="block text-sm text-slate-200">
                  Email
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </>
            )}
            <label className="block text-sm text-slate-200">
              Password
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
              />
            </label>
            {error && (
              <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs text-rose-200">
                {error}
              </p>
            )}
            <button
              className="w-full rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Working..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Start here
          </p>
          <h3 className="text-lg font-semibold text-white">
            {mode === "login" ? "New to Chatapp?" : "Already have access?"}
          </h3>
          <p>
            {mode === "login"
              ? "Spin up a profile to save your workspace and sync messages."
              : "Sign in and pick up right where your team left off."}
          </p>
          <button
            className="w-full rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:border-white/60"
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
          >
            {mode === "login" ? "Create account" : "Back to sign in"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
