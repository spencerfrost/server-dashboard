import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Network: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Network Configuration</h2>
      <Card>
        <CardHeader>
          <CardTitle>Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Network monitoring and configuration features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Network;