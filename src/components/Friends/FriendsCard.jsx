import React from 'react';

const FriendsCard = ({ friendData }) => {
  const { friend, balance } = friendData;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-xl">{friend.userId}</h2>
          <p className="text-gray-500">{friend.email}</p>
        </div>
        <div className={`text-lg font-semibold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {balance >= 0 ? (
            <span>You are owed ${balance}</span>
          ) : (
            <span>You owe ${Math.abs(balance)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsCard;