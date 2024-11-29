import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const email = state?.email || localStorage.getItem("email");
  const referenceId = state?.referenceId || localStorage.getItem("referenceId"); 

  useEffect(() => {
    if (!email || !referenceId) {
      navigate("/register"); // Redirect if no email is found
    } else {
      localStorage.setItem("email", email); // Save email in storage
      localStorage.setItem("referenceId", referenceId);
    }
  }, [email, referenceId, navigate]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (verifyLoading || !otp || otp.length < 4) {
      setError("Please enter a valid OTP.");
      return;
    }

    setVerifyLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/otp/verify", {
        email,
        otp,
        referenceId,
      });
      if (response.data.success) {
        localStorage.removeItem("email"); // Clear email after successful verification
        localStorage.removeItem("referenceId");
        navigate("/login");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Error verifying OTP."
          : "Network error. Please check your connection."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/otp/resend", {
        email,
      });
      if (response.data.success) {
        setResendStatus("OTP has been resent to your email!");
        setError("");
      } else {
        setResendStatus("");
        setError("Error resending OTP. Please try again.");
      }
    } catch (err) {
      setResendStatus("");
      setError("Error resending OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-8">
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-purple-500 rounded-full blur-lg opacity-50"></div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indigo-500 rounded-full blur-lg opacity-50"></div>

        <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-4">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the OTP sent to your email to verify your account.
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 font-semibold animate-pulse">
            {error}
          </p>
        )}
        {resendStatus && (
          <p className="text-green-500 text-center mb-4 font-semibold animate-pulse">
            {resendStatus}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your OTP"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full ${
              verifyLoading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
            } text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none`}
            disabled={verifyLoading}
          >
            {verifyLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Didn't receive the OTP?{" "}
          <button
            onClick={handleResendOTP}
            className="text-purple-500 font-semibold hover:underline"
            disabled={loading}
          >
            {loading ? "Resending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
