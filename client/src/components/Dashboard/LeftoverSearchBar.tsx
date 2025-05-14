import type { FC } from 'react';

interface LeftoverSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const LeftoverSearchBar: FC<LeftoverSearchBarProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search leftovers..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="leftover-search-bar"
    />
  );
};

export default LeftoverSearchBar;
