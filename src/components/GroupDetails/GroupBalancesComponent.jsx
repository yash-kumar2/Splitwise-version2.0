import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';


const GroupBalancesComponent = () => {
  const [balancesData, setBalancesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const { id: groupId } = useParams();
  const BASEURL = 'http://localhost:3000';

  useEffect(() => {
    const fetchGroupBalances = async () => {
      try {
        const response = await axios.get(`${BASEURL}/group/${groupId}/balances`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setBalancesData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching group balances:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchGroupBalances();
  }, [groupId, token]);

  if (loading) return <div className="text-center p-4">Loading balances...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error loading balances</div>;
  if (!balancesData) return null;

  // Filter out balances where userId matches the current user
  const filteredBalances = balancesData.balances.filter(
    balance => balance.userId !== balancesData.userId
  );

  // Sort balances by absolute balance amount in descending order
  const sortedBalances = filteredBalances.sort(
    (a, b) => Math.abs(b.balance) - Math.abs(a.balance)
  );

  // Prepare data for chart
  const chartData = sortedBalances.map(balance => ({
    name: balance.user.userId,
    balance: balance.balance
  }));

  // Determine which balances to display
  const displayBalances = showAll ? sortedBalances : sortedBalances.slice(0, 3);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Balances</h2>
      
      {/* Responsive Bar Chart */}
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`₹${Math.abs(value).toFixed(2)}`, 'Balance']}
            />
            <Bar 
              dataKey="balance" 
              fill={(value) => value > 0 ? '#10B981' : '#EF4444'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Balance List */}
      <div className="space-y-2">
        {displayBalances.map((balance) => {
          const isPositive = balance.balance >= 0;
          return (
            <div 
              key={balance.userId} 
              className="flex justify-between items-center p-3 rounded-md"
            >
              <div className="flex items-center space-x-2">
                {isPositive ? (
                  <ArrowDown className="text-green-500" />
                ) : (
                  <ArrowUp className="text-red-500" />
                )}
                <span className="font-medium">{balance.user.userId}</span>
              </div>
              <span 
                className={`font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive 
                  ? `${balance.user.userId} owes you ₹${Math.abs(balance.balance).toFixed(2)}` 
                  : `You owe ${balance.user.userId} ₹${Math.abs(balance.balance).toFixed(2)}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {sortedBalances.length > 3 && (
        <div className="text-center mt-4">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showAll ? 'Show Less' : `Show ${sortedBalances.length - 3} More`}
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupBalancesComponent;