import React, { useEffect, useState } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();
  // const { id } = useParams();

  const [salary, setSalary] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: "",
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

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
        const response = await axios.get(`http://localhost:3000/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // if (response.data.success) {
        //     setEmployee(response.data.employee);
        // }
      } catch (error) {
        console.log(error);

        if (error.response) {
          alert(error.response.data.error || "Failed to fetch employee");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  const handleDepartment = async (e) => {
    const departmentId = e.target.value;

    setEmployees([]);
    setSalary((prev) => ({
      ...prev,
      employeeId: "",
    }));

    if (!departmentId) return;

    setLoading(true);

    try {
      const data = await getEmployees(departmentId);
      setEmployees(data);
      console.log("Employees received:", data);
    } catch (error) {
      console.error(
        "Failed to load employees:",
        error.response?.data || error.message,
      );
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSalary((prev) => ({
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

   // if (!employee) return;

    setSaving(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/salary/add`,
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        alert("Employee updated successfully");
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.error || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  // Loading
  // if (loading) {
  //     return (
  //         <div className="text-center mt-20 text-lg">
  //             Loading employee details...
  //         </div>
  //     );
  // }

  // // Employee not found
  // if (!employee) {
  //     return (
  //         <div className="text-center mt-20 text-red-500">
  //             Employee not found
  //         </div>
  //     );
  // }

  return (
    <div className="justify-center items-center">
      <div className="max-w-2xl mx-auto mt-20 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center mb-8">Add Salary</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Department:
              </label>

              <select
                required
                name="department"
                // value={
                //     employee.department?._id ||
                //     employee.department ||
                //     ""
                // }
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                onChange={handleDepartment}
              >
                <option value="">Select Department</option>

                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.dep_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee */}

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Employee:
              </label>

              <select
                required
                name="employeeId"
                value={salary.employeeId}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                onChange={handleChange}
                disabled={loading || employees.length === 0}
              >
                <option value="">
                  {loading
                    ? "Loading employees..."
                    : employees.length === 0
                      ? "No employees found"
                      : "Select Employee"}
                </option>

                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.userId?.name || "Name unavailable"} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            {/* <div>
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
                        </div> */}

            {/* Employee ID */}
            {/* <div>
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
                        </div> */}

            {/* DOB */}
            {/* <div>
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
                        </div> */}

            {/* Gender */}
            {/* <div>
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
                        </div> */}

            {/* Marital Status */}
            {/* <div>
                            <label className="block text-sm font-medium text-gray-500">
                                Basic Salary:
                            </label>

                            <select
                                required
                                name="basicSalary"
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
                        </div> */}

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Basic Salary:
              </label>

              <input
                required
                type="number"
                name="basicSalary"
                placeholder="Basic Salary"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                onChange={handleChange}
              />
            </div>

            {/* Allowances */}
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Allowances
              </label>

              <input
                required
                type="number"
                name="allowances"
                placeholder="Allowances"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                onChange={handleChange}
              />
            </div>

            {/* Deductions */}
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Deductions
              </label>

              <input
                required
                type="number"
                name="deductions"
                placeholder="Deductions"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                onChange={handleChange}
              />
            </div>

            {/* Pay Date */}
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Pay Date
              </label>

              <input
                required
                type="date"
                name="payDate"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                onChange={handleChange}
              />
            </div>

            {/* Role */}
            {/* <div>
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
                        </div> */}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            {saving ? "Saving..." : "Add Salary"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
