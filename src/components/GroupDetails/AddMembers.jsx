import React, { useState } from 'react';
import { Modal, Button, Input, List } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const AddMembers = ({ friends, addMembers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emails, setEmails] = useState([]); // Stores the list of emails
  const [inputEmail, setInputEmail] = useState(''); // Stores the current email input

  // Show the modal
  const showModal = () => {
    setIsModalOpen(true);
  };

 
  const handleOk = () => {
    addMembers(emails); // Call the API with the emails
    setIsModalOpen(false);
    setEmails([]); // Clear the email list after submission
    setInputEmail(''); 
  };

  // On "Cancel" button press
  const handleCancel = () => {
    setIsModalOpen(false);
    setEmails([]); // Clear the list
    setInputEmail(''); // Clear the input
  };

  // Handle input change to update the current email being typed
  const handleInputChange = (event) => {
    setInputEmail(event.target.value);
  };

  // Add the email to the list when the user presses enter
  const handleAddEmail = () => {
    if (inputEmail && !emails.includes(inputEmail)) {
      setEmails([...emails, inputEmail]);
      setInputEmail(''); // Clear the input field after adding
    }
  };

  // Remove email from the list
  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Members
      </Button>
      <Modal
        title="Add Members"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        {/* Email input field */}
        <div className="mb-4">
          <p>Add Email:</p>
          <Input
            type="email"
            placeholder="Enter email"
            value={inputEmail}
            onChange={handleInputChange}
            onPressEnter={handleAddEmail} // Add email on pressing "Enter"
          />
          <Button type="primary" onClick={handleAddEmail} className="mt-2">
            Add to List
          </Button>
        </div>

        {/* Display list of added emails */}
        <List
          bordered
          dataSource={emails}
          renderItem={(email) => (
            <List.Item
              actions={[
                <CloseCircleOutlined
                  onClick={() => handleRemoveEmail(email)}
                  style={{ color: 'red' }}
                />,
              ]}
            >
              {email}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default AddMembers;
