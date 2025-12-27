import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  verifyOTP,
  resetOtpState,
  resendOTP,
} from "../../store/slices/otpSlice";
import { Notify } from "../../utils/notify";

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, success, error } = useSelector((state) => state.otp);

  const [otp, setOtp] = useState("");
  const email = location.state?.email || "";

  const handleChange = (e) => setOtp(e.target.value);

  const handleSubmit = () => {
    if (!otp.trim()) return Notify("OTP is required", "warning");
    dispatch(verifyOTP({ email, otp }));
  };

  const handleResend = () => {
    dispatch(resendOTP(email));
    Notify("OTP resent to your email", "success");
  };

  useEffect(() => {
    if (error) Notify(error, "error");
  }, [error]);

  useEffect(() => {
    if (success) {
      Notify("Email verified! Please login.", "success");
      navigate("/login");
      dispatch(resetOtpState());
    }
  }, [success, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-4">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 blur-2xl rounded-3xl"></div>

        {/* Card */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl px-8 py-10 sm:px-10 text-center">
          {/* Header */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Verify <span className="text-cyan-400">OTP</span>
          </h1>

          <p className="text-gray-400 text-sm mb-6">
            Enter the verification code sent to <br />
            <span className="text-cyan-300 font-medium break-all">{email}</span>
          </p>

          {/* OTP Input */}
          <Input
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={handleChange}
          />

          {/* Verify Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="
            w-full
            mt-6
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
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Resend */}
          <p className="text-gray-400 mt-6 text-sm">
            Didn’t receive the code?{" "}
            <span
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium"
              onClick={handleResend}
            >
              Resend OTP
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
