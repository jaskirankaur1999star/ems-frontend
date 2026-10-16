import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:3000/api/auth/reset-password/${token}`,
                { password }
            );

            if (response.data.success) {
                toast.success("Password reset successfully!");
                navigate("/");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-white p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow border p-6">
                <h2 className="text-2xl font-bold mb-2">
                    Reset Password
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        autoComplete="new-password"
                        required
                        className="w-full px-3 py-2 border rounded-md mb-4"
                    />

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                        autoComplete="new-password"
                        required
                        className="w-full px-3 py-2 border rounded-md mb-4"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-full"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

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

export default ResetPassword;