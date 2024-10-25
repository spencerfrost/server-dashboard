import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Configuration: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Configuration</h2>
      <Card>
        <CardHeader>
          <CardTitle>Configuration Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">System configuration and settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuration;