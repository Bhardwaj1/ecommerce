import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import OtpBoxInput from "../../components/common/OtpBoxInput";
import useCountdown from "../../hooks/useCountdown";
import {
  verifyOTP,
  resendOTP,
  incrementAttempt,
  lockOtp,
  resetAttempts,
  resetOtpState,
} from "../../store/slices/otpSlice";
import {
  OTP_MAX_ATTEMPTS,
  OTP_LOCK_TIME,
  OTP_RESEND_COOLDOWN,
} from "../../constants/security";
import { Notify } from "../../utils/notify";
import useNow from "../../hooks/useNow";

export default function VerifyOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const { loading, success, attempts, lockedUntil } = useSelector(
    (state) => state.otp
  );

  const [otp, setOtp] = useState("");
  const now = useNow(1000);

  const isLocked = lockedUntil && now() < lockedUntil;
  const lockSeconds = isLocked ? Math.ceil((lockedUntil - now()) / 1000) : 0;

  const resendTimer = useCountdown(OTP_RESEND_COOLDOWN);

  const handleVerify = () => {
    if (isLocked) return;

    if (otp.length !== 6) {
      Notify("Please enter a valid 6-digit OTP", "warning");
      return;
    }

    dispatch(verifyOTP({ email, otp }))
      .unwrap()
      .then(() => {
        dispatch(resetAttempts());
      })
      .catch(() => {
        dispatch(incrementAttempt());

        if (attempts + 1 >= OTP_MAX_ATTEMPTS) {
          dispatch(lockOtp());
          Notify(
            `Too many failed attempts. Try again in ${OTP_LOCK_TIME} seconds.`,
            "error"
          );
        }
      });
  };

  const handleResend = () => {
    dispatch(resendOTP(email));
    dispatch(resetAttempts());
    resendTimer.reset();
    Notify("OTP resent successfully", "success");
  };

  useEffect(() => {
    if (success) {
      Notify("OTP verified successfully", "success");
      dispatch(resetOtpState());
      navigate("/login");
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Meet<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-gray-400 mt-2">Enter the OTP sent to your email</p>
        </div>

        {/* OTP Section */}
        <div className="space-y-6">
          <OtpBoxInput value={otp} onChange={setOtp} />

          {isLocked && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm text-center">
              Too many failed attempts. Try again in{" "}
              <span className="font-semibold">{lockSeconds}s</span>
            </div>
          )}

          <Button
            onClick={handleVerify}
            disabled={loading || isLocked}
            className="w-full py-2.5 text-base font-semibold rounded-xl"
          >
            {isLocked ? "Locked" : loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            <button
              disabled={resendTimer.time > 0}
              onClick={handleResend}
              className={`text-sm ${
                resendTimer.time > 0
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-blue-500 hover:underline"
              }`}
            >
              Resend OTP
              {resendTimer.time > 0 && ` (${resendTimer.time}s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
