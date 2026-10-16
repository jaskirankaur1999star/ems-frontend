import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const List = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { id } = useParams();
    const location = useLocation();

    // Admin route contains an employee ID.
    const isAdminView = location.pathname.startsWith(
        '/admin-dashboard/employee/leaves'
    );

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                setLoading(true);
                setError('');

                const token = localStorage.getItem('token');

                const url = isAdminView
                    ? `http://localhost:3000/api/leave/employee/${id}`
                    : 'http://localhost:3000/api/leave';

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setLeaves(response.data.leaves || []);
                } else {
                    setError(
                        response.data.error || 'Failed to fetch leaves'
                    );
                }
            } catch (err) {
                console.error(
                    'Fetch leaves error:',
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.error ||
                    'Failed to fetch leave history'
                );
            } finally {
                setLoading(false);
            }
        };

        if (!isAdminView || id) {
            fetchLeaves();
        }
    }, [id, isAdminView]);

    if (loading) {
        return <div className="p-6">Loading leave history...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    return (
        <div className="p-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold">
                    {isAdminView
                        ? 'Employee Leave History'
                        : 'My Leave History'}
                </h3>
            </div>

            {!isAdminView && (
                <div className="my-4">
                    <Link
                        to="/employee-dashboard/add-leave"
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                    >
                        Add New Leave
                    </Link>
                </div>
            )}

            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="border-b bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="px-4 py-3">S No.</th>
                            <th className="px-4 py-3">Leave Type</th>
                            <th className="px-4 py-3">From</th>
                            <th className="px-4 py-3">To</th>
                            <th className="px-4 py-3">Applied Date</th>
                            <th className="px-4 py-3">Reason</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {leaves.length > 0 ? (
                            leaves.map((leave, index) => (
                                <tr
                                    key={leave._id}
                                    className="border-b bg-white"
                                >
                                    <td className="px-4 py-3">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        {leave.leaveType}
                                    </td>
                                    <td className="px-4 py-3">
                                        {leave.startDate
                                            ? new Date(
                                                  leave.startDate
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {leave.endDate
                                            ? new Date(
                                                  leave.endDate
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {leave.appliedAt
                                            ? new Date(
                                                  leave.appliedAt
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {leave.reason || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={
                                                leave.status === 'Approved'
                                                    ? 'font-semibold text-green-600'
                                                    : leave.status === 'Rejected'
                                                    ? 'font-semibold text-red-600'
                                                    : 'font-semibold text-yellow-600'
                                            }
                                        >
                                            {leave.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-6 text-center"
                                >
                                    No leave history found for this employee.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default List;