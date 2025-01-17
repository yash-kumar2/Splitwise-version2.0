import React, { useState } from 'react';
import { Modal, Button, Input, List, Tag } from 'antd';
import axios from 'axios';

const BASEURL = 'https://splitwise-backend-hd2z.onrender.com';
 // Replace with your token

const AddUsersToGroup = ({ groupId ,token,visible,setVisible}) => {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Open Modal
  const showModal = () => {
    setVisible(true);
  };

  // Close Modal
  const handleCancel = () => {
    setVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUsers([]);
  };

  // Fetch users based on search input
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}/users/search`, {
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

  // Add user to selected list
  const handleAddUser = (user) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Remove user from selected list
  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  // Confirm and send API call to add users to group
  const handleOk = async () => {
    try {
      await axios.post(
        `${BASEURL}/group/${groupId}/add-members`,
        {
          users: selectedUsers.map((user) => user._id),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Users added successfully!");
      setVisible(false);
    } catch (err) {
      console.error("Error adding users to group:", err);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Users to Group
      </Button>
      <Modal
        title="Add Users to Group"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
        cancelText="Cancel"
      >
        <Input
          placeholder="Search users by username"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <List
          loading={loading}
          bordered
          dataSource={searchResults}
          renderItem={(user) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => handleAddUser(user)}>
                  Add
                </Button>,
              ]}
            >
              {user.userId} {/* Display userId (username) */}
            </List.Item>
          )}
        />
        <div style={{ marginTop: 16 }}>
          <h3>Selected Users</h3>
          {selectedUsers.map((user) => (
            <Tag
              key={user._id}
              closable
              onClose={() => handleRemoveUser(user._id)}
            >
              {user.userId} {/* Display userId (username) */}
            </Tag>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AddUsersToGroup;
