import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';

type ExpiryDatePickerProps = {
  expiryDate: Date;
  setExpiryDate: (date: Date) => void;
};

export const ExpiryDatePicker: React.FC<ExpiryDatePickerProps> = ({ expiryDate, setExpiryDate }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      label="Expiry Date"
      value={expiryDate}
      onChange={(newValue) => newValue && setExpiryDate(newValue)}
      sx={{ mt: 2, width: '100%' }}
    />
  </LocalizationProvider>
);
