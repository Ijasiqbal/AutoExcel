// Industry.tsx
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import '../styles/Industry.css';

interface IndustryDialogProps {
  onSave?: (value: boolean) => void;
  onClose: () => void;
}

const IndustryDialog: React.FC<IndustryDialogProps> = ({ onSave, onClose }) => {
  const [open, setOpen] = useState(true);
  const [industry, setIndustry] = useState('');

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleIndustryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIndustry(event.target.value);
  };

  const handleSave = () => {
    localStorage.setItem('industry', industry);
    onSave && onSave(true); // Pass a boolean value to onSave
    handleClose();
  };

  useEffect(() => {
    localStorage.removeItem('industry');
  }, []);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#9A8C98' } }}>
        <DialogTitle>What is your excel data about...</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="industry"
            label="Explain your business in a few words?"
            type="text"
            fullWidth
            value={industry}
            onChange={handleIndustryChange}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleSave} className="btn2">
            Submit
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IndustryDialog;
