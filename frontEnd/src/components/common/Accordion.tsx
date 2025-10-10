import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

type AccordionItemProps = {
  title: string | ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
};

type AccordionProps = {
  items: Omit<AccordionItemProps, 'isOpen' | 'onToggle'>[];
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  const IconComponent = isOpen ? ChevronUp : ChevronDown;
  const defaultIcon = <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />;

  return (
    <div className={clsx(
      'border border-neutral-200 rounded-lg mb-4 overflow-hidden',
      'hover:border-primary-500 hover:-translate-y-1',
      'transition-all duration-300 ease-out',
      className
    )}>
      <button
        type="button"
        className={clsx(
          'w-full flex items-center justify-between p-2 text-left group',
          'bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md',
          'hover:from-white/25 hover:to-white/10 hover:shadow-lg',
          'focus:outline-none focus:ring-4 focus:ring-primary-500/20',
          'transition-all duration-300',
          disabled && 'opacity-50 cursor-not-allowed',
          headerClassName
        )}
        onClick={onToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        {iconPosition === 'left' && (icon || defaultIcon)}
        <div className="flex-1 px-3">
          <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
            {title}
          </h3>
        </div>
        {iconPosition === 'right' && (icon || defaultIcon)}
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          contentClassName
        )}
        // style={{ height: `${contentHeight}px` }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="p-4 bg-gradient-to-b from-transparent to-primary-50/30">
          <div className="text-neutral-700 leading-relaxed">
            {children}
          </div>
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

  const handleItemClick = (index: number) => {
    let newOpenIndexes: number[];

    if (allowMultiple) {
      newOpenIndexes = openIndexes.includes(index)
        ? openIndexes.filter((i) => i !== index)
        : [...openIndexes, index];
    } else {
      newOpenIndexes = openIndexes.includes(index) ? [] : [index];
    }

    setOpenIndexes(newOpenIndexes);
    onChange?.(newOpenIndexes);
  };

  return (
    <div className={clsx('w-full space-y-2', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={clsx(
            'animate-slide-up',
            itemClassName
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <AccordionItem
            {...item}
            isOpen={openIndexes.includes(index)}
            onToggle={() => handleItemClick(index)}
          />
        </div>
      ))}
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
