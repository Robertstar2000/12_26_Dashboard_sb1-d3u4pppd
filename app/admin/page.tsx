'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminData } from '@/lib/hooks/useAdminData';
import AdminSpreadsheet from '@/components/admin/AdminSpreadsheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RefreshCcw, Save, HelpCircle, AlertCircle } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showError } from '@/lib/utils/toast';
import { DatabaseConnectionDialog } from '@/components/DatabaseConnectionDialog';
import { HelpDialog } from '@/components/admin/HelpDialog';
import { ResetDialog } from '@/components/admin/ResetDialog';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [dbDialogOpen, setDbDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const {
    data,
    editedData,
    loading,
    error,
    isRunning,
    isRealTime,
    pendingChanges,
    startPolling,
    stopPolling,
    toggleRealTime,
    updateVariable,
    setPendingChanges,
    setEditedData,
    refresh,
    handleDatabaseConnect,
    p21Connected,
  } = useAdminData();

  useEffect(() => {
    if (error) {
      showError('Error', error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setDbDialogOpen(true)}>
            {p21Connected ? 'P21 Connected' : 'Connect to P21'}
          </Button>
          <Button variant="outline" onClick={() => setHelpDialogOpen(true)}>
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Controls</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="time-mode"
                    checked={isRealTime}
                    onCheckedChange={toggleRealTime}
                  />
                  <Label htmlFor="time-mode" className="text-sm">
                    Real Time
                  </Label>
                </div>
                {Object.keys(pendingChanges).length > 0 && (
                  <Button 
                    onClick={() => {
                      setPendingChanges({});
                      setEditedData(data);
                    }}
                    className="ml-6 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={isRunning ? stopPolling : startPolling}
                className="gap-2"
              >
                {isRunning ? 'Stop Updates' : 'Start Updates'}
              </Button>
              <Button
                variant="outline"
                onClick={refresh}
                className="gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => setResetDialogOpen(true)}
                className="gap-2"
              >
                Reset to Initial Values
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminSpreadsheet
              data={data}
              editedData={editedData}
              pendingChanges={pendingChanges}
              onUpdateVariable={updateVariable}
              setPendingChanges={setPendingChanges}
              setEditedData={setEditedData}
            />
          </CardContent>
        </Card>
      </div>

      <DatabaseConnectionDialog
        open={dbDialogOpen}
        onOpenChange={setDbDialogOpen}
        onConnect={handleDatabaseConnect}
        isConnected={p21Connected}
      />
      <ResetDialog 
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        onConfirmReset={() => {
          setPendingChanges({});
          setEditedData(data);
        }}
      />
      <HelpDialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen} />
      <Toaster />
    </div>
  );
}