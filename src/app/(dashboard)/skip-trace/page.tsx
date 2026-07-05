'use client';

import { useState } from 'react';
import { Search, Upload, Clock, MapPin, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SkipTracePanel } from '@/components/property/SkipTracePanel';
import { BatchSkipTrace } from '@/components/property/BatchSkipTrace';
import { recentSkipTraces, runSkipTrace, SKIP_TRACE_CREDIT_COST } from '@/lib/skip-trace';
import { demoProperties } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

export default function SkipTracePage() {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ propertyId: string; address: string; ownerName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!address.trim()) return;
    setIsSearching(true);
    setIsLoading(true);

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find a matching property or create a demo result
    const found = demoProperties.find(
      (p) =>
        p.address.toLowerCase().includes(address.toLowerCase()) ||
        p.city.toLowerCase().includes(address.toLowerCase())
    );

    setSearchResult(
      found
        ? {
            propertyId: found.id,
            address: `${found.address}, ${found.city}, ${found.state} ${found.zip}`,
            ownerName: found.owner_name,
          }
        : {
            propertyId: `prop-${Date.now()}`,
            address: address,
            ownerName: 'Unknown Owner',
          }
    );

    setIsSearching(false);
    setIsLoading(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would parse the CSV
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Skip Trace</h1>
        <p className="text-muted-foreground mt-1">
          Find contact information for property owners
        </p>
      </div>

      {/* Credit Display */}
      <Card className="bg-muted/50">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">{SKIP_TRACE_CREDIT_COST}</span>
            </div>
            <div>
              <p className="font-medium">Credits per Skip Trace</p>
              <p className="text-sm text-muted-foreground">Each skip trace uses 1 credit</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">247</p>
            <p className="text-sm text-muted-foreground">Credits Available</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="single" className="space-y-6">
        <TabsList>
          <TabsTrigger value="single">Single Property</TabsTrigger>
          <TabsTrigger value="batch">Batch Upload</TabsTrigger>
          <TabsTrigger value="history">Recent History</TabsTrigger>
        </TabsList>

        {/* Single Property Search */}
        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search by Address</CardTitle>
              <CardDescription>
                Enter an address to run a skip trace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter address, city, or ZIP..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching || !address.trim()}>
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {/* Results */}
              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              )}

              {searchResult && !isLoading && (
                <div className="mt-6">
                  <div className="rounded-lg border p-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{searchResult.address}</span>
                      <Badge variant="outline">{searchResult.ownerName}</Badge>
                    </div>
                  </div>
                  <SkipTracePanel
                    propertyId={searchResult.propertyId}
                    propertyAddress={searchResult.address}
                    ownerName={searchResult.ownerName}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batch Upload */}
        <TabsContent value="batch" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Properties</CardTitle>
                <CardDescription>
                  Upload a CSV file with property addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-medium">Drop your CSV file here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                  </label>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">CSV Format:</p>
                  <code className="block bg-muted p-2 rounded text-xs">
                    address,city,state,zip,owner_name
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Batch Skip Trace */}
            <BatchSkipTrace
              properties={demoProperties.slice(0, 10)}
              onComplete={(results) => console.log('Batch complete:', results)}
            />
          </div>
        </TabsContent>

        {/* Recent History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Skip Traces</CardTitle>
              <CardDescription>
                Your last 10 skip trace searches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSkipTraces.map((trace) => (
                    <TableRow key={trace.property_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">
                            {trace.property_address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{trace.owner_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={trace.confidence_score}
                            className="h-2 w-16"
                            indicatorClassName={
                              trace.confidence_score >= 80
                                ? 'bg-green-500'
                                : trace.confidence_score >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }
                          />
                          <span className="text-sm">{trace.confidence_score}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(trace.run_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
