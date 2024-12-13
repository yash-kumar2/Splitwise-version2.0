import React from 'react';
import { TextField } from '@mui/material';

const MemberTable = ({ members, memberAmounts, handleAmountChange }) => {
  return (
    <div className="mt-5 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-2">Member Contributions</h3>
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b border-gray-300">Name</th>
            <th className="py-2 px-4 border-b border-gray-300">Email</th>
            <th className="py-2 px-4 border-b border-gray-300">Amount</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.email} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="py-2 px-4 border-b border-gray-300">{member.name}</td>
              <td className="py-2 px-4 border-b border-gray-300 text-sm">{member.email}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                <TextField
                  type="number"
                  value={memberAmounts[member.email] || 0}
                  onChange={(e) => handleAmountChange(member.email, e.target.value)}
                  variant="standard"
                  inputProps={{ min: 0 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
