import React, { useEffect, useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import GroupsCard from './GroupsCard';
import { Modal, Button, Input,Spin } from 'antd'; // Import Modal and Input from antd
import axios from 'axios';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [newGroupName, setNewGroupName] = useState(''); // State to store new group name
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [confirmLoading,setConfirmLoading]=useState(false)
  const [d,sD]=useState(0)
  const [loader,setLoader]=useState(false)

  useEffect(() => {
    const fetchGroups = async () => {
      setLoader(true)
      try {
        const response = await fetch('https://splitwise-backend-hd2z.onrender.com/groups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }

        const data = await response.json();
        console.log(data)
        console.log("df")
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
      setLoader(false)
    };

    if (token) {
      fetchGroups();
    }
  }, [token,d]);

  // Show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal "OK" button click to create a new group
  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      const response = await axios.post(
        'https://splitwise-backend-hd2z.onrender.com/group',
        { name: newGroupName }, // Payload containing the group name
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      
      const createdGroup = response.data;
      //navigate('/groups'); 
      sD((d)=>d+1)
      

      setIsModalVisible(false); // Close the modal
      setNewGroupName(''); 
    } catch (error) {
      setConfirmLoading(false)
      console.error('Error creating group:', error);
    }
    setConfirmLoading(false)
  };

  // Handle modal "Cancel" button click
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>

      {/* Button to open the modal */}
      <Button type="primary" onClick={showModal} className="mb-4">
        Create New Group
      </Button>

      {/* Modal for creating a new group */}
      <Modal
        title="Create New Group"
        visible={isModalVisible}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
      </Modal>
       
      {/* List of groups */}
      {loader == false ? groups.map((group) => (
        <Link key={group.groupId} to={`/groups/${group.groupId}`}>
          <GroupsCard group={group} />
        </Link>
      )) : (<div className='flex justify-center items-center max-h-*'><Spin size="large"/></div>) }
    </div>
  );
};

export default GroupsPage;
