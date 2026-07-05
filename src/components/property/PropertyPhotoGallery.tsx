"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Generate placeholder images with gradient backgrounds
function generatePlaceholderImages(propertyId: string, count: number = 6) {
  const gradients = [
    "from-[#1a56db] to-[#3b82f6]",
    "from-[#f97316] to-[#fb923c]",
    "from-[#10b981] to-[#34d399]",
    "from-[#8b5cf6] to-[#a78bfa]",
    "from-[#ec4899] to-[#f472b6]",
    "from-[#06b6d4] to-[#22d3ee]",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `${propertyId}-img-${i}`,
    url: "",
    gradient: gradients[i % gradients.length],
    label: ["Front View", "Back Yard", "Living Room", "Kitchen", "Bedroom", "Bathroom"][i],
  }));
}

interface PropertyPhotoGalleryProps {
  propertyId: string;
  address: string;
  className?: string;
}

export function PropertyPhotoGallery({ propertyId, address, className }: PropertyPhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = generatePlaceholderImages(propertyId);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const currentImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <div
          className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${images[0].gradient}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium opacity-75">{images[0].label}</p>
                <p className="text-sm opacity-50">{address}</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View Full Size
            </span>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={image.id}
              className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index + 1)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${image.gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-75">{image.label}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </div>
          ))}
          {images.length > 5 && (
            <div
              className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden cursor-pointer bg-muted flex items-center justify-center"
              onClick={() => openLightbox(5)}
            >
              <span className="text-sm font-medium text-muted-foreground">
                +{images.length - 5} more
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <div className="relative h-[80vh] flex flex-col">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Main Image */}
            {currentImage && (
              <div className="flex-1 flex items-center justify-center relative">
                <div className={`w-full h-full bg-gradient-to-br ${currentImage.gradient}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ImageIcon className="h-24 w-24 mx-auto mb-4 opacity-50" />
                      <p className="text-2xl font-medium opacity-75">{currentImage.label}</p>
                      <p className="text-sm opacity-50">{address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 p-4 justify-center overflow-x-auto bg-black/50">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedIndex === index ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${image.gradient}`} />
                </div>
              ))}
            </div>

            {/* Counter */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex !== null ? `${selectedIndex + 1} / ${images.length}` : ""}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
