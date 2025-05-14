import { TextField, Button, Box } from '@mui/material';
import React from 'react';

type TagInputProps = {
  currentTag: string;
  setCurrentTag: (tag: string) => void;
  onAddTag: () => void;
};

export const TagInput: React.FC<TagInputProps> = ({ currentTag, setCurrentTag, onAddTag }) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
    <TextField
      label="Add Tag"
      value={currentTag}
      onChange={(e) => setCurrentTag(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
      fullWidth
    />
    <Button onClick={onAddTag} variant="outlined">Add</Button>
  </Box>
);
