import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const AddDepartment = () => {
    const [department, setDepartment] = useState({
        dep_name: '',
        description: ''
    })
    const navigate = useNavigate()
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setDepartment({ ...department, [name]: value })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()
        try {

            const response = await axios.post("http://localhost:3000/api/department/add",department,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );


            if (response.data.success) {
                navigate("/admin-dashboard/departments")
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
                <h2 className="text-2xl font-bold text-center mb-8">Add Departments</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="" className='text-sm font-medium text-gray-500'>Department Name:</label>
                        <input type='text' name="dep_name" placeholder='Enter Department Name' className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange} />
                    </div>
                    <div className='mt-2 mb-2'>
                        <label htmlFor="" className='text-sm font-medium text-gray-500'>Department Information:</label>
                        <textarea placeholder='Enter Department Description' name="description" className='mt-1 w-full p-2 border border-gray-300 rounded-md ' onChange={handleChange}></textarea>
                    </div>
                    <button type='submit' className='w-full bg-blue-600 hoverLbg-blue-500 text-white font-medium py-2 px-4 rounded'>Add Department</button>
                </form>
            </div>
        </div>
    )
}

export default AddDepartment