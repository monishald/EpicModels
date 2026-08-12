import React, { useState, useEffect } from "react";
import Navbar from "./Main";
import { FaEye, FaEyeSlash, FaShieldAlt, FaLock, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Password() {
    const api = process.env.REACT_APP_URL;

    const [formData, setFormData] = useState({
        email: "",
        Newpassword: "",
        confirmpassword: ""
    });
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);
    const [showOtp, setShowOtp] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [message, setMessage] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    const [errors, setErrors] = useState({
            firstname: "",
            lastname: "",
            email: "",
            mobilenumber: "",
            password: "",
            confirmpassword: "",
            countrycode: "",
            emailOtp: "",
            mobileOtp: ""
        })
    const ValidationMessage = ({ error, valid }) => {

        if (error) {
            return (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span>✕</span>
                    {error}
                </p>
            );
        }

        if (valid) {
            return (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                    <span>✓</span>
                    Valid
                </p>
            );
        }

        return null;
    };
    // ✅ Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        let error = "";
        // ================= EMAIL =================
        if (name === "email") {

            if (value.trim() === "") {
                error = "Email is required";
            }
            else if (!emailRegex.test(value.trim())) {
                error = "Enter a valid email address";
            }
            setErrors((prev) => ({
                ...prev,
                email: error
            }));
            // ================= NEW PASSWORD =================
            if (name === "Newpassword") {

                if (value === "") {
                    error = "Password is required";
                }
                else if (value.length < 8) {
                    error = "Password must contain at least 8 characters";
                }
                else if (!/[A-Z]/.test(value)) {
                    error = "Password must contain an uppercase letter";
                }
                else if (!/[a-z]/.test(value)) {
                    error = "Password must contain a lowercase letter";
                }
                else if (!/\d/.test(value)) {
                    error = "Password must contain a number";
                }
                else if (!/[@$!%*?&#^()_+=-]/.test(value)) {
                    error = "Password must contain a special character";
                }

                setErrors((prev) => ({
                    ...prev,
                    password: error
                }));

                setStrength(getPasswordStrength(value));
            }

            // ================= CONFIRM PASSWORD =================
            if (name === "confirmpassword") {

                if (value === "") {
                    error = "Confirm password is required";
                }
                else if (value !== formData.Newpassword) {
                    error = "Passwords do not match";
                }

                setErrors((prev) => ({
                    ...prev,
                    confirmpassword: error
                }));
            }
        }
    };

    // 🔐 Password strength
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&#^()_+=-]/.test(password)) strength++;

        if (strength <= 2) return "Weak";
        if (strength <= 4) return "Medium";
        return "Strong";
    };

    // 📩 Send OTP
    const sendOtp = async () => {
        if (!formData.email) {
            alert("Enter email first");
            return;
        }

        const res = await fetch(`${api}send-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                 email: formData.email,
                type: "email"
             })
        });

        const data = await res.json();

        if (data.success) {
            setShowOtp(true);
            setTimer(30);
            alert("OTP sent");
        } else {
            alert(data.message);
        }
    };

    // ⏱ Timer
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // ✅ Verify OTP
    const verifyOtp = async () => {
        const res = await fetch(`${api}verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: formData.email,
                otp
            })
        });

        const data = await res.json();

        if (data.success) {
            setOtpVerified(true);
            alert("OTP Verified ✅");
        } else {
            setOtpVerified(false);
            alert(data.message);
        }
    };

    // 🔄 Reset Password
    const resetPassword = async () => {
        if (!otpVerified) {
            setMessage("Verify OTP first");
            return;
        }

        if (formData.Newpassword !== formData.confirmpassword) {
            setMessage("Passwords do not match");
            return;
        }

        const res = await fetch(`${api}reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.Newpassword
            })
        });

        const data = await res.json();

        if (data.success) {
            setMessage("Password reset successful ✅");
        } else {
            setMessage("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100">

            {/* Navbar */}
            {/* <Navbar /> */}

            {/* Main Section */}
            <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

                <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* ================================================= */}
                        {/* LEFT SIDE */}
                        {/* ================================================= */}

                        <div className="relative hidden lg:flex flex-col justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 p-10 xl:p-14 text-white">

                            {/* Decorative circles */}
                            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full"></div>

                            <div className="absolute -bottom-28 -left-20 w-80 h-80 bg-pink-400/20 rounded-full blur-2xl"></div>

                            <div className="absolute top-1/3 right-10 w-20 h-20 bg-purple-300/20 rounded-full blur-xl"></div>

                            {/* Content */}
                            <div className="relative z-10">

                                {/* Icon */}
                                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md mb-8">
                                    <FaShieldAlt className="text-3xl text-pink-300" />
                                </div>

                                <p className="text-pink-300 font-medium mb-3">
                                    Account Security
                                </p>

                                <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
                                    Secure Your
                                    <br />
                                    Account
                                </h1>

                                <p className="text-white/75 text-base xl:text-lg leading-relaxed max-w-md">
                                    Reset your password securely and get back
                                    to your account with confidence.
                                </p>

                                {/* Security points */}
                                <div className="mt-10 space-y-5">

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <FaLock className="text-pink-300" />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Secure Verification
                                            </p>
                                            <p className="text-sm text-white/60">
                                                Verify your email using OTP
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <FaCheckCircle className="text-green-300" />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Quick & Easy
                                            </p>
                                            <p className="text-sm text-white/60">
                                                Reset your password in a few steps
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                {/* Bottom message */}
                                <div className="mt-12 border border-white/10 bg-white/10 backdrop-blur-md rounded-2xl p-5">
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        🔐 Your account security matters.
                                        Never share your OTP or password with
                                        anyone.
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* ================================================= */}
                        {/* RIGHT SIDE */}
                        {/* ================================================= */}

                        <div className="p-6 sm:p-8 md:p-10 lg:p-12">

                            {/* Mobile icon */}
                            <div className="flex lg:hidden justify-center mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
                                    <FaShieldAlt className="text-2xl text-indigo-600" />
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="text-center mb-8">

                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                    Reset Password
                                </h2>

                                <p className="text-gray-500 text-sm mt-2">
                                    Follow the steps below to securely reset
                                    your password
                                </p>

                            </div>

                            {/* ================= STEP INDICATOR ================= */}

                            <div className="flex items-center justify-center mb-8">

                                {/* Step 1 */}
                                <div className="flex items-center">

                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                                        ${!otpVerified
                                                ? "bg-indigo-600 text-white"
                                                : "bg-green-500 text-white"
                                            }`}
                                    >
                                        {otpVerified ? "✓" : "1"}
                                    </div>

                                    <span className="ml-2 text-xs sm:text-sm text-gray-600">
                                        Verification
                                    </span>

                                </div>

                                {/* Line */}
                                <div className="w-10 sm:w-16 h-[2px] bg-gray-200 mx-3"></div>

                                {/* Step 2 */}
                                <div className="flex items-center">

                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                                        ${otpVerified
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-200 text-gray-500"
                                            }`}
                                    >
                                        2
                                    </div>

                                    <span className="ml-2 text-xs sm:text-sm text-gray-600">
                                        New Password
                                    </span>

                                </div>

                            </div>

                            {/* ================= EMAIL ================= */}

                            <div className="mb-5">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your registered email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={otpVerified}
                                        className={`w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50
                                        text-gray-800 placeholder-gray-400
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                        disabled:bg-gray-100 disabled:text-gray-500 transition
                                                          ${errors.email
                                                ? "border-red-400"
                                                : formData.email
                                                    ? "border-green-400"
                                                    : "border-gray-200"
                                            }`}
                                    />
                                      <ValidationMessage
                                            error={errors.email}
                                            valid={
                                                formData.email !== "" &&
                                                errors.email === ""
                                            }
                                        />

                                </div>

                            </div>

                            {/* ================= SEND OTP ================= */}

                            {!otpVerified && (
                                <button
                                    onClick={sendOtp}
                                    disabled={!formData.email || timer > 0}
                                    className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-200
                                    ${!formData.email || timer > 0
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20"
                                        }`}
                                >
                                    {timer > 0
                                        ? `OTP Sent • Resend in ${timer}s`
                                        : showOtp
                                            ? "Resend OTP"
                                            : "Send OTP"}
                                </button>
                            )}

                            {/* ================= OTP ================= */}

                            {showOtp && !otpVerified && (
                                <div className="mt-6 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">

                                    <div className="flex items-center justify-between mb-3">

                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                Verify OTP
                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Enter the 6-digit OTP sent to your email
                                            </p>
                                        </div>

                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                                            <FaLock className="text-indigo-600" />
                                        </div>

                                    </div>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) {
                                                setOtp(e.target.value);
                                            }
                                        }}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white
                                        text-center text-lg tracking-[0.5em] font-semibold
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />

                                    <button
                                        onClick={verifyOtp}
                                        disabled={otp.length < 6}
                                        className={`w-full mt-4 h-12 rounded-xl font-semibold text-white transition
                                        ${otp.length < 6
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700"
                                            }`}
                                    >
                                        Verify OTP
                                    </button>

                                    <div className="text-center mt-3">

                                        {timer > 0 ? (
                                            <p className="text-xs text-gray-500">
                                                You can resend OTP in{" "}
                                                <span className="font-semibold text-indigo-600">
                                                    {timer}s
                                                </span>
                                            </p>
                                        ) : (
                                            <button
                                                onClick={sendOtp}
                                                className="text-sm text-indigo-600 font-semibold hover:underline"
                                            >
                                                Resend OTP
                                            </button>
                                        )}

                                    </div>

                                </div>
                            )}

                            {/* ================= VERIFIED ================= */}

                            {otpVerified && (
                                <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">

                                    <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center">
                                        <FaCheckCircle />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-green-700">
                                            Email Verified
                                        </p>

                                        <p className="text-xs text-green-600">
                                            You can now create a new password.
                                        </p>
                                    </div>

                                </div>
                            )}

                            {/* ================= PASSWORD SECTION ================= */}

                            {otpVerified && (
                                <div className="space-y-5">

                                    {/* New Password */}
                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            New Password
                                        </label>

                                        <div className="relative">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="Newpassword"
                                                placeholder="Enter new password"
                                                value={formData.Newpassword}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setStrength(
                                                        getPasswordStrength(
                                                            e.target.value
                                                        )
                                                    );
                                                }}
                                                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50
                                                focus:outline-none focus:ring-2 focus:ring-indigo-500
                                                focus:border-transparent transition"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                            </button>

                                        </div>

                                        {/* Password Strength */}
                                        {formData.Newpassword && (
                                            <div className="mt-2">

                                                <div className="flex justify-between items-center mb-1">

                                                    <span className="text-xs text-gray-500">
                                                        Password strength
                                                    </span>

                                                    <span
                                                        className={`text-xs font-semibold
                                                        ${strength === "Weak"
                                                                ? "text-red-500"
                                                                : strength === "Medium"
                                                                    ? "text-yellow-500"
                                                                    : "text-green-600"
                                                            }`}
                                                    >
                                                        {strength}
                                                    </span>

                                                </div>

                                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">

                                                    <div
                                                        className={`h-full transition-all duration-300
                                                        ${strength === "Weak"
                                                                ? "w-1/3 bg-red-500"
                                                                : strength === "Medium"
                                                                    ? "w-2/3 bg-yellow-500"
                                                                    : "w-full bg-green-500"
                                                            }`}
                                                    ></div>

                                                </div>

                                            </div>
                                        )}

                                    </div>

                                    {/* Confirm Password */}
                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            name="confirmpassword"
                                            placeholder="Confirm your new password"
                                            value={formData.confirmpassword}
                                            onChange={handleChange}
                                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50
                                            focus:outline-none focus:ring-2 focus:ring-indigo-500
                                            focus:border-transparent transition"
                                        />

                                        {/* Match message */}
                                        {formData.confirmpassword && (
                                            <p
                                                className={`text-xs mt-2 font-medium
                                                ${formData.Newpassword === formData.confirmpassword
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {formData.Newpassword ===
                                                    formData.confirmpassword
                                                    ? "✓ Passwords match"
                                                    : "Passwords do not match"}
                                            </p>
                                        )}

                                    </div>

                                    {/* Reset Password */}
                                    <button
                                        onClick={resetPassword}
                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700
                                        text-white rounded-xl font-semibold shadow-lg
                                        shadow-indigo-500/20 transition-all duration-200"
                                    >
                                        Reset Password
                                    </button>

                                </div>
                            )}

                            {/* ================= MESSAGE ================= */}

                            {message && (
                                <div
                                    className={`mt-5 p-3 rounded-xl text-center text-sm font-medium
                                    ${message.includes("successful")
                                            ? "bg-green-50 text-green-600 border border-green-200"
                                            : "bg-red-50 text-red-500 border border-red-200"
                                        }`}
                                >
                                    {message}
                                </div>
                            )}

                            {/* ================= BACK ================= */}

                            <button
                                onClick={() => navigate("/login")}
                                className="block mx-auto mt-6 text-sm text-gray-500 hover:text-indigo-600 hover:underline transition"
                            >
                                ← Back to Login
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}