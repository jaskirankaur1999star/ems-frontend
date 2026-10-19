import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [employee, setEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch Departments
    useEffect(() => {
        const getDepartments = async () => {
            try {
                const data = await fetchDepartments();
                setDepartments(data || []);
            } catch (error) {
                console.log(error);
                setDepartments([]);
            }
        };

        getDepartments();
    }, []);

    // Fetch Employee
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(
                    `https://ems-api-seven.vercel.app/api/employee/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (response.data.success) {
                    setEmployee(response.data.employee);
                }
            } catch (error) {
                console.log(error);

                if (error.response) {
                    alert(
                        error.response.data.error ||
                            "Failed to fetch employee"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle User fields separately
    const handleUserChange = (e) => {
        const { name, value } = e.target;

        setEmployee((prev) => ({
            ...prev,
            userId: {
                ...prev.userId,
                [name]: value,
            },
        }));
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employee) return;

        setSaving(true);

        try {
            const response = await axios.put(
                `https://ems-api-seven.vercel.app/api/employee/${id}`,
                {
                    name: employee.userId.name,
                    email: employee.userId.email,
                    employeeId: employee.employeeId,
                    dob: employee.dob,
                    gender: employee.gender,
                    maritalStatus: employee.maritalStatus,
                    designation: employee.designation,
                    department:
                        employee.department?._id || employee.department,
                    salary: employee.salary,
                    role: employee.userId.role,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (response.data.success) {
                alert("Employee updated successfully");
                navigate("/admin-dashboard/employees");
            }
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.error ||
                    "Failed to update employee"
            );
        } finally {
            setSaving(false);
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="text-center mt-20 text-lg">
                Loading employee details...
            </div>
        );
    }

    // Employee not found
    if (!employee) {
        return (
            <div className="text-center mt-20 text-red-500">
                Employee not found
            </div>
        );
    }

    return (
        <div className="justify-center items-center">
            <div className="max-w-2xl mx-auto mt-20 bg-white p-8 rounded-md shadow-md">

                <h2 className="text-2xl font-bold text-center mb-8">
                    Edit Employee
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Name:
                            </label>

                            <input
                                required
                                type="text"
                                name="name"
                                value={employee.userId?.name || ""}
                                placeholder="Enter Employee Name"
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleUserChange}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Email:
                            </label>

                            <input
                                required
                                type="email"
                                name="email"
                                value={employee.userId?.email || ""}
                                placeholder="Enter Employee Email"
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleUserChange}
                            />
                        </div>

                        {/* Employee ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Employee ID:
                            </label>

                            <input
                                required
                                type="text"
                                name="employeeId"
                                value={employee.employeeId || ""}
                                placeholder="Enter Employee ID"
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleChange}
                            />
                        </div>

                        {/* DOB */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Date of Birth:
                            </label>

                            <input
                                required
                                type="date"
                                name="dob"
                                value={
                                    employee.dob
                                        ? new Date(employee.dob)
                                              .toISOString()
                                              .split("T")[0]
                                        : ""
                                }
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Gender:
                            </label>

                            <select
                                required
                                name="gender"
                                value={employee.gender || ""}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Gender
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* Marital Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Marital Status:
                            </label>

                            <select
                                required
                                name="maritalStatus"
                                value={employee.maritalStatus || ""}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Status
                                </option>

                                <option value="Single">
                                    Single
                                </option>

                                <option value="Married">
                                    Married
                                </option>
                            </select>
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Designation:
                            </label>

                            <input
                                required
                                type="text"
                                name="designation"
                                value={employee.designation || ""}
                                placeholder="Designation"
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Department:
                            </label>

                            <select
                                required
                                name="department"
                                value={
                                    employee.department?._id ||
                                    employee.department ||
                                    ""
                                }
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select Department
                                </option>

                                {departments.map((dep) => (
                                    <option
                                        key={dep._id}
                                        value={dep._id}
                                    >
                                        {dep.dep_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Salary:
                            </label>

                            <input
                                required
                                type="number"
                                name="salary"
                                value={employee.salary || ""}
                                placeholder="Salary"
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Role:
                            </label>

                            <select
                                required
                                name="role"
                                value={employee.userId?.role || ""}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                onChange={handleUserChange}
                            >
                                <option value="employee">
                                    Employee
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                    >
                        {saving ? "Updating..." : "Update Employee"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Edit;