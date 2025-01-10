import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { CircleHelp } from 'lucide-react';

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

const CircleHelpIcon = ({ modalOpen, setModalOpen }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
    if (!modalOpen) setModalOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
    setModalOpen(false);
  };

  return (
    <>
      <CircleHelp
        className="ml-2 text-green-500 cursor-pointer mt-1"
        size={24}
        onClick={handleOpen}
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <p>Simplified payments streamline group expense settlements by reducing unnecessary transactions while keeping balances accurate.</p>
        </Box>
      </Modal>
    </>
  );
};

export default CircleHelpIcon;
