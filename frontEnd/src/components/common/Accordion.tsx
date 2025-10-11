import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

type AccordionItemProps = {
  title: string | React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
};

type AccordionProps = {
  items: Omit<AccordionItemProps, 'isOpen' | 'onToggle' | 'aria-expanded'>[];
  allowMultiple?: boolean;
  defaultOpenIndexes?: number[];
  className?: string;
  itemClassName?: string;
  onChange?: (openIndexes: number[]) => void;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  onToggle,
  className = '',
  headerClassName = '',
  contentClassName = '',
  icon,
  iconPosition = 'right',
  disabled = false,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState<number | string>(0);
  const IconComponent = isOpen ? ChevronUp : ChevronDown;
  const defaultIcon = (
    <IconComponent 
      className={clsx(
        'w-5 h-5 transition-transform duration-300',
        isOpen ? 'transform -rotate-180' : ''
      )} 
    />
  );

  // Update content height when isOpen or children change
  React.useEffect(() => {
    if (!contentRef.current) return;
    
    const updateHeight = () => {
      if (!contentRef.current) return;
      const height = isOpen ? contentRef.current.scrollHeight : 0;
      setContentHeight(height);
    };
    
    // Initial height update
    updateHeight();
    
    // Add resize observer to handle dynamic content changes
    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current.firstElementChild) {
      resizeObserver.observe(contentRef.current.firstElementChild);
    }
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, children]);

  return (
    <div 
      className={clsx(
        'border border-neutral-200 rounded-lg mb-4 overflow-hidden',
        'hover:border-primary-500 transition-all duration-300',
        className
      )}
    >
      <button
        type="button"
        className={clsx(
          'w-full flex items-center justify-between p-4 text-left',
          'bg-white hover:bg-gray-50',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'transition-colors duration-200',
          disabled && 'opacity-50 cursor-not-allowed',
          headerClassName
        )}
        onClick={onToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${React.useId()}`}
      >
        {iconPosition === 'left' && (
          <span className="mr-3">
            {icon || defaultIcon}
          </span>
        )}
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900">
            {title}
          </h3>
        </div>
        {iconPosition === 'right' && (
          <span className="ml-3">
            {icon || defaultIcon}
          </span>
        )}
      </button>

      <div
        id={`accordion-content-${React.useId()}`}
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          contentClassName
        )}
        style={{ height: contentHeight }}
        aria-hidden={!isOpen}
      >
        <div 
          ref={contentRef} 
          className="p-4 text-gray-600"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIndexes = [],
  className = '',
  itemClassName = '',
  onChange,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpenIndexes);

  // Initialize with defaultOpenIndexes on first render
  useEffect(() => {
    setOpenIndexes(defaultOpenIndexes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemToggle = (index: number) => {
    const newOpenIndexes = openIndexes.includes(index)
      ? openIndexes.filter(i => i !== index)
      : allowMultiple
      ? [...openIndexes, index]
      : [index];

    setOpenIndexes(newOpenIndexes);
    onChange?.(newOpenIndexes);
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div 
            key={index} 
            className={clsx('animate-slide-up', itemClassName)}
            style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
          >
            <AccordionItem
              {...item}
              isOpen={isOpen}
              onToggle={() => handleItemToggle(index)}
            />
          </div>
        );
      })}
    </div>
  );
};

// Usage Examples:
/*
// Basic Usage
<Accordion
  items={[
    { title: 'Section 1', children: 'Content 1' },
    { title: 'Section 2', children: 'Content 2' },
  ]}
/>

// With custom icons and multiple open
<Accordion
  allowMultiple
  items={[
    { 
      title: 'Section 1', 
      children: 'Content 1',
      icon: <Star className="w-5 h-5" />,
      iconPosition: 'left'
    },
  ]}
/>

// Controlled component
const [openIndexes, setOpenIndexes] = useState([0]);
<Accordion
  items={items}
  defaultOpenIndexes={openIndexes}
  onChange={setOpenIndexes}
/>
*/
