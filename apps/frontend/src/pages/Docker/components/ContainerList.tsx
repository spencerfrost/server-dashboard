// frontend/src/pages/Docker/components/ContainerList.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { useContainers } from '@/hooks/useDocker';
import { Circle } from 'lucide-react';
import { FC } from 'react';

interface ContainerListProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export const ContainerList: FC<ContainerListProps> = ({ onSelect, selectedId }) => {
  const { data: containers = [], isLoading } = useContainers();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {containers.map((container) => (
        <button
          key={container.id}
          onClick={() => onSelect(container.id)}
          className={`w-full rounded-lg px-4 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground ${
            selectedId === container.id ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <Circle 
              className={`h-3 w-3 ${
                container.state === 'running' 
                  ? 'text-green-500' 
                  : 'text-yellow-500'
              }`} 
            />
            <span className="font-medium">{container.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
