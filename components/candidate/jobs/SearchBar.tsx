"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  Briefcase,
  Building2,
  Tag,
  X,
  TrendingUp,
} from "lucide-react";

interface SearchSuggestion {
  type: "recent" | "job" | "company" | "skill";
  text: string;
  icon: typeof Search;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  popularTags?: string[];
}

export default function SearchBar({
  onSearch,
  placeholder = "Job title, skills, or company...",
  popularTags = [
    "React Developer",
    "Node.js",
    "UI Designer",
    "Data Analyst",
    "Product Manager",
    "DevOps Engineer",
  ],
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState(["Frontend Developer", "UX Designer"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions: SearchSuggestion[] = [
    ...recentSearches.map((text) => ({
      type: "recent" as const,
      text,
      icon: Clock,
    })),
    ...(query.length > 0
      ? [
          {
            type: "job" as const,
            text: "Frontend Developer",
            icon: Briefcase,
          },
          {
            type: "job" as const,
            text: "Full Stack Engineer",
            icon: Briefcase,
          },
          { type: "company" as const, text: "Google", icon: Building2 },
          { type: "company" as const, text: "Microsoft", icon: Building2 },
          { type: "skill" as const, text: "React.js", icon: Tag },
          { type: "skill" as const, text: "TypeScript", icon: Tag },
        ]
      : []),
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    onSearch(text);
    setShowSuggestions(false);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    onSearch(tag);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div ref={containerRef} className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate/20 bg-white py-4 pl-12 pr-12 text-midnight shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate" />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate hover:text-midnight"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="ml-3 flex items-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90"
          >
            <Search className="h-5 w-5" />
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions &&
            (query.length > 0 || recentSearches.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full z-50 mt-2 w-full rounded-xl border border-slate/15 bg-white p-2 shadow-xl"
              >
                {recentSearches.length > 0 && query.length === 0 && (
                  <div className="mb-2 border-b border-slate/10 pb-2">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate">
                      Recent Searches
                    </p>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-midnight hover:bg-surface transition"
                      >
                        <Clock className="h-4 w-4 text-slate" />
                        {search}
                      </button>
                    ))}
                  </div>
                )}

                {query.length > 0 && (
                  <div>
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate">
                      Suggestions
                    </p>
                    {suggestions.slice(2).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-midnight hover:bg-surface transition"
                      >
                        <suggestion.icon className="h-4 w-4 text-slate" />
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Popular Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-slate">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">Popular:</span>
        </div>
        {popularTags.map((tag) => (
          <motion.button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="rounded-full border border-slate/20 bg-white px-3 py-1 text-xs font-medium text-midnight hover:border-primary hover:bg-primary/5 hover:text-primary transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tag}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
