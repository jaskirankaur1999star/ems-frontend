import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://ems-api-seven.vercel.app/api";

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
        selector: (row) => row.userId?.name || row.name || "N/A",
        sortable: true,
    },
    {
        name: "Image",
        cell: (row) => {
            const profileImage = row.userId?.profileImage || row.profileImage;

            if (!profileImage) {
                return (
                    <span className="text-gray-500 text-sm">
                        No Image
                    </span>
                );
            }

            // GridFS image ID is stored in MongoDB.
            // Older records may still contain a local filename.
            const isObjectId = /^[a-f\d]{24}$/i.test(profileImage);

            const imageUrl = isObjectId
                ? `${API_URL}/employee/image/${profileImage}`
                : `${window.location.origin}/default-avatar.png`;

            return (
                <img
                    src={imageUrl}
                    alt={row.userId?.name || row.name || "Employee"}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-avatar.png";
                    }}
                />
            );
        },
        ignoreRowClick: true,
        width: "100px",
    },
    {
        name: "Department",
        selector: (row) =>
            row.department?.dep_name ||
            row.dep_name ||
            "N/A",
        sortable: true,
    },
    {
        name: "DOB",
        selector: (row) =>
            row.dob
                ? new Date(row.dob).toLocaleDateString()
                : "N/A",
        sortable: true,
    },
];

// =========================
// FETCH DEPARTMENTS
// =========================

export const fetchDepartments = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/department`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (response.data.success) {
            return response.data.departments || [];
        }

        return [];
    } catch (error) {
        console.error(
            "Fetch departments error:",
            error.response?.data || error.message
        );

        return [];
    }
};

// =========================
// GET EMPLOYEES FOR SALARY FORM
// =========================

export const getEmployees = async (id) => {
    if (!id) {
        return [];
    }

    try {
        const response = await axios.get(
            `${API_URL}/employee/department/${id}`,
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
        console.error(
            "Fetch employees error:",
            error.response?.data || error.message
        );

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

        if (!confirmed) {
            return;
        }

        try {
            const response = await axios.delete(
                `${API_URL}/employee/${_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                alert("Employee deleted successfully!");

                // Refresh the employee list.
                window.location.reload();
            } else {
                alert(
                    response.data.error ||
                    "Failed to delete employee."
                );
            }
        } catch (error) {
            console.error(
                "Delete employee error:",
                error.response?.data || error.message
            );

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