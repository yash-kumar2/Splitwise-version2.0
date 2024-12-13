import React from 'react';

const GroupsCard = ({ group }) => {
  // Calculate net debt and determine styling based on whether owed or owing
  // const netDebt = group.friends.reduce((acc, friend) => acc + friend.amount, 0);
  // const netDebtClass = netDebt > 0 ? 'text-green-500' : 'text-red-500';
  // const netDebtText = netDebt > 0 ? `You are owed $${netDebt}` : `You owe $${Math.abs(netDebt)}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
     
      <h2 className="font-bold text-xl mb-2">{group.groupName}</h2>
      
      {group.netBalance >= 0 ? (
  <h2 className='text-green-500'>You are owed {group.netBalance}</h2>
) : (
  <h2 className='text-red-500'>You owe {Math.abs(group.netBalance)}</h2>
)}
      

    
      
    </div>
  );
};

export default GroupsCard;
