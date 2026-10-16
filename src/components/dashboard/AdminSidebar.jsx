import React from 'react'
import { NavLink } from 'react-router-dom'
import {FaBuilding, FaCalendar, FaMoneyBill, FaTachometerAlt, FaUser, FaCogs} from 'react-icons/fa'
const AdminSidebar = () => {
  return (
    <div className='bg-gray-800 text-white h-screen fixed left-0 top-0 botton-0 space-y-2 w-64'>
        <div className='bg-blue-600 h-12 flex items-center justify-center font-bold'>
            <h3>Pentagon EMS</h3>
        </div>
        <div className='px-1'>
            <NavLink to="/admin-dashboard" className={({isActive})=> `${isActive ? "bg-white text-black":" "} flex items-center space-x-4 block py-2.5 px-4 rounded`} end>
                <FaTachometerAlt />
                <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin-dashboard/employees" className={({isActive})=> `${isActive ? "bg-white text-black":" "} flex items-center space-x-4 block py-2.5 px-4 rounded`} end>
                <FaUser />
                <span>Employee</span>
            </NavLink>
             <NavLink to="/admin-dashboard/departments" className={({isActive})=> `${isActive ? "bg-white text-black":" "} flex items-center space-x-4 block py-2.5 px-4 rounded`} end >
                <FaBuilding />
                <span>Departments</span>
            </NavLink>
              <NavLink to="/admin-dashboard/leaves" className={({isActive})=> `${isActive ? "bg-white text-black":" "} flex items-center space-x-4 block py-2.5 px-4 rounded`} end >
                <FaCalendar />
                <span>Leaves</span>
            </NavLink>
              <NavLink to="/admin-dashboard/salary/add" className={({isActive})=> `${isActive ? "bg-white text-black":" "} flex items-center space-x-4 block py-2.5 px-4 rounded`} end >
                <FaMoneyBill />
                <span>Salary</span>
            </NavLink>
              <NavLink to="/admin-dashboard/setting" className="flex items-center space-x-4 block py-2.5 px-4 rounded">
                <FaCogs />
                <span>Settings</span>
            </NavLink>
        </div>
    </div>
  )
}

export default AdminSidebar