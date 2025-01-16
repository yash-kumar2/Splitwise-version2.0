import React, { useState } from 'react';
import { Receipt, DollarSign, Calculator,Trash } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useSelector } from 'react-redux';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ExpenseCard = ({ expense, user, modalOpen, setModalOpen, mode }) => {
  const date = new Date(expense.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    setOpen(false);
  };

  // Check if user can delete
  const canDelete = expense.createdBy._id === user || 
    expense.payers.some(payer => payer.user._id === user);

  // Calculate total expense amount
  let totalExpense = 0;
  let totalAmount = 0;
  expense.payers.forEach((payer) => {
    if(payer.user._id === user) {
      totalExpense -= payer.amount;
    }
    totalAmount += payer.amount;
  });

  expense.splits.forEach((split) => {
    if(split.user._id === user) {
      totalExpense += split.amount;
    }
  });

  const summary = totalExpense >= 0 ? `You were paid ₹${totalExpense}` : `You paid ₹${-totalExpense}`;
  const summaryStyle = totalExpense >= 0 ? 'font-semibold text-green-500' : 'font-semibold text-red-500';

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`http://localhost:3000/expense/${expense._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setModalOpen(false)
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.delete-btn')) {
      return;
    }
    if (!modalOpen) {
      setModalOpen(true);
      setOpen(true);
    }
  };

  return (
    <div 
      className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleCardClick}
    >
      <div className="flex items-center mb-2">
        <Receipt className="mr-2 text-blue-500" size={24} />
        <div className="flex items-center w-full">
          <h2 className="text-xl font-semibold">{expense.description}</h2>
          {mode && (
            <h2 className="text-lg font-semibold text-blue-800 ml-auto">
              group: {expense.group.name}
            </h2>
          )}
          {canDelete && (
            <button
              onClick={() => {setDeleteModalOpen(true)
                setModalOpen(true)
              }}
              className="delete-btn ml-4 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded ml-auto"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : <Trash/>}
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-left">
          <div className="text-lg font-bold">{formattedDate.split(' ')[1]}</div>
          <div className="text-sm text-gray-600">{month}</div>
          <div className="text-sm text-gray-600">{formattedTime}</div>
        </div>
        <div className="text-right">
          <p className={summaryStyle}>
            {summary}
          </p>
        </div>
      </div>

      {/* Expense Details Modal */}
      <Modal 
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClick={handleClose}
      >
        <Box sx={style}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p><strong>Date:</strong> {new Date(expense.createdAt).toLocaleString()}</p>
              <p><strong>Created by:</strong> {expense.createdBy.userId}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Expense Summary</h3>
              <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
              <p><strong>Group:</strong> {expense.group.name}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Payers</h3>
              <ul className="list-disc list-inside text-gray-700">
                {expense.payers.map((payer) => (
                  <li key={payer._id}>
                    {payer.user.userId}: ₹{payer.amount}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Splits</h3>
              <ul className="list-disc list-inside text-gray-700">
                {expense.splits.map((split) => (
                  <li key={split._id}>
                    {split.user.userId}: ₹{split.amount}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {setDeleteModalOpen(false)
          setModalOpen(false)
        
        }}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={style}>
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p className="mb-4">Are you sure you want to delete this expense? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 "
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ExpenseCard;