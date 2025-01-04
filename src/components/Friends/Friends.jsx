import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Input, Spin, AutoComplete } from 'antd';
import axios from 'axios';
import FriendsCard from './FriendsCard';
import { Link ,useNavigate} from 'react-router-dom';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [totalBalance, setTotalBalance] = useState(0);
  

  useEffect(() => {
    const fetchFriends = async () => {
      setPageLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/friend-balances', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data.friendBalances);
        setTotalBalance(response.data.totalBalance);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
      setPageLoading(false);
    };

    if (token) {
      fetchFriends();
    }
  }, [token]);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/users/search`, {
        params: { query },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error("Error searching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddFriend = async (userId) => {
    try {
      await axios.post('http://localhost:3000/add-friend', 
        { friendId: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh friends list
      const response = await axios.get('http://localhost:3000/friend-balances', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriends(response.data.friendBalances);
      setTotalBalance(response.data.totalBalance);
      
      handleCancel();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const searchOptions = searchResults.map(user => ({
    value: user._id,
    label: (
      <div className="flex justify-between items-center">
        <span>{user.userId} ({user.email})</span>
        <Button 
          size="small" 
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            handleAddFriend(user._id);
          }}
        >
          Add
        </Button>
      </div>
    ),
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Friends</h1>
        <div>
          <h2 className={`text-lg font-semibold ${totalBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            Total Balance: {totalBalance >= 0 ? `+${totalBalance}` : totalBalance}
          </h2>
        </div>
      </div>

      <Button type="primary" onClick={showModal} className="mb-4">
        Add New Friend
      </Button>

      <Modal
        title="Add New Friend"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AutoComplete
          className="w-full"
          value={searchQuery}
          options={searchOptions}
          onSearch={handleSearch}
          placeholder="Search users by email or username"
          loading={loading}
        />
      </Modal>

      {pageLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-4">
          {friends.map((friendData) => (
            <Link to={`/friend/${friendData.friendId}`}>
            <FriendsCard key={friendData.friendId} friendData={friendData} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;