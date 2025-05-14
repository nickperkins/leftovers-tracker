import { Chip, Stack } from '@mui/material';
import React from 'react';

type TagListProps = {
  tags: string[];
  onRemoveTag: (index: number) => void;
};

export const TagList: React.FC<TagListProps> = ({ tags, onRemoveTag }) => (
  <Stack direction="row" spacing={1} flexWrap="wrap">
    {tags.map((tag, index) => (
      <Chip
        key={index}
        label={tag}
        onDelete={() => onRemoveTag(index)}
        sx={{ mb: 1 }}
      />
    ))}
  </Stack>
);
