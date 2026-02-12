"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReadMoreTextProps {
  text: string;
  maxLength?: number;
}

export function ReadMoreText({ text, maxLength = 200 }: ReadMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (text.length <= maxLength) {
    return <p className="text-neutral-700 leading-relaxed">{text}</p>;
  }
  
  const displayText = isExpanded ? text : text.slice(0, maxLength) + '...';
  
  return (
    <div>
      <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{displayText}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 inline-flex items-center gap-1 text-neutral-900 font-semibold hover:underline"
      >
        {isExpanded ? (
          <>
            Read less
            <ChevronUp size={16} />
          </>
        ) : (
          <>
            Read more
            <ChevronDown size={16} />
          </>
        )}
      </button>
    </div>
  );
}
