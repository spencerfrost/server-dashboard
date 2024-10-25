import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Monitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Monitoring</h2>
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Advanced system monitoring features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Monitoring;