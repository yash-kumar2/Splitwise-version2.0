import React, { useState } from 'react';

import { Receipt, DollarSign, Calculator } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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
const ExpenseCard = ({ expense,user,modalOpen,setModalOpen}) => {
  const date = new Date(expense.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () =>{
    console.log("sfdds")
    setModalOpen(false)
    setOpen(false)};
    

  // Calculate total expense amount
  let totalExpense=0;
  let totalAmount=0
  expense.payers.forEach((payer)=>{
    console.log(payer)
    console.log(user)
    if(payer.user._id==user){
      totalExpense-=payer.amount

    }
    totalAmount+=payer.amount

  })
  expense.splits.forEach((split)=>{
    if(split.user._id==user){
      totalExpense+=split.amount

    }

  })
  const summary= totalExpense>=0?`You were paid ₹${totalExpense}`:`You paid ₹${-totalExpense}`
  const summaryStyle=totalExpense>=0?'font-semibold text-green-500':'font-semibold text-red-500'

  // Determine the primary payer₹
  const primaryPayer = expense.payers[0]?.user;

  return (
    <div 
      className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={() => {
        if(modalOpen==true){
          return 
        }
        setModalOpen(true)
        
        
        setOpen(true)}}
    >
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
          <p><strong>Group:</strong> {expense.group}</p>
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
      <div className="flex items-center mb-2">
        <Receipt className="mr-2 text-blue-500" size={24} />
        <h2 className="text-xl font-semibold">{expense.description}</h2>
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
    </div>
  );
};


export default ExpenseCard;