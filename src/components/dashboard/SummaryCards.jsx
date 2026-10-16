import React from 'react'

const SummaryCards = ({ icon, text, number,color }) => {
    return (
        <div className='w-full rounded flex bg-white'>
            <div className={`rounded text-3xl flex justify-center items-center ${color} text-white px-4`}>
                {icon}
            </div>
            <div className="flex-1 flex justify-between items-center px-4 py-4">
                <p className="text-lg font-semibold">{text}</p>
                <span className="text-xl font-bold">{number}</span>
            </div>
        </div>
    )
}

export default SummaryCards