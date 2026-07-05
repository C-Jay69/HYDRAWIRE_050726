'use client';

import { useState } from 'react';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertFrequency, alertFrequencyLabels } from '@/lib/alerts';
import { cn } from '@/lib/utils';

interface AlertSettingsProps {
  className?: string;
}

export function AlertSettings({ className }: AlertSettingsProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [defaultFrequency, setDefaultFrequency] = useState<AlertFrequency>('daily');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alert Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how you want to receive notifications for your saved searches.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor="email-notifications" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts when new properties match your saved searches.
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        {/* In-App Notifications */}
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor="inapp-notifications" className="font-medium">
                In-App Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Show notifications within the application.
              </p>
            </div>
          </div>
          <Switch
            id="inapp-notifications"
            checked={inAppNotifications}
            onCheckedChange={setInAppNotifications}
          />
        </div>

        {/* Default Alert Frequency */}
        <div className="space-y-2">
          <Label htmlFor="default-frequency">Default Alert Frequency</Label>
          <Select value={defaultFrequency} onValueChange={(v) => setDefaultFrequency(v as AlertFrequency)}>
            <SelectTrigger id="default-frequency" className="w-full sm:w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(alertFrequencyLabels) as AlertFrequency[]).map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {alertFrequencyLabels[freq]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This will be the default frequency when creating new saved searches.
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
            {isSaving ? (
              'Saving...'
            ) : saved ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
