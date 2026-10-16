import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const {user, logout} = useAuth()
  return (
    <div className='flex justify-between h-12 bg-blue-500 justify-between items-center px-5 '>
        <p className='text-white font-medium'>Welcome {user.name}</p>
        <button className='px-4 py-1 bg-blue-600 text-white hover:bg-blue-700' onClick={logout}>Logout</button>
    </div>
  )
}

export default Navbar