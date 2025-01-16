import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Receipt, DollarSign, Calculator, CircleHelp, Trash } from 'lucide-react';
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

const SimplifiedSettlementCard = ({ settlement, modalOpen, setModalOpen, mode, user }) => {
  const date = new Date(settlement.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
  });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setModalOpen(false);
    setOpenInfo(false);
    setOpen(false);
  };

  // Check if user can delete - similar to ExpenseCard logic
  const canDelete = 1;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`http://localhost:3000/simplified-payment/${settlement._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting settlement:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setModalOpen(false);
    }
  };

  return (
    <div
      className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={(e) => {
        if (e.target.closest('.delete-btn')) {
          return;
        }
        if (!modalOpen) {
          setModalOpen(true);
          setOpen(true);
        }
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Payments</h3>
              <ul className="list-disc list-inside text-gray-700">
                {settlement.payments.map((payment) => (
                  <li key={payment._id}>
                    {payment.payer.userId} paid {payment.payee.userId}: ₹{payment.amount}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        open={openInfo}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p>Simplified payments streamline group expense settlements by reducing unnecessary transactions while keeping balances accurate. You only owe those you originally did, and your total owed amount stays the same—just easier to manage and settle.</p>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setModalOpen(false);
        }}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={style}>
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p className="mb-4">Are you sure you want to delete this settlement? This action cannot be undone.</p>
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

      <div className="flex items-center mb-2">
        <Calculator className="mr-2 text-blue-500" size={24} />
        <div className="flex items-center w-full">
          <h2 className="text-xl font-semibold">System Simplified Settlements</h2>
          <CircleHelp
            onClick={(e) => {
              e.stopPropagation();
              setOpenInfo(true);
              if (!modalOpen) {
                setModalOpen(true);
              }
            }}
            className="ml-2 text-green-500"
          />
          {mode && (
            <h2 className="text-lg font-semibold text-blue-800 ml-auto">
              group: {settlement.group.name}
            </h2>
          )}
          {canDelete && (
            <button
              onClick={() => {
                setDeleteModalOpen(true);
                setModalOpen(true);
              }}
              className="delete-btn ml-4 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded ml-auto"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : <Trash />}
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
          <p className="font-semibold text-gray-800">Generated by system</p>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedSettlementCard;