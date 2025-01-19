import React, { useEffect, useState } from 'react';
import { Modal, Spin, Form, Input, Select, Button, Alert, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import _ from 'lodash';

const BASEURL = 'https://splitwise-backend-hd2z.onrender.com';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const ExpenseModal = ({ visible, setVisible, groupId, token }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [valueError, setValueError] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState({
    description: '',
    totalAmount: '',
    payers: [{ user: '', amount: '' }],
    splits: {}
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${BASEURL}/group/${groupId}/members`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const uniqueMembers = _.uniqBy(response.data.members, '_id');
        setMembers(uniqueMembers);
        
        const initialSplits = {};
        uniqueMembers.forEach(member => {
          initialSplits[member._id] = 0;
        });
        setFormValues(prev => ({
          ...prev,
          splits: initialSplits
        }));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (visible) {
      fetchMembers();
    }
  }, [visible, groupId, token]);

  const getAvailableMembers = (currentFieldId) => {
    const formPayers = form.getFieldValue('payers') || [];
    const selectedPayers = formPayers
      .filter(p => p && p.user)
      .map(p => p.user)
      .filter((user, index) => index !== currentFieldId);
    
    return members.filter(member => !selectedPayers.includes(member._id));
  };

  const handleSplitChange = (userId, value) => {
    setFormValues(prev => ({
      ...prev,
      splits: {
        ...prev.splits,
        [userId]: parseFloat(value) || 0
      }
    }));
  };

  const handleFileUpload = ({ file, fileList }) => {
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      setFileList([]);
      return;
    }
    setFileList(fileList);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { description, totalAmount, payers } = values;

      const payersTotal = payers.reduce((sum, payer) => sum + (parseFloat(payer.amount) || 0), 0);
      const splitsTotal = Object.values(formValues.splits).reduce((sum, amount) => sum + amount, 0);

      if (payersTotal !== parseFloat(totalAmount) || splitsTotal !== parseFloat(totalAmount)) {
        setValueError(true);
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('group', groupId);
      
      // Convert payers array to string to preserve structure
      formData.append('payers', JSON.stringify(payers));

      // Convert splits to array and stringify
      const splitsArray = members.map(member => ({
        user: member._id,
        amount: formValues.splits[member._id] || 0
      }));
      formData.append('splits', JSON.stringify(splitsArray));

      // Handle file upload
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('file', fileList[0].originFileObj);
      }

      await axios.post(`${BASEURL}/expense`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setVisible(false);
      form.resetFields();
      setFileList([]);
      setFormValues({
        description: '',
        totalAmount: '',
        payers: [{ user: '', amount: '' }],
        splits: {}
      });
    } catch (err) {
      console.error("Error creating expense:", err);
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setFileList([]);
    setFormValues({
      description: '',
      totalAmount: '',
      payers: [{ user: '', amount: '' }],
      splits: {}
    });
  };

  return (
    <Modal
      title="Create Expense"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      
     
    >
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} className="mb-4" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={formValues}
          onValuesChange={(changedValues, allValues) => {
            setFormValues(prev => ({
              ...prev,
              ...allValues,
            }));
          }}
          className="max-w-full overflow-x-hidden"
        >
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input placeholder="Enter expense description" />
          </Form.Item>

          <Form.Item
            name="totalAmount"
            label="Total Amount"
            rules={[{ required: true, message: 'Please enter total amount' }]}
          >
            <Input type="number" placeholder="Enter total amount" />
          </Form.Item>

          <Upload
            beforeUpload={() => false}
            onChange={handleFileUpload}
            maxCount={1}
            fileList={fileList}
            accept="image/*,application/pdf"
          >
            <Button icon={<UploadOutlined />}>Upload Receipt (Max: 5MB)</Button>
          </Upload>

          <Form.List name="payers">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.key} className="flex flex-col sm:flex-row gap-4">
                    <Form.Item
                      {...field}
                      label={index === 0 ? "Payers" : ""}
                      name={[field.name, 'user']}
                      rules={[{ required: true, message: 'Select payer' }]}
                      className="flex-1 min-w-0"
                    >
                      <Select 
                        placeholder="Select payer"
                        onChange={() => form.validateFields()}
                      >
                        {getAvailableMembers(index).map(member => (
                          <Select.Option key={member._id} value={member._id}>
                            {member.userId} ({member.email})
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label={index === 0 ? "Amount" : ""}
                      name={[field.name, 'amount']}
                      rules={[{ required: true, message: 'Enter amount' }]}
                      className="flex-1 min-w-0"
                    >
                      <Input type="number" placeholder="Amount" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button 
                        type="text"
                        onClick={() => remove(field.name)}
                        className="text-red-500 self-end"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block className="mt-4">
                  Add Payer
                </Button>
              </div>
            )}
          </Form.List>

          <div className="mt-4 space-y-4">
            <label className="font-medium block">Splits</label>
            {members.map(member => (
              <div key={member._id} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0 break-words">
                  {member.userId} ({member.email})
                </div>
                <Input 
                  type="number" 
                  placeholder="Amount" 
                  value={formValues.splits[member._id]}
                  onChange={(e) => handleSplitChange(member._id, e.target.value)}
                  className="w-full sm:w-32"
                />
              </div>
            ))}
          </div>
        </Form>
      )}
      {valueError && (
        <Alert 
          type="error" 
          message="Total amount must match payers and splits totals" 
          className="mt-4"
        />
      )}
    </Modal>
  );
};

export default ExpenseModal;