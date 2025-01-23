import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatabaseConnections } from '@/types/admin';

interface DatabaseConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (connections: DatabaseConnections) => Promise<void>;
  isConnected: boolean;
}

export function DatabaseConnectionDialog({
  open,
  onOpenChange,
  onConnect,
  isConnected,
}: DatabaseConnectionDialogProps) {
  const [formData, setFormData] = useState({
    p21: {
      host: '',
      database: '',
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConnect(formData);
    onOpenChange(false);
  };

  const handleInputChange = (database: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [database]: {
        ...prev[database as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Database Connection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="p21-host">Host</Label>
              <Input
                id="p21-host"
                value={formData.p21.host}
                onChange={(e) => handleInputChange('p21', 'host', e.target.value)}
                placeholder="localhost"
              />
            </div>
            <div>
              <Label htmlFor="p21-database">Database</Label>
              <Input
                id="p21-database"
                value={formData.p21.database}
                onChange={(e) => handleInputChange('p21', 'database', e.target.value)}
                placeholder="p21"
              />
            </div>
            <div>
              <Label htmlFor="p21-username">Username</Label>
              <Input
                id="p21-username"
                value={formData.p21.username}
                onChange={(e) => handleInputChange('p21', 'username', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p21-password">Password</Label>
              <Input
                id="p21-password"
                type="password"
                value={formData.p21.password}
                onChange={(e) => handleInputChange('p21', 'password', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              {isConnected ? 'Reconnect' : 'Connect'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
