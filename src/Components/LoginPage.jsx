import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true); // toggle between Login & Register
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        mobilenumber: "",
        whatsappnumber:"",
        email: "",
        password: "",
        confirmpassword: "",
        countrycode: ""
    });
    const [errors, setErrors] = useState({
        firstname: "",
        lastname: "",
        email: "",
        mobilenumber: "",
        whatsappnumber: "",
        password: "",
        confirmpassword: "",
        countrycode: "",
        emailOtp: "",
        mobileOtp: ""
    });
    const api = process.env.REACT_APP_URL;
    const navigate = useNavigate(); 

    const [emailOtp, setEmailOtp] = useState("");
    const [mobileOtp, setMobileOtp] = useState("");
    const [whatsappOtp, setWhatsappOtp] = useState("");

    const [emailTimer, setEmailTimer] = useState(0);
    const [mobileTimer, setMobileTimer] = useState(0);
    const [whatsappTimer,setWhatsappTimer]= useState(0);

    const [emailVerified, setEmailVerified] = useState(false);
    const [mobileVerified, setMobileVerified] = useState(false);
    const [whatsappVerified, setWhatsappVerified] = useState(false);

    // const [mobileOtpMethod, setMobileOtpMethod] = useState("");
    const [showMobileOtpOptions, setShowMobileOtpOptions] = useState(false);

    const [otpType, setOtpType] = useState(""); // "email" or "mobile"
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;
    

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        let error = "";

        // ================= FIRST NAME =================
        if (name === "firstname") {

            if (value.trim() === "") {
                error = "First name is required";
            }
            else if (!/^[A-Za-z ]+$/.test(value)) {
                error = "Only letters are allowed";
            }
            else if (value.trim().length < 2) {
                error = "Minimum 2 characters required";
            }
        }


        // ================= LAST NAME =================
        if (name === "lastname") {

            if (value.trim() === "") {
                error = "Last name is required";
            }
            else if (!/^[A-Za-z ]+$/.test(value)) {
                error = "Only letters are allowed";
            }
            else if (value.trim().length < 1) {
                error = "Minimum 2 characters required";
            }
        }


        // ================= EMAIL =================
        if (name === "email") {

            if (value.trim() === "") {
                error = "Email is required";
            }
            else if (!emailRegex.test(value)) {
                error = "Enter a valid email address";
            }
        }


        // ================= MOBILE =================
        if (name === "mobilenumber") {

            if (value === "") {
                error = "Mobile number is required";
            }
            else if (!/^\d+$/.test(value)) {
                error = "Only numbers are allowed";
            }
            else if (value.length < 10) {
                error = "Mobile number must be 10 digits";
            }
            else if (!mobileRegex.test(value)) {
                error = "Mobile number must start with 6, 7, 8 or 9";
            }
        }


        // ================= PASSWORD =================
        if (name === "password") {

            if (value === "") {
                error = "Password is required";
            }
            else if (value.length < 8) {
                error = "Minimum 8 characters required";
            }
            else if (value.length > 20) {
                error = "Maximum 20 characters allowed";
            }
            else if (!/[a-z]/.test(value)) {
                error = "Add at least one lowercase letter";
            }
            else if (!/[A-Z]/.test(value)) {
                error = "Add at least one uppercase letter";
            }
            else if (!/\d/.test(value)) {
                error = "Add at least one number";
            }
            else if (!/[@$!%*?&#^()_+=-]/.test(value)) {
                error = "Add at least one special character";
            }

            setStrength(getPasswordStrength(value));
        }


        // ================= CONFIRM PASSWORD =================
        if (name === "confirmpassword") {

            if (value === "") {
                error = "Please confirm your password";
            }
            else if (value !== formData.password) {
                error = "Passwords do not match";
            }
        }


        // ================= COUNTRY CODE =================
        if (name === "countrycode") {

            if (value === "") {
                error = "Country code is required";
            }
            else if (!/^\+\d{1,4}$/.test(value)) {
                error = "Example: +91";
            }
        }


        setErrors((prev) => ({
            ...prev,
            [name]: error
        }));
    };

    useEffect(() => {
        const { mobilenumber, email } = formData;
        if (!mobilenumber && mobilenumber === "") {
            setMobileVerified(false);
        }
        if (!email && email === "") {
            setEmailVerified(false);
        }
    }, [formData])

    const handleSubmit = async () => {
        // e.preventDefault();
        if (isLogin) {
            console.log(formData)
            fetch(`${api}login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })
                .then((res) => res.json())
                .then((resData) => {
                    if (resData.success) {
                        // const decoded = jwtDecode(resData.token);
                        localStorage.setItem("token", resData.token);
                        // setMessage(resData.message);
                    }
                    else {
                        console.log(resData.message)
                        // setMessage(resData.message);(resData.message);
                    }
                })
            alert("Login Successful");
            navigate("/")
        } else {
            // Mobile validation
            if (!/^[6-9][0-9]{9}$/.test(formData.mobilenumber)) {
                alert("Invalid mobile number");
                return;
            }
            // Password validation
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=-])[A-Za-z\d@$!%*?&#^()_+=-]{8,20}$/;

            if (!passwordRegex.test(formData.password)) {
                alert("Password must be 8-20 characters and include uppercase, lowercase, number, and special character");
                return;
            }

            // Confirm password
            if (formData.password !== formData.confirmpassword) {
                alert("Passwords does not match");
                return;
            }
            if (!isLogin) {
                if (!otpVerified) {
                    alert("Please verify OTP first");
                    return;
                }
                fetch(`${api}register`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': "application/json",
                    },
                    body: JSON.stringify({
                        firstname: formData.firstname,
                        lastname: formData.lastname,
                        email: formData.email,
                        password: formData.password,
                        mobilenumber: formData.mobilenumber,
                        countrycode: formData.countrycode

                    }),
                })

                    .then((res) => res.json())
                    .then((resData) => {
                        console.log(formData)
                        if (resData.success) {
                            console.log(resData)
                            setFormData({
                                firstname: "",
                                lastname: "",
                                mobilenumber: "",
                                email: "",
                                password: "",
                                confirmpassword: "",
                                countrycode: ""
                            })
                            // setMessage(resData.message);(resData.message);
                            setIsLogin(false);
                            navigate("/login");
                        } else {
                            console.log(resData)
                            // setMessage(resData.message);(resData.message);
                        }
                    })
                    .catch((err) => {
                        console.log("Error in registration:", err);
                        // setMessage(resData.message);("Trouble in connecting to server");

                    });
                // ✅ If all valid
                alert("Registration Successful");
            }
        }
    }

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


    const sendOtp = async (type, method = "") => {
        let _type = type === "email" ? "email" : method;
        setOtpType(_type);

        let validate = _type;

        // ================= EMAIL =================
        if (type === "email" && method === "") {
            validate = emailRegex.test(formData.email);
        }

        // ================= MOBILE =================
        else if (method === "mobilenumber") {
            validate = mobileRegex.test(formData.mobilenumber);
        }

        // ================= WHATSAPP =================
        else if (method === "whatsappnumber") {
            validate = mobileRegex.test(formData.whatsappnumber);
        }

        // ================= VALIDATION =================
        if (!validate) {
            alert(
                type === "email"
                    ? "Enter a valid email"
                    : "Enter a valid mobile number"
            );
            return;
        }

        // ================= PAYLOAD =================
        const payload =
            type === "email"
                ? {
                    email: formData.email,
                    type: "email"
                }
                : type === "mobilenumber"
                    ? {
                        mobilenumber: formData.mobilenumber,
                        type: "mobilenumber"
                    }
                    : {
                        whatsappnumber: formData.whatsappnumber,
                        type: "whatsappnumber"
                    };

        console.log("Sending OTP:", payload);

        try {

            const res = await fetch(`${api}send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            console.log("Send OTP Response:", data);

            if (data.success) {

                // ================= EMAIL =================
                if (type === "email") {

                    setEmailVerified(true);
                    setEmailTimer(30);

                }

                // ================= MOBILE =================
                else if (type === "mobilenumber") {

                    setMobileVerified(true);
                    setMobileTimer(30);

                    // setMobileOtpMethod(method);
                    setShowMobileOtpOptions(false);

                }

                // ================= WHATSAPP =================
                else if (type === "whatsappnumber") {

                    setWhatsappVerified(true);
                    setWhatsappTimer(30);

                    // setMobileOtpMethod("whatsapp");
                    setShowMobileOtpOptions(false);

                }

                else {
                    alert(data.message || "Unable to send OTP");
                }

            } else {

                if (type === "email") {

                    setEmailVerified(true);
                    setEmailTimer(30);

                }
                else if (type === "mobilenumber") {

                    setMobileVerified(true);
                    setMobileTimer(30);
                    // setMobileOtpMethod("mobile");
                    setShowMobileOtpOptions(false);

                }
                else if (type === "whatsappnumber") {

                    setWhatsappVerified(true);
                    setWhatsappTimer(30);
                    // setMobileOtpMethod("whatsapp");
                    setShowMobileOtpOptions(false);

                }

            }

        } catch (error) {

            console.log("Send OTP Error:", error);
            alert("Unable to send OTP");

        }
    }; // ✅ VERY IMPORTANT: sendOtp ends here


    // =====================================================
    // OTP TIMER
    // =====================================================

    useEffect(() => {

        let interval;

        // EMAIL TIMER
        if (emailTimer > 0) {

            interval = setInterval(() => {

                setEmailTimer((prev) => prev - 1);

            }, 1000);

        }

        // MOBILE TIMER
        else if (mobileTimer > 0) {

            interval = setInterval(() => {

                setMobileTimer((prev) => prev - 1);

            }, 1000);

        }

        // WHATSAPP TIMER
        else if (whatsappTimer > 0) {

            interval = setInterval(() => {

                setWhatsappTimer((prev) => prev - 1);

            }, 1000);

        }

        return () => clearInterval(interval);

    }, [emailTimer, mobileTimer, whatsappTimer]);

    const verifyOtp = async () => {
        try {
            let payload = {};

            // ================= EMAIL =================
            if (otpType === "email") {
                payload = {
                    email: formData.email
                };
            }

            // ================= MOBILE =================
            else if (otpType === "mobilenumber") {
                payload = {
                    mobilenumber: formData.mobilenumber
                };
            }

            // ================= WHATSAPP =================
            else if (otpType === "whatsappnumber") {
                payload = {
                    whatsappnumber: formData.whatsappnumber
                };
            }

            // OTP based on type
            const enteredOtp =
                otpType === "email"
                    ? emailOtp
                    : otpType === "mobilenumber"
                        ? mobileOtp
                        : whatsappOtp;

            const res = await fetch(`${api}verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    ...payload,
                    otp: enteredOtp,
                    type: otpType
                }),
            });

            const data = await res.json();

            if (data.success) {

                alert(`${otpType} Verified ✅`);

                // ================= EMAIL =================
                if (otpType === "email") {
                    setEmailVerified(true);
                }

                // ================= MOBILE =================
                else if (otpType === "mobilenumber") {
                    setMobileVerified(true);
                }

                // ================= WHATSAPP =================
                else if (otpType === "whatsappnumber") {
                    setWhatsappVerified(true);
                }

                setOtpVerified(true);

            } else {

                alert(data.message);
                setOtpVerified(false);
            }

        } catch (error) {

            console.log("Verify OTP Error:", error);
            alert("Unable to verify OTP");
            setOtpVerified(false);
        }
    };
    const handleGoogleLogin = async (credentialResponse) => {

        try {

            console.log(
                "Google credential:",
                credentialResponse.credential
            );

            const response = await fetch(`${api}google-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    token: credentialResponse.credential
                })
            });

            const data = await response.json();

            console.log("Backend response:", data);

            if (data.success) {

                // Store backend JWT
                localStorage.setItem(
                    "token",
                    data.token
                );

                // Store user details
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                alert("Google Login Successful ✅");
                navigate("/");

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log("Google login error:", error);

            alert("Google login failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 flex items-center justify-center p-3 sm:p-5 lg:p-8">

            {/* ================= MAIN CONTAINER ================= */}
            <div className="w-full max-w-7xl min-h-[650px] lg:min-h-[720px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">

                {/* =====================================================
                LEFT SIDE
            ====================================================== */}
                <div className="hidden md:flex md:w-[42%] lg:w-[45%] relative overflow-hidden text-white">

                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#090d35] via-[#351064] to-[#b914a4]" />

                    {/* Decorative circles */}
                    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-pink-500/30 blur-3xl" />

                    <div className="absolute bottom-10 -left-20 w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl" />

                    <div className="absolute top-1/2 right-10 w-32 h-32 rounded-full bg-purple-400/20 blur-2xl" />

                    {/* Decorative lines
                    <div className="absolute top-24 left-10 w-20 h-1 bg-pink-400 rounded-full opacity-80" />

                    <div className="absolute bottom-24 right-10 w-28 h-1 bg-purple-300 rounded-full opacity-50" /> */}

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between w-full p-8 lg:p-10 xl:p-14">

                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center text-xl">
                                    ✦
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold">
                                        YourBrand
                                    </h2>

                                    <p className="text-xs text-white/50">
                                        Smart & Secure Platform
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Center Content */}
                        <div className="max-w-lg">

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-5">

                                <span className="w-2 h-2 rounded-full bg-green-400"></span>

                                <span className="text-xs sm:text-sm text-white/80">
                                    Secure authentication
                                </span>

                            </div>

                            <p className="text-pink-300 text-sm sm:text-base font-medium mb-3">
                                Glad to see you again!
                            </p>

                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-5">
                                Welcome Back
                                {/* <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                                    
                                </span> */}
                            </h1>

                            <p className="text-white/70 text-sm lg:text-base leading-7 max-w-md">
                                Log in to your account and continue managing your
                                workspace seamlessly, securely and efficiently.
                            </p>

                            {/* Feature cards */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-8">

                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">

                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                                        🔐
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-sm">
                                            Secure
                                        </h4>

                                        <p className="text-xs text-white/50">
                                            Protected account
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">

                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                                        ⚡
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-sm">
                                            Fast
                                        </h4>

                                        <p className="text-xs text-white/50">
                                            Quick access
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Bottom */}
                        {/* <div className="text-xs text-white/40">
                            © 2026 YourBrand. All rights reserved.
                        </div> */}

                    </div>
                </div>


                {/* =====================================================
                RIGHT SIDE
            ====================================================== */}
                <div className="w-full md:w-[58%] lg:w-[55%] flex items-center justify-center bg-white">

                    <div className="w-full max-w-xl px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-10">

                        {/* ================= HEADER ================= */}
                        <div className="text-center mb-7">

                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 text-2xl mb-4">
                                {isLogin ? "👋" : "🚀"}
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {isLogin
                                    ? "Welcome Back"
                                    : "Create Your Account"}
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                {isLogin
                                    ? "Sign in to continue to your account"
                                    : "Register and start your journey with us"}
                            </p>

                        </div>


                        {/* ================= TOGGLE ================= */}
                        <div className="flex justify-center mb-7">

                            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">

                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`px-6 sm:px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isLogin
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "text-gray-500 hover:text-gray-800"
                                        }`}
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`px-6 sm:px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${!isLogin
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "text-gray-500 hover:text-gray-800"
                                        }`}
                                >
                                    Signup
                                </button>

                            </div>

                        </div>


                        {/* =================================================
                        LOGIN
                    ================================================== */}
                        {isLogin ? (

                            <form className="space-y-5">

                                {/* Email */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            ✉
                                        </span>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            placeholder="Enter your email"
                                            onChange={handleChange}
                                            className={`w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition
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


                                {/* Password */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            🔒
                                        </span>

                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                                        />

                                    </div>

                                </div>


                                {/* Forgot Password */}
                                <div className="flex justify-end">

                                    <button
                                        type="button"
                                        onClick={() => navigate("/password")}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                                    >
                                        Forgot Password?
                                    </button>

                                </div>

                            </form>

                        ) : (

                            /* =================================================
                               SIGNUP
                            ================================================== */

                            <div className="space-y-4">

                                {/* First + Last Name */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                First Name
                                            </label>

                                            <input
                                                type="text"
                                                name="firstname"
                                                value={formData.firstname}
                                                placeholder="First name"
                                                onChange={handleChange}
                                                className={`w-full h-11 px-4 rounded-xl border bg-gray-50 outline-none transition
                                                      ${errors.firstname
                                                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                                                        : formData.firstname
                                                            ? "border-green-400 focus:ring-4 focus:ring-green-100"
                                                            : "border-gray-200 focus:border-indigo-500"
                                                    }`}
                                            />

                                            <ValidationMessage
                                                error={errors.firstname}
                                                valid={
                                                    formData.firstname !== "" &&
                                                    errors.firstname === ""
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Last Name
                                            </label>

                                            <input
                                                type="text"
                                                name="lastname"
                                                value={formData.lastname}
                                                placeholder="Last name"
                                                onChange={handleChange}
                                                className={`w-full h-11 px-4 rounded-xl border bg-gray-50 outline-none transition
                                                       ${errors.lastname
                                                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                                                        : formData.lastname
                                                            ? "border-green-400 focus:ring-4 focus:ring-green-100"
                                                            : "border-gray-200 focus:border-indigo-500"
                                                    }`}
                                            />

                                            <ValidationMessage
                                                error={errors.lastname}
                                                valid={
                                                    formData.lastname !== "" &&
                                                    errors.lastname === ""
                                                }
                                            />
                                        </div>
                                </div>


                                {/* ================= EMAIL ================= */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>

                                    <div className="flex flex-col sm:flex-row gap-2">

                                        <div className="relative flex-1">

                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                ✉
                                            </span>

                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    placeholder="Enter your email"
                                                    onChange={handleChange}
                                                    className={`w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition
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

                                        <button
                                            disabled={
                                                formData.email === "" &&
                                                !emailRegex.test(formData.email)
                                            }
                                            onClick={() => sendOtp("email")}
                                            className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
                                        >
                                            Send OTP
                                        </button>

                                    </div>


                                    {/* EMAIL OTP */}
                                    {emailVerified && (

                                        <div className="mt-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100">

                                            <div className="flex flex-col sm:flex-row gap-2">

                                                <input
                                                    value={emailOtp}
                                                    onChange={(e) =>
                                                        setEmailOtp(e.target.value)
                                                    }
                                                    placeholder="Enter 6-digit OTP"
                                                    className="flex-1 h-11 px-4 rounded-xl border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
                                                />

                                                <button
                                                    disabled={emailOtp.length < 6}
                                                    onClick={() =>
                                                        verifyOtp()
                                                    }
                                                    className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm"
                                                >
                                                    Verify
                                                </button>

                                            </div>

                                            <div className="flex justify-end mt-2">

                                                <button
                                                    onClick={() =>
                                                        sendOtp("email")
                                                    }
                                                    disabled={emailTimer > 0}
                                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    {emailTimer > 0
                                                        ? `Resend OTP in ${emailTimer}s`
                                                        : "Resend OTP"}
                                                </button>

                                            </div>

                                        </div>

                                    )}

                                </div>


                                {/* ================= MOBILE ================= */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number
                                    </label>

                                    <div className="flex flex-col sm:flex-row gap-2">

                                        <div className="relative flex-1">

                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                📱
                                            </span>

                                            <input
                                                name="mobilenumber"
                                                placeholder="10-digit mobile number"
                                                maxLength={10}
                                                value={formData.mobilenumber}
                                                onChange={(e) => {
                                                    if (/^\d*$/.test(e.target.value)) {

                                                        setFormData({
                                                            ...formData,
                                                            mobilenumber: e.target.value
                                                        });

                                                        let error = "";

                                                        if (e.target.value === "") {
                                                            error = "Mobile number is required";
                                                        }
                                                        else if (e.target.value.length < 10) {
                                                            error = "Mobile number must be 10 digits";
                                                        }
                                                        else if (!mobileRegex.test(e.target.value)) {
                                                            error = "Mobile number must start with 6, 7, 8 or 9";
                                                        }

                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            mobilenumber: error
                                                        }));
                                                    }

                                                }}
                                                    className={`w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition
                                                     ${errors.mobilenumber
                                                            ? "border-red-400"
                                                            : formData.mobilenumber
                                                                ? "border-green-400"
                                                                : "border-gray-200"
                                                        }`}
                                             />

                                                <ValidationMessage
                                                     error={errors.mobilenumber}
                                                     valid={
                                                      formData.mobilenumber.length === 10 &&
                                                      errors.mobilenumber === ""
                                                    }
                                                 />

                                        </div>

                                        <button
                                            disabled={
                                                (
                                                    formData.mobilenumber === "" ||
                                                    !mobileRegex.test(
                                                        formData.mobilenumber
                                                    )
                                                ) &&
                                                !mobileRegex.test(
                                                    formData.mobilenumber
                                                )
                                            }
                                            onClick={() => setShowMobileOtpOptions(true)}
                                            className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
                                        >
                                            Send OTP
                                        </button>

                                    </div>
                                        {/* ================= SMS / WHATSAPP OPTIONS ================= */}

                                        {showMobileOtpOptions && (

                                            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">

                                                <p className="text-sm font-semibold text-gray-700 mb-3">
                                                    Where do you want to receive the OTP?
                                                </p>

                                                <div className="flex gap-3">

                                                    {/* SMS */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            sendOtp("mobilenumber", "sms")
                                                        }
                                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-medium transition"
                                                    >
                                                        📱 SMS
                                                    </button>


                                                    {/* WHATSAPP */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            sendOtp("mobilenumber", "whatsapp")
                                                        }
                                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-medium transition"
                                                    >
                                                        💬 WhatsApp
                                                    </button>

                                                </div>

                                            </div>

                                        )}


                                    {/* MOBILE OTP */}
                                    {mobileVerified && (

                                        <div className="mt-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100">

                                            <div className="flex flex-col sm:flex-row gap-2">

                                                <input
                                                    value={mobileOtp}
                                                    onChange={(e) =>
                                                        setMobileOtp(e.target.value)
                                                    }
                                                    placeholder="Enter 6-digit OTP"
                                                    className="flex-1 h-11 px-4 rounded-xl border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
                                                />

                                                <button
                                                    disabled={mobileOtp.length < 6}
                                                    onClick={() =>
                                                        verifyOtp()
                                                    }
                                                    className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm"
                                                >
                                                    Verify
                                                </button>

                                            </div>

                                            <div className="flex justify-end mt-2">

                                                <button
                                                    onClick={() =>
                                                        sendOtp("mobilenumber", "whatsapp")
                                                    }
                                                    disabled={mobileTimer > 0}
                                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    {mobileTimer > 0
                                                        ? `Resend OTP in ${mobileTimer}s`
                                                        : "Resend OTP"}
                                                </button>

                                            </div>

                                        </div>

                                    )}

                                    {/* WHATSAPP OTP */}
                                    {whatsappVerified && (

                                        <div className="mt-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100">

                                            <div className="flex flex-col sm:flex-row gap-2">

                                                <input
                                                    value={whatsappOtp}
                                                    onChange={(e) =>
                                                        setWhatsappOtp(e.target.value)
                                                    }
                                                    placeholder="Enter 6-digit OTP"
                                                    className="flex-1 h-11 px-4 rounded-xl border border-indigo-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
                                                />

                                                <button
                                                    disabled={whatsappOtp.length < 6}
                                                    onClick={() =>
                                                        verifyOtp()
                                                    }
                                                    className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm"
                                                >
                                                    Verify
                                                </button>

                                            </div>

                                            <div className="flex justify-end mt-2">

                                                <button
                                                    onClick={() =>
                                                        sendOtp("mobilenumber", "whatsapp")
                                                    }
                                                    disabled={mobileTimer > 0}
                                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    {mobileTimer > 0
                                                        ? `Resend OTP in ${mobileTimer}s`
                                                        : "Resend OTP"}
                                                </button>

                                            </div>

                                        </div>

                                    )}

                                </div>


                                {/* ================= PASSWORD ================= */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>

                                    <div className="relative">

                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            🔒
                                        </span>

                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Create password"
                                            onChange={(e) => {
                                                handleChange(e);
                                                setStrength(
                                                    getPasswordStrength(
                                                        e.target.value
                                                    )
                                                );
                                            }}
                                            className="w-full h-11 pl-11 pr-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                                        />

                                        <span
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </span>

                                    </div>


                                    {/* Password Strength */}
                                    {formData.password && (

                                        <div className="flex items-center gap-2 mt-2">

                                            <div className="flex gap-1">

                                                <span
                                                    className={`w-8 h-1 rounded-full ${strength === "Weak"
                                                            ? "bg-red-500"
                                                            : strength === "Medium"
                                                                ? "bg-yellow-500"
                                                                : "bg-green-500"
                                                        }`}
                                                />

                                                <span
                                                    className={`w-8 h-1 rounded-full ${strength === "Medium" ||
                                                            strength === "Strong"
                                                            ? "bg-yellow-500"
                                                            : "bg-gray-200"
                                                        }`}
                                                />

                                                <span
                                                    className={`w-8 h-1 rounded-full ${strength === "Strong"
                                                            ? "bg-green-500"
                                                            : "bg-gray-200"
                                                        }`}
                                                />

                                            </div>

                                            <span
                                                className={`text-xs font-medium ${strength === "Weak"
                                                        ? "text-red-500"
                                                        : strength === "Medium"
                                                            ? "text-yellow-600"
                                                            : "text-green-600"
                                                    }`}
                                            >
                                                {strength}
                                            </span>

                                        </div>

                                    )}

                                </div>


                                {/* Confirm Password */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>

                                    <div className="relative">

                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            🔒
                                        </span>

                                        <input
                                            type="password"
                                            name="confirmpassword"
                                            placeholder="Confirm password"
                                            onChange={handleChange}
                                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                                        />

                                    </div>

                                </div>


                                {/* Country Code */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Country Code
                                    </label>

                                    <input
                                        type="text"
                                        name="countrycode"
                                        placeholder="Example: +91"
                                        onChange={handleChange}
                                            className={`w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition
                                                ${errors.countrycode
                                                    ? "border-red-400"
                                                    : formData.countrycode
                                                        ? "border-green-400"
                                                        : "border-gray-200"
                                                }`}
                                        />

                                        <ValidationMessage
                                            error={errors.countrycode}
                                            valid={
                                                formData.countrycode !== "" &&
                                                errors.countrycode === ""
                                            }
                                        />

                                </div>

                            </div>
                        )}


                        {/* =================================================
                        SUBMIT BUTTON
                    ================================================== */}

                        <button
                            onClick={handleSubmit}
                            className="w-full mt-6 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            {isLogin ? "Login to Account" : "Create Account"}
                        </button>


                        {/* =================================================
                        GOOGLE LOGIN
                    ================================================== */}

                        {isLogin && (

                            <>

                                {/* Divider */}
                                <div className="flex items-center gap-3 my-6">

                                    <div className="flex-1 h-px bg-gray-200"></div>

                                    <span className="text-xs text-gray-400 font-medium">
                                        OR CONTINUE WITH
                                    </span>

                                    <div className="flex-1 h-px bg-gray-200"></div>

                                </div>


                                <div className="w-full flex justify-center">

                                    <GoogleLogin
                                        onSuccess={handleGoogleLogin}
                                        onError={() => {
                                            console.log("Google Login Failed");
                                            alert("Google Login Failed");
                                        }}
                                    />

                                </div>

                            </>
                        )}


                        {/* Bottom security message */}
                        <div className="flex justify-center items-center gap-2 mt-6 text-xs text-gray-400">

                            <span>🔒</span>

                            <span>
                                Your information is securely protected
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )}

