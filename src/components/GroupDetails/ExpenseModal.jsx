import React, { useEffect, useState } from 'react';
import { Modal, Spin, Form, Input, Select, Button, Alert } from 'antd';
import axios from 'axios';
import _ from 'lodash';

const BASEURL = 'http://localhost:3000';

const ExpenseModal = ({ visible, setVisible, groupId, token }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [valueError,setValueError]=useState(false)
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
        // Remove duplicates based on _id
        const uniqueMembers = _.uniqBy(response.data.members, '_id');
        setMembers(uniqueMembers);
        
        // Initialize splits with all members having 0 amount
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

  // Get available members for payer selection (excluding already selected payers)
  const getAvailableMembers = (currentFieldId) => {
    const formPayers = form.getFieldValue('payers') || [];
    const selectedPayers = formPayers
      .filter(p => p && p.user) // Check if payer exists and has user
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { description, totalAmount, payers } = values;

      // Validate total amount matches
      const payersTotal = payers.reduce((sum, payer) => sum + (parseFloat(payer.amount) || 0), 0);
      const splitsTotal = Object.values(formValues.splits).reduce((sum, amount) => sum + amount, 0);

      if (payersTotal !== parseFloat(totalAmount) || splitsTotal !== parseFloat(totalAmount)) {
        //throw new Error('Total amount must match payers and splits totals');
        setValueError(true)
        return;
      }

      const payload = {
        description,
        group: groupId,
        payers: payers.map(p => ({
          user: p.user,
          amount: parseFloat(p.amount)
        })),
        splits: members.map(member => ({
          user: member._id,
          amount: formValues.splits[member._id] || 0
        }))
      };

      await axios.post(`${BASEURL}/expense`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setVisible(false);
      form.resetFields();
      setFormValues({
        description: '',
        totalAmount: '',
        payers: [{ user: '', amount: '' }],
        splits: {}
      });
    } catch (err) {
      console.error("Error creating expense:", err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
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
      width={600}
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

          <Form.List name="payers">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key} className="flex gap-4">
                    <Form.Item
                      {...field}
                      label={index === 0 ? "Payers" : ""}
                      name={[field.name, 'user']}
                      rules={[{ required: true, message: 'Select payer' }]}
                      className="flex-1"
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
                    >
                      <Input type="number" placeholder="Amount" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button 
                        type="text"
                        onClick={() => remove(field.name)}
                        className="mt-8 text-red-500"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  Add Payer
                </Button>
              </>
            )}
          </Form.List>

          <div className="mt-4">
            <label className="font-medium mb-2 block">Splits</label>
            {members.map(member => (
              <div key={member._id} className="flex gap-4 mb-2">
                <div className="flex-1">
                  {member.userId} ({member.email})
                </div>
                <Input 
                  type="number" 
                  placeholder="Amount" 
                  value={formValues.splits[member._id]}
                  onChange={(e) => handleSplitChange(member._id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </Form>
      )}
      {valueError&&<b className='text-red-500'> Total amount must match payers and splits totals</b>}
    </Modal>
  );
};

export default ExpenseModal;