import { useState, useRef, useEffect } from 'react';

interface TextCalloutProps {
  text: string;
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'semibold';
  calloutStyle?: 'speech-bubble' | 'rectangular' | 'cloud';
  onTextChange: (newText: string) => void;
  onDoubleClick?: () => void;
}

export default function TextCallout({
  text,
  color,
  backgroundColor = '#FFFFFF',
  borderColor,
  fontSize = 16,
  fontWeight = 'normal',
  calloutStyle = 'rectangular',
  onTextChange,
  onDoubleClick,
}: TextCalloutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalText(text);
  }, [text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      autoResize();
    }
  }, [isEditing]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
    onDoubleClick?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localText.trim() !== text) {
      onTextChange(localText.slice(0, 500)); // Enforce 500 char limit
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= 500) {
      setLocalText(newText);
      autoResize();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalText(text); // Revert changes
    }
    // Allow Enter for new lines (don't stop propagation)
  };

  const displayText = localText || 'Enter your notes here';
  const effectiveBorderColor = borderColor || color;
  const fontWeightClass = fontWeight === 'bold' ? 'font-bold' : fontWeight === 'semibold' ? 'font-semibold' : 'font-normal';

  // Speech Bubble Style
  if (calloutStyle === 'speech-bubble') {
    return (
      <div className="relative" onDoubleClick={handleDoubleClick} onClick={handleClick}>
        <div
          className={`relative px-4 py-3 rounded-lg shadow-lg ${fontWeightClass} whitespace-pre-wrap`}
          style={{
            backgroundColor,
            border: `2px solid ${effectiveBorderColor}`,
            color,
            fontSize: `${fontSize}px`,
            minWidth: '120px',
            maxWidth: '300px',
          }}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={localText}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-none outline-none resize-none ${fontWeightClass}`}
              style={{
                color,
                fontSize: `${fontSize}px`,
                minHeight: '24px',
              }}
              placeholder="Enter your notes here"
              maxLength={500}
            />
          ) : (
            <div className={!localText ? 'text-gray-400 italic' : ''}>
              {displayText}
            </div>
          )}
          
          {/* Speech bubble tail */}
          <div
            className="absolute bottom-0 left-6"
            style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: `12px solid ${effectiveBorderColor}`,
              transform: 'translateY(100%)',
            }}
          />
          <div
            className="absolute bottom-0 left-6"
            style={{
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: `10px solid ${backgroundColor}`,
              transform: 'translate(2px, calc(100% - 2px))',
            }}
          />
        </div>
        
        {!isEditing && (
          <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-400 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Double-click to edit
          </div>
        )}
      </div>
    );
  }

  // Rectangular Box Style
  if (calloutStyle === 'rectangular') {
    return (
      <div className="relative" onDoubleClick={handleDoubleClick} onClick={handleClick}>
        <div
          className={`px-4 py-3 rounded-md shadow-md ${fontWeightClass} whitespace-pre-wrap`}
          style={{
            backgroundColor,
            border: `3px solid ${effectiveBorderColor}`,
            color,
            fontSize: `${fontSize}px`,
            minWidth: '120px',
            maxWidth: '300px',
          }}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={localText}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-none outline-none resize-none ${fontWeightClass}`}
              style={{
                color,
                fontSize: `${fontSize}px`,
                minHeight: '24px',
              }}
              placeholder="Enter your notes here"
              maxLength={500}
            />
          ) : (
            <div className={!localText ? 'text-gray-400 italic' : ''}>
              {displayText}
            </div>
          )}
        </div>
        
        {!isEditing && (
          <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-400 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Double-click to edit
          </div>
        )}
      </div>
    );
  }

  // Cloud Callout Style
  if (calloutStyle === 'cloud') {
    return (
      <div className="relative" onDoubleClick={handleDoubleClick} onClick={handleClick}>
        <div
          className={`relative px-4 py-3 rounded-3xl shadow-lg ${fontWeightClass} whitespace-pre-wrap`}
          style={{
            backgroundColor,
            border: `2px solid ${effectiveBorderColor}`,
            color,
            fontSize: `${fontSize}px`,
            minWidth: '120px',
            maxWidth: '300px',
          }}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={localText}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent border-none outline-none resize-none ${fontWeightClass}`}
              style={{
                color,
                fontSize: `${fontSize}px`,
                minHeight: '24px',
              }}
              placeholder="Enter your notes here"
              maxLength={500}
            />
          ) : (
            <div className={!localText ? 'text-gray-400 italic' : ''}>
              {displayText}
            </div>
          )}
          
          {/* Cloud puffs */}
          <div
            className="absolute -bottom-2 left-4 rounded-full"
            style={{
              width: '16px',
              height: '16px',
              backgroundColor,
              border: `2px solid ${effectiveBorderColor}`,
            }}
          />
          <div
            className="absolute -bottom-4 left-2 rounded-full"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor,
              border: `2px solid ${effectiveBorderColor}`,
            }}
          />
          <div
            className="absolute -bottom-5 left-0 rounded-full"
            style={{
              width: '8px',
              height: '8px',
              backgroundColor,
              border: `2px solid ${effectiveBorderColor}`,
            }}
          />
        </div>
        
        {!isEditing && (
          <div className="absolute -bottom-12 left-0 right-0 text-center text-xs text-gray-400 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            Double-click to edit
          </div>
        )}
      </div>
    );
  }

  return null;
}
