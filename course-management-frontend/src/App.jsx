import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

const emptyCourse = {
  courseName: "",
  description: "",
  durationWeeks: 12,
  fee: 0,
  status: "ACTIVE",
  capacity: 30,
};

const AUTH_STYLES = `
.cf-auth, .cf-auth * { box-sizing: border-box; }
.cf-auth {
  --purple: #6057CC;
  --purple-dark: #5146B8;
  --teal: #62B8B2;
  font-family: "Manrope", "DM Sans", Arial, sans-serif;
  min-height: 100vh;
  color: #252440;
  background: #f7f7fc;
}
.cf-auth button, .cf-auth input { font: inherit; }
.cf-auth button { cursor: pointer; }
.cf-auth-selection {
  min-height: 100vh;
  padding: 30px clamp(20px, 6vw, 85px);
  color: white;
  background:
    radial-gradient(ellipse at 12% 15%, #6057cc77, transparent 38%),
    radial-gradient(ellipse at 90% 85%, #277b8844, transparent 35%),
    linear-gradient(135deg, #181735, #20233b 65%, #302b63);
}
.cf-auth-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
}
.cf-brand-mark {
  display: inline-grid;
  place-items: center;
  width: 41px;
  height: 41px;
  flex-shrink: 0;
  border-radius: 13px;
  color: white;
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #8276f1, #5146b8);
  box-shadow: 0 8px 24px #6057cc55;
}
.cf-selection-content {
  max-width: 960px;
  margin: 75px auto 30px;
}
.cf-eyebrow {
  color: #aaa4ff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}
.cf-selection-content h1 {
  margin: 18px 0;
  font-size: clamp(38px, 6vw, 64px);
  line-height: 1.12;
  letter-spacing: -2px;
}
.cf-selection-content h1 span { color: #aaa4ff; }
.cf-selection-description {
  max-width: 590px;
  color: #c6c4df;
  font-size: 15px;
  line-height: 1.8;
}
.cf-portals {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 34px;
}
.cf-portal-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 220px;
  padding: 25px;
  border: 1px solid #ffffff30;
  border-radius: 22px;
  color: white;
  text-align: left;
  background: #ffffff10;
  backdrop-filter: blur(14px);
  transition: transform .3s ease, background .3s ease, box-shadow .3s ease;
}
.cf-portal-card:hover {
  transform: translateY(-6px);
  background: #ffffff1c;
  box-shadow: 0 20px 45px #0003;
}
.cf-portal-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 18px;
  border-radius: 14px;
  font-size: 23px;
  background: linear-gradient(135deg, #8276f1, #5146b8);
}
.cf-admin-portal .cf-portal-icon {
  background: linear-gradient(135deg, #277b88, #62b8b2);
}
.cf-portal-title { font-size: 20px; font-weight: 800; }
.cf-portal-description {
  margin-top: 9px;
  color: #c6c4df;
  font-size: 13px;
  line-height: 1.7;
}
.cf-portal-arrow {
  margin-top: 20px;
  color: #b7b0ff;
  font-size: 13px;
  font-weight: 800;
}
.cf-admin-portal .cf-portal-arrow { color: #82d9d1; }

.cf-auth-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(400px, .9fr);
  min-height: 100vh;
}
.cf-auth-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: 30px clamp(24px, 5vw, 70px);
  overflow: hidden;
  color: white;
  background:
    radial-gradient(ellipse at 18% 15%, #8276f155, transparent 40%),
    linear-gradient(145deg, #242451, #39316f 55%, #594bb5);
}
.cf-admin-auth .cf-auth-visual {
  background:
    radial-gradient(ellipse at 15% 15%, #6057cc66, transparent 40%),
    radial-gradient(ellipse at 90% 80%, #277b8844, transparent 40%),
    linear-gradient(145deg, #14132b, #20233b);
}
.cf-back-button {
  position: relative;
  z-index: 2;
  align-self: flex-start;
  padding: 10px 14px;
  border: 1px solid #ffffff38;
  border-radius: 10px;
  color: white;
  background: #ffffff12;
  font-size: 12px !important;
  font-weight: 700 !important;
}
.cf-back-button:hover { background: #ffffff25; }
.cf-visual-content {
  position: relative;
  z-index: 1;
  max-width: 580px;
  margin: auto 0;
  padding: 55px 0;
  animation: cf-enter .45s ease both;
}
.cf-visual-content h1 {
  margin: 20px 0;
  font-size: clamp(36px, 4vw, 57px);
  line-height: 1.15;
  letter-spacing: -2px;
}
.cf-visual-content h1 span { color: #b7b0ff; }
.cf-admin-auth .cf-visual-content h1 span { color: #62b8b2; }
.cf-visual-content p {
  max-width: 460px;
  color: #ffffffc7;
  font-size: 14px;
  line-height: 1.9;
}
.cf-visual-features {
  display: grid;
  gap: 15px;
  margin-top: 28px;
  font-size: 13px;
}
.cf-visual-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 13px;
  font-weight: 800;
}
.cf-orb {
  position: absolute;
  width: 120px;
  height: 120px;
  border: 1px solid #ffffff38;
  border-radius: 50%;
  background: #ffffff0d;
  animation: cf-float 7s ease-in-out infinite;
  pointer-events: none;
}
.cf-orb-one { top: 15%; right: 12%; }
.cf-orb-two {
  right: -45px;
  bottom: 15%;
  width: 175px;
  height: 175px;
  animation-delay: -3s;
}
.cf-auth-form-side {
  display: grid;
  place-items: center;
  min-width: 0;
  padding: 30px clamp(18px, 5vw, 65px);
  background:
    radial-gradient(ellipse at 90% 0%, #6057cc12, transparent 38%),
    #f7f7fc;
}
.cf-auth-card {
  width: 100%;
  max-width: 440px;
  padding: clamp(23px, 3vw, 38px);
  border: 1px solid #ffffffd9;
  border-radius: 24px;
  background: #ffffffc9;
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 65px #23205615;
  animation: cf-enter .45s ease both;
}
.cf-mobile-brand {
  display: none;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
  font-size: 19px;
  font-weight: 800;
}
.cf-auth-badge {
  display: inline-block;
  padding: 8px 11px;
  border-radius: 8px;
  color: #5146b8;
  background: #f0efff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}
.cf-admin-auth .cf-auth-badge {
  color: #236b77;
  background: #e4f6f4;
}
.cf-auth-card h2 {
  margin: 23px 0 9px;
  color: #252440;
  font-size: clamp(27px, 3vw, 34px);
  letter-spacing: -1px;
}
.cf-auth-subtitle {
  margin: 0;
  color: #77788f;
  font-size: 13px;
  line-height: 1.8;
}
.cf-auth-fields {
  display: grid;
  gap: 19px;
  margin-top: 28px;
}
.cf-auth-field {
  display: grid;
  gap: 9px;
  color: #393850;
  font-size: 12px;
  font-weight: 800;
}
.cf-auth-field input {
  width: 100%;
  min-width: 0;
  padding: 15px;
  border: 1px solid #e1e2ed;
  border-radius: 11px;
  outline: none;
  color: #28263f;
  font-size: 13px;
  background: #ffffffeb;
  transition: border-color .25s ease, box-shadow .25s ease;
}
.cf-auth-field input:focus {
  border-color: #7065cf;
  box-shadow: 0 0 0 4px #6057cc1c;
}
.cf-admin-auth .cf-auth-field input:focus {
  border-color: #277b88;
  box-shadow: 0 0 0 4px #277b881c;
}
.cf-field-hint {
  color: #85859b;
  font-size: 11px;
  font-weight: 500;
}
.cf-auth-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 13px 17px;
  border: 0;
  border-radius: 11px;
  color: white;
  font-size: 13px !important;
  font-weight: 800 !important;
  background: linear-gradient(115deg, #6057cc, #5146b8);
  box-shadow: 0 9px 20px #6057cc35;
  transition: transform .3s ease, box-shadow .3s ease;
}
.cf-admin-auth .cf-auth-submit {
  background: linear-gradient(115deg, #5146b8, #277b88);
}
.cf-auth-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 13px 27px #6057cc45;
}
.cf-auth-submit:disabled { opacity: .7; cursor: wait; }
.cf-auth-alert {
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
.cf-auth-error {
  color: #a82e38;
  border: 1px solid #f4d1d4;
  background: #fff0f2;
}
.cf-auth-success {
  color: #176640;
  border: 1px solid #c7ebd5;
  background: #e9f8ef;
}
.cf-auth-switch {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
  color: #77788f;
  font-size: 12px;
}
.cf-auth-switch button {
  padding: 0;
  border: 0;
  color: #5146b8;
  font-size: 12px !important;
  font-weight: 800 !important;
  background: transparent;
}
.cf-auth-switch button:hover { text-decoration: underline; }
.cf-auth-security {
  margin: 27px 0 0;
  color: #9393a7;
  font-size: 10px;
  text-align: center;
}
@keyframes cf-enter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes cf-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
@media (max-width: 850px) {
  .cf-auth-page {
    grid-template-columns: minmax(0, .85fr) minmax(360px, 1fr);
  }
  .cf-auth-visual { padding: 25px; }
  .cf-visual-content h1 { font-size: 38px; }
  .cf-auth-form-side { padding: 22px 17px; }
  .cf-auth-card { padding: 24px 20px; }
}
@media (max-width: 700px) {
  .cf-auth-page { display: block; }
  .cf-auth-visual { display: none; }
  .cf-auth-form-side { min-height: 100vh; padding: 24px 16px; }
  .cf-auth-card { max-width: 460px; }
  .cf-mobile-brand { display: flex; }
  .cf-selection-content { margin-top: 55px; }
  .cf-selection-content h1 { font-size: clamp(36px, 9vw, 49px); }
  .cf-portals { grid-template-columns: 1fr; gap: 14px; }
  .cf-portal-card { min-height: 190px; padding: 21px; }
}
@media (prefers-reduced-motion: reduce) {
  .cf-auth *, .cf-orb {
    animation: none !important;
    transition: none !important;
  }
}
`;

function AuthPages({ onAuthenticated }) {
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

  function choosePortal(value) {
    setPortal(value);
    setIsRegister(false);
    setForm({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  }

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
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

    if (isRegister && form.password.length < 8) {
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
        setForm((previous) => ({
          ...previous,
          password: "",
        }));
        setSuccess("Account created successfully. Please sign in.");
        return;
      }

      const response = await api.post("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      const data = response.data;
      const role = String(data.role || "").toUpperCase();

      if (role !== portal) {
        setError(
          isAdmin
            ? "Access denied. This account does not have Admin privileges."
            : "This account is not registered as a student."
        );
        return;
      }

      const token = data.token || data.accessToken || data.jwt;

      if (!token) {
        setError("The login response did not contain a token.");
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
      if (err.response?.status === 401) {
        setError("Incorrect email or password.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access this portal.");
      } else if (!err.response) {
        setError("Cannot connect to the backend. Check port 8090.");
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

  return (
    <div className="cf-auth">
      <style>{AUTH_STYLES}</style>

      {!portal ? (
        <main className="cf-auth-selection">
          <header className="cf-auth-brand">
            <span className="cf-brand-mark">C</span>
            <span>CourseFlow</span>
          </header>

          <section className="cf-selection-content">
            <span className="cf-eyebrow">
              YOUR LEARNING JOURNEY STARTS HERE
            </span>
            <h1>
              One platform.
              <br />
              <span>Endless possibilities.</span>
            </h1>
            <p className="cf-selection-description">
              Discover courses, manage learning, and make every opportunity
              count.
            </p>

            <div className="cf-portals">
              <button
                type="button"
                className="cf-portal-card"
                onClick={() => choosePortal("STUDENT")}
              >
                <span className="cf-portal-icon">✦</span>
                <span className="cf-portal-title">Student Portal</span>
                <span className="cf-portal-description">
                  Explore courses and manage your enrollments.
                </span>
                <span className="cf-portal-arrow">Continue →</span>
              </button>

              <button
                type="button"
                className="cf-portal-card cf-admin-portal"
                onClick={() => choosePortal("ADMIN")}
              >
                <span className="cf-portal-icon">⌘</span>
                <span className="cf-portal-title">Admin Portal</span>
                <span className="cf-portal-description">
                  Manage courses and monitor platform activity.
                </span>
                <span className="cf-portal-arrow">
                  Administrator login →
                </span>
              </button>
            </div>
          </section>
        </main>
      ) : (
        <main className={`cf-auth-page ${isAdmin ? "cf-admin-auth" : ""}`}>
          <section className="cf-auth-visual">
            <button
              type="button"
              className="cf-back-button"
              onClick={() => choosePortal("")}
            >
              ← Change portal
            </button>

            <div className="cf-orb cf-orb-one" />
            <div className="cf-orb cf-orb-two" />

            <div className="cf-visual-content">
              <span className="cf-eyebrow">
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
                  ? "Manage courses, monitor enrollments, and review platform activity."
                  : "Discover courses, track your learning, and build new skills."}
              </p>

              <div className="cf-visual-features">
                <span>✓ Organized course management</span>
                <span>✓ Secure role-based access</span>
                <span>✓ A connected learning experience</span>
              </div>
            </div>

            <div className="cf-visual-footer">
              <span className="cf-brand-mark">C</span>
              <span>CourseFlow</span>
            </div>
          </section>

          <section className="cf-auth-form-side">
            <div className="cf-auth-card">
              <div className="cf-mobile-brand">
                <span className="cf-brand-mark">C</span>
                <span>CourseFlow</span>
              </div>

              <span className="cf-auth-badge">
                {isAdmin ? "ADMINISTRATOR ACCESS" : "STUDENT ACCOUNT"}
              </span>

              <h2>
                {isRegister
                  ? "Create your account"
                  : isAdmin
                    ? "Welcome, Admin"
                    : "Welcome back"}
              </h2>

              <p className="cf-auth-subtitle">
                {isRegister
                  ? "Create your student account to get started."
                  : isAdmin
                    ? "Sign in to access your admin dashboard."
                    : "Sign in to continue your learning journey."}
              </p>

              {error && (
                <div className="cf-auth-alert cf-auth-error" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="cf-auth-alert cf-auth-success" role="status">
                  {success}
                </div>
              )}

              <form className="cf-auth-fields" onSubmit={handleSubmit}>
                {isRegister && !isAdmin && (
                  <label className="cf-auth-field">
                    Full name
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      maxLength={100}
                      required
                    />
                  </label>
                )}

                <label className="cf-auth-field">
                  Email address
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="cf-auth-field">
                  Password
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    required
                  />
                  {isRegister && (
                    <span className="cf-field-hint">
                      Use at least 8 characters.
                    </span>
                  )}
                </label>

                <button
                  type="submit"
                  className="cf-auth-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : isRegister
                      ? "Create student account →"
                      : isAdmin
                        ? "Access secure dashboard →"
                        : "Sign in to CourseFlow →"}
                </button>
              </form>

              {!isAdmin && (
                <div className="cf-auth-switch">
                  {isRegister
                    ? "Already have an account?"
                    : "New to CourseFlow?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister((previous) => !previous);
                      setError("");
                      setSuccess("");
                      setForm((previous) => ({
                        ...previous,
                        password: "",
                      }));
                    }}
                  >
                    {isRegister ? "Sign in" : "Create account"}
                  </button>
                </div>
              )}

              <p className="cf-auth-security">
                Secure access protected by CourseFlow authentication
              </p>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "dashboard" : "login"
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({ ...emptyCourse });
  const [courseSaving, setCourseSaving] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setCourses([]);
    setEnrollments([]);
    setStats(null);
    setPage("login");
    setError("");
    setMessage("");
    setShowCourseForm(false);
    setEditingCourseId(null);
    setCourseForm({ ...emptyCourse });
  }

  function handleAuthenticated(authenticatedUser) {
    setUser(authenticatedUser);
    setPage("dashboard");
    setError("");
    setMessage("");
  }

  async function loadDashboard() {
    if (!user || !localStorage.getItem("token")) return;

    setError("");

    try {
      const courseResponse = await api.get("/api/courses");
      setCourses(
        Array.isArray(courseResponse.data) ? courseResponse.data : []
      );

      if (user.role === "ADMIN") {
        const statsResponse = await api.get("/api/admin/dashboard");
        setStats(statsResponse.data);
        setEnrollments([]);
      } else {
        const enrollmentResponse = await api.get("/api/enrollments/my");
        setEnrollments(
          Array.isArray(enrollmentResponse.data)
            ? enrollmentResponse.data
            : []
        );
        setStats(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Could not load dashboard data."
        );
      }
    }
  }

  useEffect(() => {
    if (page === "dashboard" && user) {
      loadDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user]);

  function openCreateForm() {
    setEditingCourseId(null);
    setCourseForm({ ...emptyCourse });
    setError("");
    setMessage("");
    setShowCourseForm(true);
  }

  function openEditForm(course) {
    setEditingCourseId(course.id);
    setCourseForm({
      courseName: course.courseName ?? "",
      description: course.description ?? "",
      durationWeeks: course.durationWeeks ?? 1,
      fee: course.fee ?? 0,
      status: course.status ?? "ACTIVE",
      capacity: course.capacity ?? 30,
    });
    setError("");
    setMessage("");
    setShowCourseForm(true);
  }

  function handleCourseField(event) {
    const { name, value } = event.target;
    setCourseForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function saveCourse(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setCourseSaving(true);

    const payload = {
      courseName: courseForm.courseName.trim(),
      description: courseForm.description.trim(),
      durationWeeks: Number(courseForm.durationWeeks),
      fee: Number(courseForm.fee),
      status: courseForm.status,
      capacity: Number(courseForm.capacity),
    };

    if (
      !payload.courseName ||
      payload.courseName.length > 100 ||
      payload.description.length > 500 ||
      !Number.isInteger(payload.durationWeeks) ||
      payload.durationWeeks < 1 ||
      !Number.isFinite(payload.fee) ||
      payload.fee < 0 ||
      !Number.isInteger(payload.capacity) ||
      payload.capacity < 1 ||
      !["ACTIVE", "INACTIVE"].includes(payload.status)
    ) {
      setError(
        "Check the course name, description, duration, fee, capacity, and status."
      );
      setCourseSaving(false);
      return;
    }

    try {
      if (editingCourseId !== null) {
        await api.put(`/api/courses/${editingCourseId}`, payload);
        setMessage("Course updated successfully.");
      } else {
        await api.post("/api/courses", payload);
        setMessage("Course created successfully.");
      }

      setShowCourseForm(false);
      setEditingCourseId(null);
      setCourseForm({ ...emptyCourse });
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save the course. Check your admin account and input."
      );
    } finally {
      setCourseSaving(false);
    }
  }

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.courseName}"?`)) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(`/api/courses/${course.id}`);

      setMessage("Course deleted successfully.");

      // Refresh dashboard/course data after successful deletion
      await loadDashboard();

    } catch (err) {
      console.error("Delete course error:", err);

      // Backend sends the custom message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      }

      // If backend returns 409 Conflict
      else if (err.response?.status === 409) {
        setError(
          "Cannot delete this course because students are already enrolled in it."
        );
      }

      // If backend still returns 500
      else if (err.response?.status === 500) {
        setError(
          "Cannot delete this course because students are already enrolled in it."
        );
      }

      // Unauthorized
      else if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      }

      // Forbidden
      else if (err.response?.status === 403) {
        setError("You do not have permission to delete this course.");
      }

      // Course not found
      else if (err.response?.status === 404) {
        setError("Course not found.");
      }

      // Network/backend unavailable
      else if (!err.response) {
        setError(
          "Unable to connect to the server. Please check whether the backend is running."
        );
      }

      // Other errors
      else {
        setError("Could not delete the course. Please try again.");
      }
    }
  };

  async function enroll(courseId) {
    setError("");
    setMessage("");

    try {
      await api.post(`/api/enrollments/courses/${courseId}`);
      setMessage("Enrollment successful.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Enrollment failed. The course may be full or inactive."
      );
    }
  }

  async function cancelEnrollment(enrollmentId) {
    if (!window.confirm("Cancel this enrollment?")) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/api/enrollments/${enrollmentId}`);
      setMessage("Enrollment cancelled successfully.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not cancel this enrollment."
      );
    }
  }

  if (page !== "dashboard" || !user) {
    return <AuthPages onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">C</span>
          <span>CourseFlow</span>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <button className="nav-item active" onClick={loadDashboard}>
          <span>▦</span> Dashboard
        </button>

        <button
          className="nav-item"
          onClick={() =>
            document.getElementById("courses")?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <span>▤</span> {isAdmin ? "Course catalogue" : "Explore courses"}
        </button>

        {!isAdmin && (
          <button
            className="nav-item"
            onClick={() =>
              document.getElementById("enrollments")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <span>✓</span> My enrollments
          </button>
        )}

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
            <div className="profile-info">
              <strong>{user.name || "User"}</strong>
              <span>{user.role}</span>
            </div>
          </div>

          <button className="logout-button" onClick={logout}>
            ↪ Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">COURSE MANAGEMENT</span>
            <h1>{isAdmin ? "Admin dashboard" : "Student dashboard"}</h1>
          </div>
          <button className="outline-button" onClick={loadDashboard}>
            ↻ Refresh
          </button>
        </header>

        <section className="welcome-banner">
          <div>
            <span className="eyebrow">YOUR LEARNING SPACE</span>
            <h2>Hello, {user.name || "there"} 👋</h2>
            <p>
              {isAdmin
                ? "Manage courses, monitor enrollments, and review platform activity."
                : "Explore available courses and continue your learning journey."}
            </p>
          </div>
          <div className="banner-symbol">✦</div>
        </section>

        {error && (
          <div className="alert error page-alert" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="alert success page-alert" role="status">
            {message}
          </div>
        )}

        {isAdmin && stats && (
          <section className="stats-grid">
            <StatCard label="Total courses" value={stats.totalCourses} icon="▤" />
            <StatCard
              label="Registered students"
              value={stats.totalStudents}
              icon="♙"
            />
            <StatCard
              label="Total enrollments"
              value={stats.totalEnrollments}
              icon="✓"
            />
            <StatCard
              label="Available seats"
              value={stats.availableSeats}
              icon="◷"
            />
          </section>
        )}

        <section id="courses" className="content-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE & MANAGE</span>
              <h2>{isAdmin ? "Course catalogue" : "Available courses"}</h2>
            </div>

            <div className="heading-actions">
              <span className="count-pill">{courses.length} courses</span>
              {isAdmin && (
                <button
                  className="primary-button compact-button"
                  onClick={openCreateForm}
                >
                  + Add course
                </button>
              )}
            </div>
          </div>

          <div className="course-grid">
            {courses.map((course) => (
              <article className="course-card" key={course.id}>
                <div className="course-art">
                  <span>COURSE</span>
                  <span className="course-art-icon">✧</span>
                </div>

                <div className="course-body">
                  <div className="course-meta">
                    <span>{course.durationWeeks} weeks</span>
                    <span
                      className={`status-pill ${
                        course.status?.toUpperCase() === "ACTIVE"
                          ? ""
                          : "inactive-pill"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <h3>{course.courseName}</h3>
                  <p className="course-description">
                    {course.description ||
                      "Explore this course and build new skills."}
                  </p>

                  <div className="course-details">
                    <span>
                      Capacity: <strong>{course.capacity ?? "—"}</strong>
                    </span>
                  </div>

                  <div className="course-bottom">
                    <strong>
                      {course.fee != null
                        ? `₹${Number(course.fee).toLocaleString("en-IN")}`
                        : "Fee not listed"}
                    </strong>

                    {isAdmin ? (
                      <div className="course-admin-actions">
                        <button
                          className="small-button"
                          onClick={() => openEditForm(course)}
                        >
                          Edit
                        </button>
                        <button
                          className="small-button delete-button"
                          onClick={() => handleDeleteCourse(course)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        className="small-button"
                        disabled={course.status?.toUpperCase() !== "ACTIVE"}
                        onClick={() => enroll(course.id)}
                      >
                        {course.status?.toUpperCase() === "ACTIVE"
                          ? "Enroll →"
                          : "Inactive"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="empty-state">
              <h3>No courses found</h3>
              <p>
                {isAdmin
                  ? "Add your first course using the Add course button."
                  : "Courses will appear here when available."}
              </p>
            </div>
          )}
        </section>

        {!isAdmin && (
          <section id="enrollments" className="content-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR PROGRESS</span>
                <h2>My enrollments</h2>
              </div>
              <span className="count-pill">
                {enrollments.length} enrolled
              </span>
            </div>

            <div className="enrollment-list">
              {enrollments.map((item) => (
                <article
                  className="enrollment-row"
                  key={item.enrollmentId}
                >
                  <div className="enrollment-icon">✓</div>
                  <div className="enrollment-info">
                    <strong>{item.courseName}</strong>
                    <span>
                      Enrolled{" "}
                      {item.enrollmentDate
                        ? new Date(item.enrollmentDate).toLocaleDateString(
                            "en-IN"
                          )
                        : ""}
                    </span>
                  </div>
                  <button
                    className="cancel-button"
                    onClick={() => cancelEnrollment(item.enrollmentId)}
                  >
                    Cancel
                  </button>
                </article>
              ))}

              {enrollments.length === 0 && (
                <div className="empty-state">
                  <h3>No enrollments yet</h3>
                  <p>Choose a course above to get started.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {showCourseForm && isAdmin && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCourseForm(false);
            }
          }}
        >
          <section
            className="course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">ADMIN COURSE MANAGEMENT</span>
                <h2 id="course-modal-title">
                  {editingCourseId !== null ? "Edit course" : "Create a course"}
                </h2>
              </div>
              <button
                type="button"
                className="close-button"
                aria-label="Close course form"
                onClick={() => setShowCourseForm(false)}
              >
                ×
              </button>
            </div>

            <form className="course-form" onSubmit={saveCourse}>
              <label>
                Course name
                <input
                  name="courseName"
                  value={courseForm.courseName}
                  onChange={handleCourseField}
                  placeholder="e.g. Java Full Stack"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={courseForm.description}
                  onChange={handleCourseField}
                  placeholder="What will students learn?"
                  maxLength={500}
                  rows={3}
                />
                <span className="field-hint">
                  {courseForm.description.length}/500 characters
                </span>
              </label>

              <div className="form-grid">
                <label>
                  Duration (weeks)
                  <input
                    type="number"
                    name="durationWeeks"
                    value={courseForm.durationWeeks}
                    onChange={handleCourseField}
                    min="1"
                    step="1"
                    required
                  />
                </label>

                <label>
                  Fee (₹)
                  <input
                    type="number"
                    name="fee"
                    value={courseForm.fee}
                    onChange={handleCourseField}
                    min="0"
                    step="0.01"
                    required
                  />
                </label>

                <label>
                  Capacity
                  <input
                    type="number"
                    name="capacity"
                    value={courseForm.capacity}
                    onChange={handleCourseField}
                    min="1"
                    step="1"
                    required
                  />
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={courseForm.status}
                    onChange={handleCourseField}
                    required
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </label>
              </div>

              {error && <div className="alert error">{error}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => setShowCourseForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button modal-submit"
                  disabled={courseSaving}
                >
                  {courseSaving
                    ? "Saving..."
                    : editingCourseId !== null
                      ? "Save changes"
                      : "Create course"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong>{value ?? 0}</strong>
    </article>
  );
}

export default App;