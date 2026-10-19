import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    columns,
    EmployeeButtons
} from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";
import axios from "axios";

const List = () => {

    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(false);
    const [search, setSearch] = useState("");

    // =========================
    // FETCH EMPLOYEES
    // =========================

    const fetchEmployees = async () => {
        setEmpLoading(true);
        try {
            const response = await axios.get(
                "https://ems-api-seven.vercel.app/api/employee",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("Employee Response:", response.data);
            if (response.data.success) {
                const data = response.data.employees.map(
                    (emp, index) => ({
                        _id: emp._id,
                        sno: index + 1,

                        name: emp.userId
                            ? emp.userId.name
                            : "N/A",
                        profileImage: emp.userId
                            ? emp.userId.profileImage
                            : "",
                        dep_name: emp.department
                            ? emp.department.dep_name
                            : "N/A",
                        dob: emp.dob
                            ? new Date(emp.dob).toLocaleDateString()
                            : "N/A",
                    })
                );
                setEmployees(data);
            }
        } catch (error) {
            console.log("Employee Error:", error);
            console.log("Backend Error:",error.response?.data);
        } finally {
            setEmpLoading(false);
        }
    };


    // =========================
    // USE EFFECT
    // =========================

    useEffect(() => {

        fetchEmployees();

    }, []);


    // =========================
    // SEARCH
    // =========================

    const filteredEmployees = employees.filter((employee) => {

        const searchText = search.toLowerCase();

        return (
            employee.name
                ?.toLowerCase()
                .includes(searchText) ||

            employee.dep_name
                ?.toLowerCase()
                .includes(searchText)
        );

    });


    // =========================
    // TABLE COLUMNS
    // =========================

    const tableColumns = [

        ...columns,

        {
            name: "Action",

            cell: (row) => (

                <EmployeeButtons
                    _id={row._id}
                />

            ),

            width: "370px",

            ignoreRowClick: true,

            allowOverflow: true,

            button: true,
        },

    ];


    return (

        <div className="p-6">

            {/* Heading */}

            <h2 className="text-3xl font-bold text-center mb-8">
                Manage Employees
            </h2>


            {/* Search & Add Button */}

            <div className="flex items-center justify-between mb-6">

                <input
                    type="text"
                    placeholder="Search Employees"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-80 px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />


                <Link
                    to="/admin-dashboard/add-employee"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
                >
                    Add New Employee
                </Link>

            </div>


            {/* Data Table */}

            <div className="bg-white rounded-lg shadow p-4">

                {empLoading ? (

                    <div className="text-center py-10">
                        Loading employees...
                    </div>

                ) : (

                    <DataTable
                        columns={tableColumns}
                        data={filteredEmployees}
                        pagination
                        highlightOnHover
                        responsive
                    />

                )}

            </div>

        </div>

    );
};

export default List;