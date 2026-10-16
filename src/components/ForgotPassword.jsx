import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
                "https://ems-api-roan.vercel.app/api/auth/forgot-password",
                { email }
            );

            setSubmitted(true);
            toast.success("If the account exists, reset instructions will be sent.");
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                "Unable to process your request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-white p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow border p-6">
                <h2 className="text-2xl font-bold mb-2">
                    Forgot Password?
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                    Enter your registered email address to receive
                    instructions to reset your password.
                </p>

                {submitted ? (
                    <p className="text-green-700 mb-4">
                        If an account matches that email, reset instructions
                        will be sent shortly. Check your inbox.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                            className="w-full px-3 py-2 border rounded-md mb-4"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-full"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                <div className="text-center mt-5">
                    <Link
                        to="/"
                        className="text-blue-500 text-sm hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;