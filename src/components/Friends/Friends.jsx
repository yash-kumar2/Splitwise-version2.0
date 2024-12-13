import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FriendsCard from './FriendsCard';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://localhost:3000/friends', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token in the request
          },
        });
        

        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [token]); // Add token as a dependency

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>
      {friends.map((friend, index) => (
        <FriendsCard
          key={index}
          name={friend.name}
          email={friend.email}  // Pass email prop
          amount={friend.owedAmount}
        />
      ))}
    </div>
  );
};

export default FriendsPage;
