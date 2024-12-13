import React from 'react';

const ExpenseCard = ({ expense }) => {
  console.log(expense)
  console.log("cnsnfsdfksdjf")
  const date = new Date(expense.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-start mb-4">
      <div className="w-24 text-left mr-1">
        <div className="text-lg font-bold">{formattedDate.split(' ')[1]}</div>
        <div className="text-sm text-gray-600">{month}</div>
        <div className="text-sm text-gray-600">{formattedTime}</div>
      </div>
      <div className="flex-1 bg-white p-4 shadow rounded">
        <h3 className="text-lg font-bold mb-2">{expense.description}</h3>
        <p className="text-sm">
          {expense.amount < 0 
            ? `You paid ${expense.for.name} ₹${expense.amount}` 
            : `${expense.for.name} paid you ₹${-expense.amount}`
          }
        </p>
      </div>
    </div>
  );
};

export default ExpenseCard;
