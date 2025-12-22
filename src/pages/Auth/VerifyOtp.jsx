import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { verifyOTP, resetOtpState, resendOTP } from "../../store/slices/otpSlice";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Verify OTP</h1>
        <p className="text-gray-400 mb-6">
          Enter the OTP sent to <span className="font-semibold">{email}</span>
        </p>
        <Input
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleChange}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 mt-4 font-semibold rounded-xl"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        <p className="text-gray-400 mt-4 text-sm">
          Didn't receive OTP?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={handleResend}
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}
