import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import React from 'react';

type StorageSelectorProps = {
  storageLocation: 'freezer' | 'fridge';
  setStorageLocation: (loc: 'freezer' | 'fridge') => void;
};

export const StorageSelector: React.FC<StorageSelectorProps> = ({ storageLocation, setStorageLocation }) => (
  <FormControl margin="normal" fullWidth>
    <FormLabel>Storage Location</FormLabel>
    <RadioGroup
      row
      value={storageLocation}
      onChange={(e) => setStorageLocation(e.target.value as 'freezer' | 'fridge')}
    >
      <FormControlLabel value="fridge" control={<Radio />} label="Fridge" />
      <FormControlLabel value="freezer" control={<Radio />} label="Freezer" />
    </RadioGroup>
  </FormControl>
);
