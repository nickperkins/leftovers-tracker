import { TextField } from '@mui/material';
import React from 'react';

type PortionInputProps = {
  portion: number;
  setPortion: (portion: number) => void;
};

export const PortionInput: React.FC<PortionInputProps> = ({ portion, setPortion }) => (
  <TextField
    label="Portion"
    type="number"
    fullWidth
    margin="normal"
    value={portion}
    onChange={(e) => setPortion(parseFloat(e.target.value))}
    inputProps={{ min: 0.5, step: 0.5 }}
    required
  />
);
