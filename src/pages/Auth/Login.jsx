import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({
      id: "demo-user-1",
      name: "Demo User",
      email: "demo@meetpro.com",
    });
    navigate("/");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Meet<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Sign in to start or join meetings
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Password" type="password" />

          <Button
            className="w-full py-2.5 text-base font-semibold rounded-xl"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* Demo / Extra */}
        <button
          onClick={handleLogin}
          className="w-full py-2.5 rounded-xl border border-gray-600 hover:border-blue-500 transition text-sm"
        >
          Continue as Guest
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
