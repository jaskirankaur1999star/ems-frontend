import { useNavigate } from "react-router-dom";
import axios from "axios";

export const columns = [
  {
    name: "S No.",
    selector: (row) => row.sno,
    sortable: true,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
    sortable: true,
  },
   {
    name: "Department Description",
    selector: (row) => row.description,
    
  },

];

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Do you want to delete this department?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `https://ems-api-roan.vercel.app/api/department/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        onDepartmentDelete(_id);
        window.location.reload();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Delete Failed");
    }
  };

  return (
    <div className="flex gap-2 bg-red-100">
      <button
        className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>

      <button
        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};