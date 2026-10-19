import React, { useEffect, useState } from "react";
import SummaryCards from "./SummaryCards";
import {
    FaBuilding,
    FaCheckCircle,
    FaFileAlt,
    FaHourglassHalf,
    FaMoneyBill,
    FaRegTimesCircle,
    FaUser,
} from "react-icons/fa";
import axios from "axios";

const AdminSummary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axios.get(
                    "https://ems-api-seven.vercel.app/api/dashboard/summary",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                console.log("Dashboard summary:", response.data);

                if (response.data.success) {
                    setSummary(response.data);
                } else {
                    setError(
                        response.data.error ||
                        "Failed to fetch dashboard summary."
                    );
                }
            } catch (error) {
                console.error(
                    "Dashboard summary error:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.error ||
                    "Unable to load dashboard summary. Check your backend URL and authentication."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-600">
                {error}
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="p-6">
                No dashboard data available.
            </div>
        );
    }

    const leaveSummary = summary.leaveSummary || {};

    return (
        <div className="p-6">
            {/* Dashboard Heading */}
            <div className="flex items-center justify-center">
                <h3 className="text-2xl font-bold">
                    Admin Dashboard Analytics
                </h3>
            </div>

            {/* Employee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <SummaryCards
                    icon={<FaUser />}
                    text="Total Employees"
                    number={summary.totalEmployees ?? 0}
                    color="bg-blue-500"
                />

                <SummaryCards
                    icon={<FaBuilding />}
                    text="Total Departments"
                    number={summary.totalDepartments ?? 0}
                    color="bg-gray-500"
                />

                <SummaryCards
                    icon={<FaMoneyBill />}
                    text="Total Salary"
                    number={Number(summary.totalSalary ?? 0).toLocaleString()}
                    color="bg-green-600"
                />
            </div>

            {/* Leave Summary */}
            <div className="mt-12">
                <div className="flex items-center justify-center">
                    <h3 className="text-2xl font-bold">
                        Employee Leave Details
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <SummaryCards
                        icon={<FaFileAlt />}
                        text="Leave Applied"
                        number={leaveSummary.appliedFor ?? 0}
                        color="bg-yellow-500"
                    />

                    <SummaryCards
                        icon={<FaCheckCircle />}
                        text="Leave Approved"
                        number={leaveSummary.approved ?? 0}
                        color="bg-teal-500"
                    />

                    <SummaryCards
                        icon={<FaHourglassHalf />}
                        text="Leave Pending"
                        number={leaveSummary.pending ?? 0}
                        color="bg-pink-600"
                    />

                    <SummaryCards
                        icon={<FaRegTimesCircle />}
                        text="Leave Rejected"
                        number={leaveSummary.rejected ?? 0}
                        color="bg-red-600"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminSummary;