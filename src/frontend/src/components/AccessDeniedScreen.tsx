import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

interface AccessDeniedScreenProps {
  onBack: () => void;
}

export default function AccessDeniedScreen({ onBack }: AccessDeniedScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-sm w-full shadow-card">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <ShieldX className="w-7 h-7 text-destructive" />
            </div>
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-1">Access Denied</h2>
            <p className="text-sm text-muted-foreground">
              You don't have permission to access this page. Admin privileges are required.
            </p>
          </div>
          <Button onClick={onBack} variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
