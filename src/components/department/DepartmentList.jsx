import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { DepartmentButtons, columns } from "../../utils/DepartmentHelpers";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filterDepartments,setFilterDepartments] = useState([])

  // Fetch Departments
  const fetchDepartments = async () => {
    setDepLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:3000/api/department",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const data = response.data.departments.map((dep, index) => ({
          _id: dep._id,
          sno: index + 1,
          dep_name: dep.dep_name,
          description:dep.description
        }));

        setDepartments(data);
        setFilterDepartments(data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDepLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Remove deleted department from table
  const onDepartmentDelete = (id) => {
    setDepartments((prevDepartments) =>
      prevDepartments.filter((dep) => dep._id !== id)
    );
  };

  const handleFilter = (e) => {
    const records = departments.filter((dep)=>dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase()))
    setFilterDepartments(records)
  }

  // Table Columns
  const tableColumns = [
    ...columns,
    {
      name: "Action",
      cell: (row) => (
        <DepartmentButtons
          _id={row._id}
          onDepartmentDelete={onDepartmentDelete}
        />
      ),
      width: "250px",   // Increase this
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      {depLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-6">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-center mb-8">
            Departments
          </h2>

          {/* Search & Add Button */}
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search Department"
              className="w-80 px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" onChange={handleFilter}
            />

            <Link
              to="/admin-dashboard/add-department"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
            >
              Add New Department
            </Link>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow p-4">
            <DataTable
              columns={tableColumns}
              data={filterDepartments}
              pagination
              highlightOnHover
              responsive
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;