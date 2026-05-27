import { useState } from "react";
import axios from "axios";import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }
    const [showPassword, setShowPassword] = useState(false);

    const showToast = (type, message) => {
        setToast({ type, message });
        if (type === "success") return; // success auto-navigates, no need to clear
        setTimeout(() => setToast(null), 3500);
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);

        try {
           const response = await api.post(
    "/api/auth/login",
    formData
);

            sessionStorage.setItem("token", response.data);
            showToast("success", "Logged in successfully");

            setTimeout(() => navigate("/dashboard", { replace: true }), 1200);

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Invalid email or password.";
            showToast("error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f4f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

                * { box-sizing: border-box; }

                .login-card {
                    animation: cardIn 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both;
                }
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(28px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }

                .form-field { animation: fieldIn 0.4s ease both; }
                .form-field:nth-child(1) { animation-delay: 0.1s; }
                .form-field:nth-child(2) { animation-delay: 0.18s; }
                .form-field:nth-child(3) { animation-delay: 0.26s; }
                @keyframes fieldIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }

                .login-input {
                    width: 100%;
                    border: 1.5px solid #e2e8f0;
                    padding: 13px 14px;
                    border-radius: 11px;
                    font-size: 14px;
                    font-family: 'DM Sans', sans-serif;
                    color: #1a1a1a;
                    background: #fafafa;
                    outline: none;
                    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
                }
                .login-input:focus {
                    border-color: #1a1a1a;
                    box-shadow: 0 0 0 3px rgba(26,26,26,0.07);
                    background: #fff;
                }
                .login-input::placeholder { color: #bbb; }

                .pw-wrap { position: relative; }
                .pw-toggle {
                    position: absolute;
                    right: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #aaa;
                    font-size: 13px;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 500;
                    padding: 2px 4px;
                    transition: color 0.15s;
                }
                .pw-toggle:hover { color: #555; }

                .submit-btn {
                    width: 100%;
                    background: #1a1a1a;
                    color: #fff;
                    border: none;
                    padding: 14px;
                    border-radius: 11px;
                    font-size: 15px;
                    font-weight: 600;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer;
                    transition: background 0.18s, transform 0.15s, opacity 0.18s;
                    position: relative;
                    overflow: hidden;
                }
                .submit-btn:hover:not(:disabled) {
                    background: #333;
                    transform: translateY(-1px);
                }
                .submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .toast {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 16px;
                    border-radius: 11px;
                    font-size: 13.5px;
                    font-weight: 500;
                    animation: toastIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both;
                }
                @keyframes toastIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)      scale(1);   }
                }
                .toast-success {
                    background: #f0fdf4;
                    border: 1.5px solid #bbf7d0;
                    color: #15803d;
                }
                .toast-error {
                    background: #fff5f5;
                    border: 1.5px solid #fecaca;
                    color: #b91c1c;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #ccc;
                    font-size: 12px;
                }
                .divider::before, .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #ebebeb;
                }
            `}</style>

            <div
                className="login-card"
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    border: "1px solid #ebebeb",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    width: "100%",
                    maxWidth: 420,
                    padding: "38px 36px 32px",
                }}
            >
                {/* LOGO + HEADING */}
                <div style={{ marginBottom: 28, textAlign: "center" }}>
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            background: "#1a1a1a",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                        }}
                    >
                        <span style={{ color: "#fff", fontSize: 20 }}>✦</span>
                    </div>
                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            margin: "0 0 6px",
                            letterSpacing: "-0.4px",
                        }}
                    >
                        Welcome back
                    </h1>
                    <p style={{ color: "#999", fontSize: 14, margin: 0 }}>
                        Sign in to your TaskFlow account
                    </p>
                </div>

                {/* TOAST */}
                {toast && (
                    <div
                        className={`toast ${
                            toast.type === "success" ? "toast-success" : "toast-error"
                        }`}
                        style={{ marginBottom: 18 }}
                    >
                        <span style={{ fontSize: 16 }}>
                            {toast.type === "success" ? "✓" : "⚠"}
                        </span>
                        {toast.message}
                    </div>
                )}

                {/* FORM */}
                <form
                    onSubmit={handleLogin}
                    style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                    <div className="form-field">
                        <label
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#555",
                                display: "block",
                                marginBottom: 6,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="login-input"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-field">
                        <label
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#555",
                                display: "block",
                                marginBottom: 6,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Password
                        </label>
                        <div className="pw-wrap">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="login-input"
                                style={{ paddingRight: 56 }}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="pw-toggle"
                                onClick={() => setShowPassword((p) => !p)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="form-field" style={{ marginTop: 4 }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? (
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                    <span
                                        style={{
                                            width: 15,
                                            height: 15,
                                            border: "2px solid rgba(255,255,255,0.35)",
                                            borderTopColor: "#fff",
                                            borderRadius: "50%",
                                            display: "inline-block",
                                            animation: "spin 0.7s linear infinite",
                                        }}
                                    />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                </form>

                {/* FOOTER */}
                <div style={{ marginTop: 24 }}>
                    <div className="divider">or</div>
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: 13.5,
                            color: "#888",
                            margin: "16px 0 0",
                        }}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "#1a1a1a",
                                fontWeight: 600,
                                textDecoration: "none",
                                borderBottom: "1.5px solid #1a1a1a",
                                paddingBottom: 1,
                            }}
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;