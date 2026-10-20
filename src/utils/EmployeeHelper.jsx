import axios from "axios";
import { useNavigate } from "react-router-dom";

// =========================
// TABLE COLUMNS
// =========================

export const columns = [
    {
        name: "S No.",
        selector: (row) => row.sno,
        sortable: true,
    },

    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
    },

    {
        name: "Image",
        cell: (row) =>
            row.profileImage ? (
                <img
                   src={
    employee.userId.profileImage
        ? `https://ems-api-seven.vercel.app/api/employee/image/${employee.userId.profileImage}`
        : "/default-avatar.png"
}
                    alt={row.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
            ) : (
                <span>No Image</span>
            ),
    },

    {
        name: "Department",
        selector: (row) => row.dep_name,
        sortable: true,
    },

    {
        name: "DOB",
        selector: (row) => row.dob,
        sortable: true,
    },
];

// =========================
// FETCH DEPARTMENTS
// =========================

export const fetchDepartments = async () => {
    let departments = [];

    try {
        const response = await axios.get(
            "https://ems-api-seven.vercel.app/api/department",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (response.data.success) {
            departments = response.data.departments || [];
        }
    } catch (error) {
        console.error("Fetch departments error:", error);
    }

    return departments;
};

// =========================
// GET EMPLOYEES FOR SALARY FORM
// =========================

export const getEmployees = async (id) => {
    if (!id) return [];

    try {
        const response = await axios.get(
            `https://ems-api-seven.vercel.app/api/employee/department/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (response.data.success) {
            return response.data.employees || [];
        }

        return [];
    } catch (error) {
        console.error("Fetch employees error:", error);
        return [];
    }
};

// =========================
// EMPLOYEE BUTTONS
// =========================

export const EmployeeButtons = ({ _id }) => {
    const navigate = useNavigate();

    // =========================
    // DELETE EMPLOYEE
    // =========================

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmed) return;

        try {
            const response = await axios.delete(
                `https://ems-api-seven.vercel.app/api/employee/${_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                alert("Employee deleted successfully!");

                // Refresh the employee list
                window.location.reload();
            } else {
                alert(
                    response.data.error ||
                    "Failed to delete employee."
                );
            }
        } catch (error) {
            console.error("Delete employee error:", error);

            alert(
                error.response?.data?.error ||
                "Failed to delete employee. Please try again."
            );
        }
    };

    // =========================
    // BUTTONS
    // =========================

    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            {/* View */}
            <button
                type="button"
                className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded"
                onClick={() =>
                    navigate(`/admin-dashboard/employee/${_id}`)
                }
            >
                View
            </button>

            {/* Edit */}
            <button
                type="button"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={() =>
                    navigate(`/admin-dashboard/employee/edit/${_id}`)
                }
            >
                Edit
            </button>

            {/* Salary */}
            <button
                type="button"
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                onClick={() =>
                    navigate(`/admin-dashboard/employee/salary/${_id}`)
                }
            >
                Salary
            </button>

            {/* Leave */}
            <button
                type="button"
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                onClick={() =>
                    navigate(`/admin-dashboard/employee/leaves/${_id}`)
                }
            >
                Leave
            </button>

            {/* Delete */}
            <button
                type="button"
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={handleDelete}
            >
                Delete
            </button>
        </div>
    );
};