import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Main() {
    const navigate=useNavigate();

    // ✅ Handle login navigation
    const handleLogin = () => {
        navigate("/login");
    };
    return (
        <div >

            {/* 🔝 NAVBAR */}
            <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-blue-600"> 🌸 Dashboard</h1>

                <div className="flex gap-4">
                    
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
                        onClick={handleLogin}
                        >
                            Login
                        </button>
                   

                     {/*                     
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </button> */}
                    
                </div>
            </nav>

            {/* Welcome Section */}
            <div className="flex justify-center items-center min-h-[80vh] px-5">

                <div className="text-center">

                    <div className="text-5xl mb-5">
                        👋
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Welcome to Dashboard
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Please login to continue.
                    </p>

                    <button
                        onClick={handleLogin}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Get Started
                    </button>

                </div>

            </div>

        </div>
    );
}