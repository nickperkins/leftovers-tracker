// TagList.tsx - shared tag list component for leftovers
import React from 'react';
import { Chip, Box, Typography } from '@mui/material';

export interface TagListProps {
  tags: string[];
  onDelete?: (tag: string) => void;
  label?: string;
}

const TagList: React.FC<TagListProps> = ({ tags, onDelete, label }) => (
  <Box sx={{ mt: 2 }}>
    {label && (
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
    )}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {tags.map(tag => (
        <Chip
          key={tag}
          label={tag}
          onDelete={onDelete ? () => onDelete(tag) : undefined}
          color="primary"
          variant="outlined"
        />
      ))}
    </Box>
  </Box>
);

export default TagList;
