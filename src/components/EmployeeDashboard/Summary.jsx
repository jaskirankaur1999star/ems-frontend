import React from "react";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Summary = () => {
  const { user } = useAuth();
  return (
    <div className="p-4">
      <div className="w-full rounded flex bg-white">
        <div className={`rounded text-3xl flex justify-center items-center bg-blue-600 text-white px-4`}>
          {<FaUser />}
        </div>
        <div className="flex-1 flex justify-between items-center px-4 py-4">
          <p className="text-lg font-semibold">
            Welcome Back:
            <span className="text-xl font-bold"> {user.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
