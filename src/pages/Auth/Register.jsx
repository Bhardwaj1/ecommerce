import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { register, resetAuthState } from "../../store/slices/authSlice";
import { Notify } from "../../utils/notify";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validationRules = [
    { key: "name", message: "Name is required" },
    { key: "email", message: "Email is required" },
    { key: "password", message: "Password is required" },
    { key: "confirmPassword", message: "Confirm Password is required" },
  ];

  const handleSubmit = () => {
    for (const rule of validationRules) {
      if (!form[rule.key]?.trim()) {
        Notify(rule.message, "warning");
        return;
      }
    }

    if (form.password !== form.confirmPassword) {
      Notify("Password and Confirm Password do not match", "error");
      return;
    }

    dispatch(
      register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })
    );
  };

  useEffect(() => {
    if (error) Notify(error, "error");
  }, [error]);

  useEffect(() => {
    if (success) {
      // Flow 1: Redirect to Verify OTP page
      navigate("/verify-otp", { state: { email: form.email } });
      dispatch(resetAuthState());
    }
  }, [success, navigate, dispatch, form.email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-4">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 blur-2xl rounded-3xl"></div>

        {/* Card */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl px-8 py-10 sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Meet<span className="text-cyan-400">Pro</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Create your account to start meetings
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <Input
              name="email"
              type="email"
              placeholder="Email address"
              onChange={handleChange}
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
            />

            {/* Primary CTA */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="
              w-full
              py-4
              text-base
              font-semibold
              tracking-wide
              rounded-xl
              bg-gradient-to-r from-blue-600 to-cyan-500
              hover:opacity-90
              active:scale-[0.98]
              transition
            "
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
