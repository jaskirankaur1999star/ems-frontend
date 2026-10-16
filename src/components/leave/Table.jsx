import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { columns } from "../../utils/LeaveHelper";

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("http://localhost:3000/api/leave/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const data = response.data.leaves.map((leave, index) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);

          const validDates =
            !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime());

          const days = validDates
            ? Math.max(
                0,
                Math.floor(
                  (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
                    Date.UTC(
                      start.getFullYear(),
                      start.getMonth(),
                      start.getDate(),
                    )) /
                    86400000,
                ) + 1,
              )
            : 0;

          return {
            _id: leave._id,
            sno: index + 1,
            employeeId: leave.employeeId?.employeeId ?? "N/A",
            name: leave.employeeId?.userId?.name ?? "N/A",
            leaveType: leave.leaveType,
            department: leave.employeeId?.department?.dep_name ?? "N/A",
            days,
            status: leave.status,
          };
        });

        setLeaves(data);
      } else {
        setError(response.data.error || "Failed to fetch leaves");
      }
    } catch (err) {
      console.error("Fetch leaves error:", err);
      setError(err.response?.data?.error || "Unable to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Search by employee ID, name, leave type, or department.
  // Apply the selected status filter as well.
  const filteredLeaves = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leaves.filter((leave) => {
      const matchesSearch = [
        leave.employeeId,
        leave.name,
        leave.leaveType,
        leave.department,
        leave.status,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      );

      const matchesStatus =
        !statusFilter ||
        String(leave.status ?? "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [leaves, search, statusFilter]);

  if (loading) {
    return <div className="p-6">Loading leave requests...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchLeaves}
          className="mt-3 rounded bg-blue-600 px-3 py-1 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="my-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by employee, ID, leave type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border px-4 py-2 outline-none focus:border-blue-500"
        />

        {/* Status filter buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setStatusFilter("Pending")}
            className={`rounded px-3 py-2 text-white ${
              statusFilter === "Pending"
                ? "bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setStatusFilter("Approved")}
            className={`rounded px-3 py-2 text-white ${
              statusFilter === "Approved"
                ? "bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setStatusFilter("Rejected")}
            className={`rounded px-3 py-2 text-white ${
              statusFilter === "Rejected"
                ? "bg-red-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Rejected
          </button>

          {/* Show all leaves */}
          <button
            onClick={() => setStatusFilter("")}
            className={`rounded px-3 py-2 text-white ${
              statusFilter === ""
                ? "bg-gray-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            All
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeaves}
        pagination
        keyField="_id"
        noDataComponent="No leave requests found."
      />
    </div>
  );
};

export default Table;
