import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const View = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchEmployee = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `http://localhost:3000/api/employee/${id}`,
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                     },
    //                 }
    //             );

    //             if (response.data.success) {
    //                 setEmployee(response.data.employee);
    //             }
    //         } catch (error) {
    //             console.log(error);

    //             if (error.response) {
    //                 alert(
    //                     error.response.data.error ||
    //                     "Failed to fetch employee"
    //                 );
    //             }
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchEmployee();
    // }, [id]);


    
useEffect(() => {
    const fetchEmployee = async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `https://ems-api-seven.vercel.app/api/employee/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success && response.data.employee) {
                setEmployee(response.data.employee);
            } else {
                setEmployee(null);
            }
        } catch (error) {
            console.error(
                "Fetch employee error:",
                error.response?.status,
                error.response?.data || error.message
            );
            setEmployee(null);
        } finally {
            setLoading(false);
        }
    };

    fetchEmployee();
}, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="text-center mt-20 text-lg">
                Loading employee details...
            </div>
        );
    }

    // If employee not found
    if (!employee) {
        return (
            <div className="text-center mt-20 text-red-500">
                Employee not found
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">

            <h2 className="text-2xl font-bold mb-8 text-center">
                Employee Details
            </h2>

            {/* Employee Image */}
            <div className="flex justify-center mb-8">
                {employee.userId?.profileImage ? (
                    <img
                        src={`https://ems-api-seven.vercel.app/uploads/${employee.userId.profileImage}`}
                        alt={employee.userId.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        No Image
                    </div>
                )}
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Name:
                    </p>
                    <p className="font-medium">
                        {employee.userId?.name}
                    </p>
                </div>

                {/* Employee ID */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Employee ID:
                    </p>
                    <p className="font-medium">
                        {employee.employeeId}
                    </p>
                </div>

                {/* Email */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Email:
                    </p>
                    <p className="font-medium">
                        {employee.userId?.email}
                    </p>
                </div>

                {/* DOB */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Date of Birth:
                    </p>
                    <p className="font-medium">
                        {employee.dob
                            ? new Date(employee.dob).toLocaleDateString()
                            : "N/A"}
                    </p>
                </div>

                {/* Gender */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Gender:
                    </p>
                    <p className="font-medium">
                        {employee.gender}
                    </p>
                </div>

                {/* Marital Status */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Marital Status:
                    </p>
                    <p className="font-medium">
                        {employee.maritalStatus}
                    </p>
                </div>

                {/* Designation */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Designation:
                    </p>
                    <p className="font-medium">
                        {employee.designation}
                    </p>
                </div>

                {/* Department */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Department:
                    </p>
                    <p className="font-medium">
                        {employee.department?.dep_name}
                    </p>
                </div>

                {/* Salary */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Salary:
                    </p>
                    <p className="font-medium">
                        ₹{employee.salary}
                    </p>
                </div>

                {/* Role */}
                <div className="flex space-x-3">
                    <p className="text-lg font-bold">
                        Role:
                    </p>
                    <p className="font-medium">
                        {employee.userId?.role}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default View;