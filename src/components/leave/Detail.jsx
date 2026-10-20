import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(
          `https://ems-api-seven.vercel.app/api/leave/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        // Backend returns { success: true, leave: ... }
        if (response.data.success && response.data.leave) {
          setLeave(response.data.leave);
        } else {
          setError("Leave request not found");
        }
      } catch (err) {
        console.error("Fetch leave error:", err.response?.data || err.message);

        setError(err.response?.data?.error || "Failed to fetch leave details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLeave();
    } else {
      setError("Leave ID is missing");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mt-20 text-center text-lg">Loading leave details...</div>
    );
  }

  if (error || !leave) {
    return (
      <div className="mt-20 text-center text-red-500">
        {error || "Leave request not found"}
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      setError("");

      const response = await axios.put(
        `https://ems-api-seven.vercel.app/api/leave/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        // Return to the admin leaves table after successful update
        navigate("/admin-dashboard/leaves");
      } else {
        setError(response.data.error || "Failed to update leave status");
      }
    } catch (err) {
      console.error("Update leave status error:", err);
      setError(err.response?.data?.error || "Unable to update leave status");
    } finally {
      setUpdating(false);
    }
  };

  const employee = leave.employeeId;
  const user = employee?.userId;
  const department = employee?.department;

  return (
    <div className="mx-auto mt-10 max-w-4xl rounded-md bg-white p-8 shadow-md">
      <h2 className="mb-8 text-center text-2xl font-bold">Leave Details</h2>

      {/* Employee image */}
      <div className="mb-8 flex justify-center">
        {user?.profileImage ? (
          <img
            src={
            employee.userId.profileImage
              ? `https://ems-api-seven.vercel.app/api/employee/image/${employee.userId.profileImage}`
              : "/default-avatar.png"
          }
            alt={user.name || "Employee"}
            className="h-32 w-32 rounded-full border-4 border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
            No Image
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DetailItem label="Name" value={user.name} />
        <DetailItem label="Employee ID" value={employee?.employeeId} />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Leave Type" value={leave.leaveType} />
        <DetailItem label="Reason" value={leave.reason} />
        <DetailItem label="Department" value={department?.dep_name} />
        <DetailItem label="Designation" value={employee?.designation} />
        <DetailItem
          label="Start Date"
          value={
            leave.startDate
              ? new Date(leave.startDate).toLocaleDateString()
              : "N/A"
          }
        />
        <DetailItem
          label="End Date"
          value={
            leave.endDate ? new Date(leave.endDate).toLocaleDateString() : "N/A"
          }
        />
        {error && <p className="mt-3 text-red-600">{error}</p>}

        {leave.status === "Pending" ? (
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold">Action:</p>

            <button
              onClick={() => handleStatusChange("Approved")}
              disabled={updating}
              className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {updating ? "Updating..." : "Approve"}
            </button>

            <button
              onClick={() => handleStatusChange("Rejected")}
              disabled={updating}
              className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {updating ? "Updating..." : "Reject"}
            </button>
          </div>
        ) : (
          <DetailItem label="Status" value={leave.status} />
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-wrap gap-2">
    <p className="text-lg font-bold">{label}:</p>
    <p className="font-medium">{value ?? "N/A"}</p>
  </div>
);

export default Detail;
