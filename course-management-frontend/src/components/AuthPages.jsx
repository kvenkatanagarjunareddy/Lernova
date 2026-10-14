
import { useState } from "react";
import api from "../api";
import "./AuthPages.css";

export default function AuthPages({ onAuthenticated }) {
  const [portal, setPortal] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isAdmin = portal === "ADMIN";

  function choosePortal(selectedPortal) {
    setPortal(selectedPortal);
    setIsRegister(false);
    setForm({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  }

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister && !form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await api.post("/api/auth/register", {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        setIsRegister(false);
        setForm({ ...form, password: "" });
        setSuccess("Account created successfully! Please sign in.");
        return;
      }

      const response = await api.post("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const data = response.data;
      const role = String(data.role || "").toUpperCase();

      // A student must not enter the Admin Portal, and vice versa.
      if (role !== portal) {
        setError(
          isAdmin
            ? "Access denied. This account does not have Admin privileges."
            : "This portal is for students. Please use the correct account."
        );
        return;
      }

      const token = data.token || data.accessToken || data.jwt;

      if (!token) {
        setError("Login succeeded but no authentication token was returned.");
        return;
      }

      const authenticatedUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(authenticatedUser));

      onAuthenticated(authenticatedUser);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setError("Incorrect email or password.");
      } else if (status === 403) {
        setError("You do not have permission to access this portal.");
      } else if (!err.response) {
        setError(
          "Cannot connect to the server. Check that Spring Boot is running on port 8090."
        );
      } else {
        setError(
          err.response?.data?.message ||
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (!portal) {
    return (
      <main className="auth-selection">
        <div className="selection-glow selection-glow-one" />
        <div className="selection-glow selection-glow-two" />

        <header className="auth-brand">
          <span className="brand-mark">C</span>
          <span>CourseFlow</span>
        </header>

        <section className="selection-content">
          <span className="eyebrow">YOUR LEARNING JOURNEY STARTS HERE</span>
          <h1>
            One platform.
            <br />
            <span>Endless possibilities.</span>
          </h1>
          <p className="selection-description">
            A smarter way to manage courses, discover learning opportunities,
            and keep everything organized.
          </p>

          <div className="portal-options">
            <button
              className="portal-card student-portal-card"
              onClick={() => choosePortal("STUDENT")}
            >
              <span className="portal-icon">✦</span>
              <span className="portal-card-title">Student Portal</span>
              <span className="portal-card-description">
                Explore courses and manage your enrollments.
              </span>
              <span className="portal-arrow">Continue →</span>
            </button>

            <button
              className="portal-card admin-portal-card"
              onClick={() => choosePortal("ADMIN")}
            >
              <span className="portal-icon">⌘</span>
              <span className="portal-card-title">Admin Portal</span>
              <span className="portal-card-description">
                Manage courses and monitor platform activity.
              </span>
              <span className="portal-arrow">Administrator login →</span>
            </button>
          </div>

          <p className="selection-footer">
            Built for better learning management.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={`auth-page ${isAdmin ? "admin-auth" : "student-auth"}`}>
      <section className="auth-visual">
        <button
          className="auth-back"
          type="button"
          onClick={() => choosePortal("")}
        >
          ← Change portal
        </button>

        <div className="visual-orb orb-one" />
        <div className="visual-orb orb-two" />
        <div className="visual-orb orb-three" />

        <div className="visual-content">
          <span className="visual-kicker">
            {isAdmin ? "SECURE ADMINISTRATION" : "LEARN WITHOUT LIMITS"}
          </span>

          <h1>
            {isAdmin ? (
              <>
                Control your
                <br />
                <span>learning universe.</span>
              </>
            ) : (
              <>
                Learn new skills.
                <br />
                <span>Build your future.</span>
              </>
            )}
          </h1>

          <p>
            {isAdmin
              ? "Manage courses, monitor enrollments, and keep your learning platform running smoothly."
              : "Discover courses, track your learning journey, and take the next step toward your goals."}
          </p>

          <div className="visual-features">
            <div>✓ Organized course management</div>
            <div>
              ✓ {isAdmin
                ? "Role-based administrative access"
                : "Personalized student experience"}
            </div>
            <div>✓ One simple, connected platform</div>
          </div>
        </div>

        <div className="visual-footer">
          <span className="brand-mark">C</span>
          <span>CourseFlow</span>
          <span className="footer-divider">•</span>
          <span>{isAdmin ? "Admin Portal" : "Student Portal"}</span>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-card">
          <div className="mobile-brand">
            <span className="brand-mark">C</span>
            <span>CourseFlow</span>
          </div>

          <div className="auth-heading">
            <span className="auth-badge">
              <span className="status-dot" />
              {isAdmin ? "ADMINISTRATOR ACCESS" : "STUDENT ACCOUNT"}
            </span>

            <h2>
              {isRegister
                ? "Create your account"
                : isAdmin
                  ? "Welcome, Admin"
                  : "Welcome back"}
            </h2>

            <p>
              {isRegister
                ? "Create your student account to get started."
                : isAdmin
                  ? "Sign in to access your administration dashboard."
                  : "Sign in to continue your learning journey."}
            </p>
          </div>

          {error && (
            <div className="auth-alert auth-error" role="alert">
              <span>!</span>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-alert auth-success" role="status">
              <span>✓</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && !isAdmin && (
              <label className="auth-field">
                <span>Full name</span>
                <div className="auth-input-wrap">
                  <span className="input-symbol">♙</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={changeField}
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </div>
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input-wrap">
                <span className="input-symbol">@</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={changeField}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap">
                <span className="input-symbol">▣</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={changeField}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  required
                />
              </div>
              {isRegister && (
                <small className="field-hint">
                  Use at least 8 characters.
                </small>
              )}
            </label>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Please wait...
                </>
              ) : (
                <>
                  {isRegister
                    ? "Create student account"
                    : isAdmin
                      ? "Access secure dashboard"
                      : "Sign in to CourseFlow"}
                  <span className="submit-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {!isAdmin && (
            <div className="auth-switch">
              {isRegister
                ? "Already have an account?"
                : "New to CourseFlow?"}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setSuccess("");
                  setForm({ ...form, password: "" });
                }}
              >
                {isRegister ? "Sign in" : "Create account"}
              </button>
            </div>
          )}

          <p className="auth-security-note">
            <span>▣</span>
            Secure access protected by CourseFlow authentication
          </p>
        </div>
      </section>
    </main>
  );
}
