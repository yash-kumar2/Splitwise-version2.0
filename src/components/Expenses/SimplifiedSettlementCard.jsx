import React, { useState } from 'react';


import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Receipt, DollarSign, Calculator,CircleHelp } from 'lucide-react';

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

const SimplifiedSettlementCard = ({ settlement ,modalOpen,setModalOpen,mode}) => {
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
  const handleOpen = () => {
    console.log("sd")
    
    setOpen(true)

  };
  const handleClose = () =>{
    console.log("sfdds")
    setModalOpen(false)
    setOpenInfo(false)
    setOpen(false)};
    

  return (
    <div
      className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={(e) => {
        e.stopPropagation();
        console.log("sfd")
        if(modalOpen==true){
          return 
        }
        setModalOpen(true)
        setOpen(true)
        
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
            <div className="flex justify-between">
              {/* <p>
                <strong>Date:</strong> {new Date(settlement.createdAt).toLocaleString()}
              </p> */}
              {/* <p>
                <strong>Group:</strong> {settlement.group}
              </p> */}
            </div>

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

      <div className="flex items-center mb-2">
        <Calculator className="mr-2 text-blue-500" size={24} />
        <h2 className="text-xl font-semibold">System Simplified Settlements</h2> <CircleHelp  onClick={(e) => {
            e.stopPropagation()
            
            setOpenInfo(true);
            if(modalOpen==true){
              return;
            }
            setModalOpen(true)
          }} className="ml-2 text-green-500"/>
          {mode && (
          <h2 className="text-lg font-semibold text-blue-800 ml-auto">
            group: {settlement.group.name}
          </h2>
        )}
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
