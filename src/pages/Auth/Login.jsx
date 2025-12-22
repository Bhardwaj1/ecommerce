import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  login as loginUser,
  resetAuthState,
} from "../../store/slices/authSlice";
import { Notify } from "../../utils/notify";
import StarBorder from "../../components/StarBorder";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    loading,
    success,
    error,
    user: reduxUser,
    token,
  } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (!form.email.trim() || !form.password.trim()) {
      return Notify("Email and password are required", "warning");
    }
    dispatch(loginUser({ email: form.email, password: form.password }));
  };

  // Show API error
  useEffect(() => {
    if (error) Notify(error, "error");
  }, [error]);

  useEffect(() => {
    if (success && reduxUser && token) {
      Notify("Login successful", "success"); // ✅ show success message
      login(reduxUser, token); // save in AuthContext
      setTimeout(() => {
        navigate("/", { replace: true }); // delay navigation a bit to show notification
      }, 300); // 300ms delay
      dispatch(resetAuthState());
    }
  }, [success, reduxUser, token, login, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Meet<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Sign in to start or join meetings
          </p>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Email address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <StarBorder
            as="button"
            className="custom-class"
            color="cyan"
            speed="5s"
          >
            <button
              // className="w-full py-2.5 text-base font-semibold rounded-xl"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </StarBorder>
        </div>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>
        {/* Demo Guest Login */}
        <StarBorder
          as="button"
          className="custom-class"
          color="cyan"
          speed="5s"
        >
          <button
            onClick={() => {
              login({
                id: "demo-user-1",
                name: "Demo User",
                email: "demo@meetpro.com",
              });
              navigate("/");
            }}
            // className="w-full py-2.5 rounded-xl border border-gray-600 hover:border-blue-500 transition text-sm"
          >
            Continue as Guest
          </button>
        </StarBorder>
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
