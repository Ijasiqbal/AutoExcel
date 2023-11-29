import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Confirm({ onClose, data }) {
  const [inputValues, setInputValues] = useState(data);

  const handleInputChange = (key, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Submitted with:', inputValues);
    const existingSheetData = JSON.parse(localStorage.getItem('sheet') || '[]');
    console.log('existingSheetData', existingSheetData);
  
    // Create a new array with the values of  inputValues
    const newEntry = Object.values(inputValues);
  
    // Append the new entry to the existing data
    const updatedSheetData = [...existingSheetData, newEntry];
  
    // Update the local storage with the updated data
    localStorage.setItem('sheet', JSON.stringify(updatedSheetData));
  
    onClose();
    console.log('after appending', updatedSheetData)
  };

  return (
    <Dialog open={true} onClose={onClose} PaperProps={{ style: { backgroundColor: '#9A8C98' } }}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        {Object.entries(data).map(([key, value]) => (
          <TextField
            key={key}
            margin="dense"
            label={key}
            type="text"
            fullWidth
            value={inputValues[key] !== undefined ? inputValues[key] : value}
            onChange={(e) => handleInputChange(key, e.target.value)}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>{console.log(data)}} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Confirm;
