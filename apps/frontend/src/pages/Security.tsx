import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Security: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Security Center</h2>
      <Card>
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Security monitoring and management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;