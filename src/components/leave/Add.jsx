import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Add = () => {
    const {user} = useAuth()
    // const [leave, setLeave] = useState({
    //     userId: user._id,
    // })

    const [leave, setLeave] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
});

    const navigate = useNavigate()
  const handleChange = (e) => {
    const {name, value} = e.target
    setLeave((prevState)=>({...prevState,[name]:value}))
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
     try {
            const response = await axios.post(
                `https://ems-api-roan.vercel.app/api/leave/add`,leave,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                navigate('/employee-dashboard/leaves')
            } 
        } catch (error) {
           if(error.response && !error.response.data.success)
           {
            alert(error.response.data.error)
           }
        } 
  }
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Request for Leave</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Leave Type */}
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-500"
            >
              Leave Type
            </label>
            <select
              name="leaveType"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
              onChange={handleChange}
            >
              <option value="">Select Type of Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
            </select>
          </div>
          {/* Start Date */}
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-500"
            >
              Leave Start Date
            </label>
            <input
              required
              type="date"
              name="startDate"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md "
              onChange={handleChange}
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-500"
            >
            Leave End Date
            </label>
            <input
              required
              type="date"
              name="endDate"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md "
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-500 ">
              Reason for Leave
            </label>
            <textarea
              name="reason"
              placeholder="Enter Reason of Leave..."
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md "
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="mt-3 w-full bg-blue-600 hoverLbg-blue-500 text-white font-medium py-2 px-4 rounded"
        >
          Add Leave
        </button>
      </form>
    </div>
  );
};

export default Add;
