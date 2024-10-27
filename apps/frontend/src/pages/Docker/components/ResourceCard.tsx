// frontend/src/pages/Docker/components/ResourceCard.tsx
import { Progress } from '@/components/ui/progress';
import { FC, ReactNode } from 'react';

interface ResourceCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  usage?: number;
}

export const ResourceCard: FC<ResourceCardProps> = ({ title, value, icon, usage }) => (
  <div className="rounded-lg border bg-card p-4 text-card-foreground">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium">{title}</h3>
      {icon}
    </div>
    <p className="mt-2 text-2xl font-bold">{value}</p>
    {usage !== undefined && (
      <div className="mt-2">
        <Progress value={usage} className="h-1" />
        <p className="mt-1 text-xs text-muted-foreground">{usage}% used</p>
      </div>
    )}
  </div>
);