"use client";

import { SearchIcon } from "@/lib/icons";
import { useState, useEffect, forwardRef } from "react";

interface SearchBoxProps {

  onSearch?: (query: string) => void;
  className?: string;
  onFocus?: () => void;
}

const SearchBox = forwardRef<HTMLDivElement, SearchBoxProps>(
  ({ onSearch, className = "", onFocus }, ref) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [currentPlaceholder, setCurrentPlaceholder] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    // Animated placeholder
    useEffect(() => {
      const placeholders = [
        "Type Here to Search...",
        "Search for Ubtan...",
        "Find Face Wash...",
        "Discover Hair Oil...",
        "Explore Skincare..."
      ];

      const handleTyping = () => {
        const current = placeholders[placeholderIndex];
        
        if (isDeleting) {
          setCurrentPlaceholder(current.substring(0, currentPlaceholder.length - 1));
          setTypingSpeed(75);
        } else {
          setCurrentPlaceholder(current.substring(0, currentPlaceholder.length + 1));
          setTypingSpeed(150);
        }

        if (!isDeleting && currentPlaceholder === current) {
          setTimeout(() => setIsDeleting(true), 1000);
        } else if (isDeleting && currentPlaceholder === "") {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      };

      const timer = setTimeout(handleTyping, typingSpeed);
      return () => clearTimeout(timer);
    }, [currentPlaceholder, isDeleting, placeholderIndex, typingSpeed]);

    // Debounced search
    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (onSearch) {
          onSearch(searchQuery);
        }
        performSearch(searchQuery);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, onSearch]);

    const performSearch = (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      const mockResults = [
        "Ubtan Face Wash",
        "Ubtan Face Scrub", 
        "Hair Growth Oil",
        "Face Cream",
        "Natural Kajal",
        "Sunscreen",
        "Face Serum"
      ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

      setSearchResults(mockResults);
    };

    return (
      <div ref={ref} className={`relative ${className}`}>
        <div className="relative flex w-full items-center gap-3 rounded-[20px] border border-solid border-gray-300_01 bg-lime-50_01 px-4 py-2 h-9">
          <input 
            className="w-full text-sm font-light text-gray-700_02 outline-none bg-transparent" 
            type="text" 
            placeholder={currentPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={onFocus}
            autoComplete="off" 
          />
          <SearchIcon />
        </div>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0">
                <p className="text-sm text-gray-700">{result}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SearchBox.displayName = "SearchBox";
export default SearchBox;