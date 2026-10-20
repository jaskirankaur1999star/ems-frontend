import React, { useEffect, useState } from 'react'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Add = () => {
     const navigate = useNavigate();
    const [departments, setDepartments] = useState([])
    const [formData, setFormData] = useState({})
    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments()
            setDepartments(departments)
        }

        getDepartments()
    }, [])


    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === "image") {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }))
        }
        else {
            setFormData((prevData) => ({ ...prevData, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formDataObj = new FormData()
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key])
        })
        try {

            const response = await axios.post("https://ems-api-seven.vercel.app/api/employee/add", formDataObj, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
            );


            if (response.data.success) {
                navigate("/admin-dashboard/employees")
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                console.log(error.response);
                console.log(error.response?.data);
                console.log(error.message);
            }
        }
    }
    return (
        <div className='justify-center items-center'>
            <div className=' max-w-2xl mx-auto mt-20 bg-white p-8 rounded-md shadow-md w-92 '>
                <h2 className="text-2xl font-bold text-center mb-8">Add Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Name */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Name:</label>
                            <input required type='text' name="name" placeholder='Enter Employee Name' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} />
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Email:</label>
                            <input required type='email' name="email" placeholder='Enter Employee Email' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} />
                        </div>
                        {/* Employee ID */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Employee ID:</label>
                            <input required type='text' name="employeeId" placeholder='Enter Employee ID' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} />
                        </div>
                        {/* DOB */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Date of Birth:</label>
                            <input required type='date' name="dob" placeholder='DOB' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} />
                        </div>
                        {/* Gender */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Gender</label>
                            <select name="gender" className='mt-1 w-full p-2 border border-gray-300 rounded-md' required onChange={handleChange}>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {/* Marital Status */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Marital Status</label>
                            <select name="maritalStatus" className='mt-1 w-full p-2 border border-gray-300 rounded-md' required onChange={handleChange}>
                                <option value="">Select Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>

                            </select>
                        </div>
                        {/* Designation */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Designation</label>
                            <input required type='text' name="designation" placeholder='Designation' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} />
                        </div>
                        {/* Department */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Department</label>
                            <select required name="department" className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} >
                                <option value="">Select Department</option>
                                {departments.map(dep => (
                                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Salary */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Salary</label>
                            <input required type='number' name="salary" placeholder='Designation' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} />
                        </div>
                        {/* Password */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Password</label>
                            <input required type='password' name="password" placeholder='*********' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} />
                        </div>
                        {/* Role */}
                        <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Role</label>
                            <select required name="role" className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange}>
                                <option value="admin">Admin</option>
                                <option value="employee">Employee</option>
                            </select>
                        </div>
                        {/* Image Upload */}
                        {/* <div>
                            <label htmlFor="" className='block text-sm font-medium text-gray-500'>Upload Profile Image:</label>
                            <input required type='file' name="image" placeholder='Upload Image' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' accept='image/*' onChange={handleChange} />
                        </div> */}


                    </div>

                    <button type='submit' className='mt-3 w-full bg-blue-600 hoverLbg-blue-500 text-white font-medium py-2 px-4 rounded'>Add Employee</button>
                </form>
            </div>
        </div>
    )
}

export default Add