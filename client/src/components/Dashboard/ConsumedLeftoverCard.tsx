import type { FC } from 'react';
import { Leftover } from '../types/leftover.types';

interface ConsumedLeftoverCardProps {
  leftover: Leftover;
  onRestore: (id: string) => void;
}

const ConsumedLeftoverCard: FC<ConsumedLeftoverCardProps> = ({ leftover, onRestore }) => {
  return (
    <div className="consumed-leftover-card">
      <h3>{leftover.name}</h3>
      <button onClick={() => onRestore(leftover.id)}>Restore</button>
      {/* Add more consumed leftover details as needed */}
    </div>
  );
};

export default ConsumedLeftoverCard;
