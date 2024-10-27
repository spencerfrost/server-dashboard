// frontend/src/pages/Docker/components/StatusPill.tsx
import { Circle } from 'lucide-react';
import { FC } from 'react';

interface StatusPillProps {
  count: number;
  label: string;
  color: 'success' | 'warning' | 'error';
}

export const StatusPill: FC<StatusPillProps> = ({ count, label, color }) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex items-center gap-2">
      <Circle 
        className={`h-4 w-4 ${
          color === 'success' 
            ? 'text-green-500' 
            : color === 'warning' 
            ? 'text-yellow-500' 
            : 'text-red-500'
        }`} 
      />
      <span className={`rounded-full px-2 py-1 text-sm font-medium ${colors[color]}`}>
        {count} {label}
      </span>
    </div>
  );
};