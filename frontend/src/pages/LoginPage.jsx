import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // ✅ FIXED redirect logic
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await login(email, password);

      toast.success("Welcome back!");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            PG <span className="text-primary-200">CRM</span>
          </h1>
          <p className="text-primary-200 mt-2">
            Lead Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Welcome back
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Sign in to manage your leads
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@pgcrm.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">

            <p className="text-xs font-semibold text-gray-500 mb-2">
              DEMO CREDENTIALS
            </p>

            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <span className="font-medium">Admin:</span>
                {" "}admin@pgcrm.com / admin123
              </p>

              <p>
                <span className="font-medium">Agent:</span>
                {" "}rahul@pgcrm.com / agent123
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;