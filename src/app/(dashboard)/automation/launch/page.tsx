'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Rocket, MapPin, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATE_COUNTIES: Record<string, string[]> = {
  'Texas': ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis', 'Collin', 'Denton', 'Hidalgo', 'El Paso', 'Montgomery'],
  'Florida': ['Miami-Dade', 'Broward', 'Palm Beach', 'Hillsborough', 'Orange', 'Duval', 'Pinellas', 'Lee'],
  'Georgia': ['Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Chatham', 'Clayton'],
  'Arizona': ['Maricopa', 'Pima', 'Pinal', 'Yuma'],
  'California': ['Los Angeles', 'San Diego', 'Orange', 'Riverside', 'San Bernardino', 'Santa Clara'],
};

const DISTRESS_TYPES = [
  { id: 'foreclosure', label: 'Foreclosure', description: 'Properties currently in foreclosure' },
  { id: 'pre_foreclosure', label: 'Pre-Foreclosure', description: 'Notice of Default filed' },
  { id: 'tax_lien', label: 'Tax Lien', description: 'Delinquent property taxes' },
  { id: 'probate', label: 'Probate', description: 'Estate settlements and inheritance' },
  { id: 'vacant', label: 'Vacant', description: 'Unoccupied properties' },
  { id: 'absentee', label: 'Absentee Owner', description: 'Owner does not live at the property' },
  { id: 'high_equity', label: 'High Equity', description: 'Estimated equity > 50%' },
];

const OUTREACH_CHANNELS = [
  { id: 'direct_mail', label: 'Direct Mail', icon: <Send className="h-4 w-4" /> },
  { id: 'email', label: 'Email Campaign', icon: <Send className="h-4 w-4" /> },
  { id: 'sms', label: 'SMS / Text', icon: <Send className="h-4 w-4" /> },
  { id: 'voicemail', label: 'Ringless Voicemail', icon: <Send className="h-4 w-4" /> },
];

export default function LaunchPage() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);

  // Parameters State
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedDistresses, setSelectedDistresses] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const toggleCounty = (county: string) => {
    setSelectedCounties(prev =>
      prev.includes(county) ? prev.filter(c => c !== county) : [...prev, county]
    );
  };

  const toggleDistress = (id: string) => {
    setSelectedDistresses(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleLaunch = async () => {
    setIsLaunching(true);

    // Construct the payload for the automated workflow
    const payload = {
      state: selectedState,
      counties: selectedCounties,
      distresses: selectedDistresses,
      channels: selectedChannels,
      timestamp: new Date().toISOString(),
    };

    console.log('🚀 Launching Automated Workflow with parameters:', payload);

    try {
      // This is where we will call the Backend Orchestrator
      // For now, we simulate the launch process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Redirect to a "Monitoring" or "Campaigns" page
      router.push('/campaigns');
    } catch (error) {
      console.error('Launch failed:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Automation Control Center</h1>
        <p className="text-muted-foreground text-lg">
          Configure your target parameters and launch the automated distressed property pipeline.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Target Area */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Target Area
              </CardTitle>
              <CardDescription>Define where to search for leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>State</Label>
                <Select onValueChange={setSelectedState} value={selectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATE_COUNTIES).map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedState && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label>Counties</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-1">
                    {STATE_COUNTIES[selectedState].map(county => (
                      <div key={county} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
                        <Checkbox
                          id={county}
                          checked={selectedCounties.includes(county)}
                          onCheckedChange={() => toggleCounty(county)}
                        />
                        <Label htmlFor={county} className="text-sm font-normal cursor-pointer">{county}</Label,
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Distress Types */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Distress Indicators
              </CardTitle>
              <CardDescription>What makes a property "motivated"?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {DISTRESS_TYPES.map(type => (
                  <div key={type.id} className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
                    <Checkbox
                      id={type.id}
                      checked={selectedDistresses.includes(type.id)}
                      onCheckedChange={() => toggleDistress(type.id)}
                    />
                    <div className="grid gap-0.5">
                      <Label htmlFor={type.id} className="text-sm font-medium cursor-pointer">{type.label}</Label>
                      <p className="text-[10px] text-muted-foreground leading-tight">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Outreach & Launch */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Outreach Channels
              </CardTitle>
              <CardDescription>How should we contact them?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {OUTREACH_CHANNELS.map(channel => (
                  <div key={channel.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      {channel.icon}
                      <Label className="text-sm font-normal cursor-pointer">{channel.label}</Label>
                    </div>
                    <Checkbox
                      checked={selectedChannels.includes(channel.id)}
                      onCheckedChange={() => toggleChannel(channel.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleLaunch}
            disabled={isLaunching || !selectedState || selectedCounties.length === 0 || selectedDistresses.length === 0 || selectedChannels.length === 0}
            className="w-full py-8 text-lg font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            size="lg"
          >
            {isLaunching ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Launching Automation...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-6 w-6" />
                LAUNCH WORKFLOW
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-12 p-6 border rounded-xl bg-muted/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Active Parameters:</span>
          <div className="flex flex-wrap gap-2">
            {selectedState && <Badge variant="outline">{selectedState}</Badge>}
            {selectedCounties.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
            {selectedDistresses.map(d => <Badge key={d} variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200">{d}</Badge>}
            {selectedChannels.map(c => <Badge key={c} variant="outline" className="bg-primary/10 text-primary border-primary/20">{c}</Badge>)}
          </div>
        </div>
        <div className="text-xs text-muted-foreground italic">
          Clicking launch will trigger the full pipeline: Scrape → Classify → Enrich → Score → Outreach.
        </div>
      </div>
    </div>
  );
}
