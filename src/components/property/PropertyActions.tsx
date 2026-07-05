"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ListPlus,
  Heart,
  Share2,
  Printer,
  Search,
  BarChart3,
  Plus,
  ChevronDown,
  CreditCard,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface PropertyActionsProps {
  propertyId: string;
  propertyAddress: string;
}

// Sample lists for the dropdown
const sampleLists = [
  { id: "list-1", name: "Hot Leads" },
  { id: "list-2", name: "Call List" },
  { id: "list-3", name: "Mail Campaign" },
];

export function PropertyActions({ propertyId, propertyAddress }: PropertyActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAddToList = async (listId: string, listName: string) => {
    setIsLoading(listId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(null);
    toast.success(`Added to "${listName}"`, {
      description: propertyAddress,
    });
  };

  const handleSkipTrace = () => {
    setIsLoading("skip-trace");
    // Simulate API call
    setTimeout(() => {
      setIsLoading(null);
      toast.success("Skip trace started", {
        description: "Results will be available in your account shortly. (5 credits used)",
      });
    }, 1000);
  };

  const handleGetComps = () => {
    setIsLoading("get-comps");
    setTimeout(() => {
      setIsLoading(null);
      toast.success("Comps generated", {
        description: "5 comparable properties found in your area.",
      });
    }, 800);
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved to favorites", {
      description: propertyAddress,
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/property/${propertyId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard", {
      description: shareUrl,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add to List */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <ListPlus className="h-4 w-4" />
              Add to List
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem disabled className="text-muted-foreground text-xs">
              Select a list
            </DropdownMenuItem>
            {sampleLists.map((list) => (
              <DropdownMenuItem
                key={list.id}
                onClick={() => handleAddToList(list.id, list.name)}
                disabled={isLoading === list.id}
              >
                {isLoading === list.id ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2 opacity-0" />
                )}
                {list.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#1a56db]">
              <Plus className="h-4 w-4 mr-2" />
              Create New List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Run Skip Trace */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleSkipTrace}
          disabled={isLoading === "skip-trace"}
        >
          {isLoading === "skip-trace" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Run Skip Trace
          <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            5 credits
          </span>
        </Button>

        {/* Get Comps */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleGetComps}
          disabled={isLoading === "get-comps"}
        >
          {isLoading === "get-comps" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BarChart3 className="h-4 w-4" />
          )}
          Get Comps
        </Button>

        <div className="h-px bg-border my-2" />

        {/* Save Property */}
        <Button
          variant="outline"
          className={`w-full justify-start gap-2 ${isSaved ? "text-[#1a56db] border-[#1a56db]" : ""}`}
          onClick={handleSaveToggle}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          {isSaved ? "Saved" : "Save Property"}
        </Button>

        {/* Share */}
        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        {/* Print */}
        <Button variant="outline" className="w-full justify-start gap-2" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </CardContent>
    </Card>
  );
}
