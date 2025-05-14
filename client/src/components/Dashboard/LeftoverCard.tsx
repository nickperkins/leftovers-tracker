import type { FC } from 'react';
import { Leftover } from '../types/leftover.types';

interface LeftoverCardProps {
  leftover: Leftover;
  onSelect: (id: string) => void;
}

const LeftoverCard: FC<LeftoverCardProps> = ({ leftover, onSelect }) => {
  return (
    <div className="leftover-card" onClick={() => onSelect(leftover.id)}>
      <h3>{leftover.name}</h3>
      <p>{leftover.description}</p>
      {/* Add more leftover details as needed */}
    </div>
  );
};

export default LeftoverCard;
