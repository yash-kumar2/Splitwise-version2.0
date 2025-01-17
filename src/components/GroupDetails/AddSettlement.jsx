import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, InputNumber, message, Form, Space } from 'antd';
import { PlusCircle, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddSettlement = ({ groupId, userId }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const token = useSelector((state) => state.auth.token);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://splitwise-backend-hd2z.onrender.com/group/${groupId}/balances`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filter balances where the user owes money (negative balance)
      const filteredBalances = response.data.balances.filter(balance => 
        balance.userId !== userId && balance.balance < 0
      );

      setBalances(filteredBalances);
    } catch (error) {
      message.error('Failed to fetch balances');
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxAmount = (userId) => {
    const balance = balances.find(b => b.userId === userId);
    return balance ? Math.abs(balance.balance) : 0;
  };

  const handleSettlement = async (values) => {
    try {
      setLoading(true);
      const settlements = values.settlements
        .filter(settlement => settlement && settlement.userId && settlement.amount)
        .map(settlement => ({
          user: settlement.userId,
          amount: settlement.amount
        }));

      const response = await axios.post('https://splitwise-backend-hd2z.onrender.com/settlement', {
        group: groupId,
        settlements: settlements
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        message.success('Settlements created successfully');
        setIsModalOpen(false);
        form.resetFields();
        setSelectedUsers(new Set());
      }
    } catch (error) {
      message.error('Failed to create settlements');
      console.error('Error creating settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    fetchBalances();
    form.resetFields();
    setSelectedUsers(new Set());
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedUsers(new Set());
  };

  return (
    <>
      <Button 
        type="primary"
        icon={<PlusCircle className="mr-2" size={16} />}
        onClick={showModal}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Add Settlements
      </Button>

      <Modal
        title="Create Multiple Settlements"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleSettlement}
          autoComplete="off"
        >
          <Form.List name="settlements" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.key} className="flex gap-4 items-start">
                    <Form.Item
                      {...field}
                      name={[field.name, 'userId']}
                      rules={[
                        { required: true, message: 'Please select a user' },
                        {
                          validator: (_, value) => {
                            if (value && Array.from(selectedUsers).filter(u => u === value).length > 1) {
                              return Promise.reject('User already selected');
                            }
                            return Promise.resolve();
                          }
                        }
                      ]}
                      className="mb-0 flex-grow"
                    >
                      <Select
                        placeholder="Select a user"
                        loading={loading}
                        onChange={(value, option) => {
                          const newSelected = new Set(selectedUsers);
                          const oldValue = form.getFieldValue(['settlements', field.name, 'userId']);
                          if (oldValue) {
                            newSelected.delete(oldValue);
                          }
                          if (value) {
                            newSelected.add(value);
                          }
                          setSelectedUsers(newSelected);
                        }}
                      >
                        {balances.map(balance => {
                          const isSelected = selectedUsers.has(balance.userId);
                          return (
                            <Select.Option 
                              key={balance.userId} 
                              value={balance.userId}
                              disabled={isSelected && form.getFieldValue(['settlements', field.name, 'userId']) !== balance.userId}
                            >
                              {balance.user.userId} (You owe: ₹{Math.abs(balance.balance)})
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'amount']}
                      rules={[
                        { required: true, message: 'Please enter an amount' },
                        {
                          validator: (_, value) => {
                            const userId = form.getFieldValue(['settlements', field.name, 'userId']);
                            const maxAmount = getMaxAmount(userId);
                            if (value && (value <= 0 || value > maxAmount)) {
                              return Promise.reject(`Amount must be between 1 and ${maxAmount}`);
                            }
                            return Promise.resolve();
                          }
                        }
                      ]}
                      className="mb-0"
                    >
                      <InputNumber
                        placeholder="Amount"
                        formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/₹\s?|(,*)/g, '')}
                        className="w-32"
                      />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button 
                        type="text"
                        className="text-red-500 hover:text-red-700 px-2"
                        icon={<Trash2 size={18} />}
                        onClick={() => {
                          const userId = form.getFieldValue(['settlements', field.name, 'userId']);
                          if (userId) {
                            const newSelected = new Set(selectedUsers);
                            newSelected.delete(userId);
                            setSelectedUsers(newSelected);
                          }
                          remove(field.name);
                        }}
                      />
                    )}
                  </div>
                ))}

                <Form.Item className="mb-0">
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<Plus size={16} />}
                    block
                    disabled={fields.length >= balances.length}
                  >
                    Add Another Settlement
                  </Button>
                </Form.Item>

                {fields.length > 0 && (
                  <div className="text-sm text-gray-500 mt-2">
                    <p>Settlement amounts must be less than or equal to what you owe each user.</p>
                  </div>
                )}
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default AddSettlement;