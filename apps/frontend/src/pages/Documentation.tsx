import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Documentation</h2>
      <Card>
        <CardHeader>
          <CardTitle>Documentation Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">System documentation and guides coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;