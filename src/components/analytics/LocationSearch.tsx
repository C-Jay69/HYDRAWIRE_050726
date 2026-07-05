'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { searchCities, CityData } from '@/lib/market-data';
import { Search, MapPin, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationSearchProps {
  onSelect: (city: CityData) => void;
  selectedCity?: CityData | null;
}

export function LocationSearch({ onSelect, selectedCity }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<CityData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('recentCitySearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const results = searchCities(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = (city: CityData) => {
    onSelect(city);
    setQuery('');
    setShowSuggestions(false);

    const updated = [city, ...recentSearches.filter((c) => c.name !== city.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentCitySearches', JSON.stringify(updated));
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentCitySearches');
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search city, zip code, or county..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-0">
            {query.length >= 2 ? (
              suggestions.length > 0 ? (
                <div className="py-1">
                  {suggestions.map((city) => (
                    <button
                      key={`${city.name}-${city.state}`}
                      onClick={() => handleSelect(city)}
                      className="w-full px-4 py-2 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {city.name}, {city.state}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {city.total_listings.toLocaleString()} listings
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-muted-foreground">
                  No cities found for &quot;{query}&quot;
                </div>
              )
            ) : recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={clearRecentSearches}
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.map((city) => (
                  <button
                    key={`recent-${city.name}-${city.state}`}
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-2 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {city.name}, {city.state}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {city.total_listings.toLocaleString()} listings
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
