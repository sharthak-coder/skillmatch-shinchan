'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  badgeColor?: 'red' | 'yellow' | 'blue';
}

export default function TagInput({
  label,
  value = [],
  onChange,
  suggestions = [],
  placeholder = 'Type a skill and press Enter...',
  maxTags = 12,
  badgeColor = 'yellow',
}: TagInputProps) {
  const [inputVal, setInputVal] = useState('');

  const handleAdd = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed) return;
    if (value.map((t) => t.toLowerCase()).includes(trimmed)) {
      setInputVal('');
      return;
    }
    if (value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onChange(value.filter((t) => t !== tagToRemove));
  };

  const colorStyles = {
    yellow: 'bg-shin-yellow text-shin-ink border-shin-ink',
    red: 'bg-shin-red text-white border-shin-ink',
    blue: 'bg-shin-blue text-white border-shin-ink',
  }[badgeColor];

  // Suggestions that aren't added yet
  const availableSuggestions = suggestions
    .filter((s) => !value.map((t) => t.toLowerCase()).includes(s.toLowerCase()))
    .slice(0, 6);

  return (
    <div className="w-full flex flex-col gap-2 text-left">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-shin-ink uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[11px] font-bold text-shin-ink/50">
            {value.length}/{maxTags}
          </span>
        </div>
      )}

      {/* Main Tag Container Box */}
      <div className="min-h-[52px] p-2 rounded-2xl bg-white border-2 border-shin-ink shadow-pop-sm flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-shin-yellow transition-all">
        <AnimatePresence>
          {value.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border shadow-pop-sm capitalize ${colorStyles}`}
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="p-0.5 rounded-full hover:bg-black/20 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[140px] px-2 py-1 bg-transparent text-xs sm:text-sm font-semibold text-shin-ink placeholder:text-shin-ink/40 focus:outline-none"
        />
      </div>

      {/* Quick Suggestions Chips */}
      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          <span className="text-[10px] font-black uppercase text-shin-ink/50 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-shin-yellow" /> Quick Add:
          </span>
          {availableSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAdd(suggestion)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-shin-canvas border border-shin-ink/40 text-[11px] font-bold text-shin-ink hover:bg-shin-yellow hover:border-shin-ink transition-colors"
            >
              <Plus className="w-2.5 h-2.5" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
