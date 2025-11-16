import React, { useState, useRef, useEffect } from 'react';

type PopupPosition = 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface PopupProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: PopupPosition;
  trigger?: 'hover' | 'click';
  className?: string;
}

export const Popup: React.FC<PopupProps> = ({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !popupRef.current) return;
    
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      if (!triggerRef.current || !popupRef.current) return;
      
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = triggerRect.top - popupRect.height - 8;
          left = triggerRect.left + (triggerRect.width / 2) - (popupRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width / 2) - (popupRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (popupRect.height / 2);
          left = triggerRect.left - popupRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (popupRect.height / 2);
          left = triggerRect.right + 8;
          break;
        case 'top-left':
          top = triggerRect.top - popupRect.height - 8;
          left = triggerRect.left;
          break;
        case 'top-right':
          top = triggerRect.top - popupRect.height - 8;
          left = triggerRect.right - popupRect.width;
          break;
        case 'bottom-left':
          top = triggerRect.bottom + 8;
          left = triggerRect.left;
          break;
        case 'bottom-right':
          top = triggerRect.bottom + 8;
          left = triggerRect.right - popupRect.width;
          break;
      }
      
      setPositionStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
      });
    });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isVisible]);


  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      updatePosition();
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      updatePosition();
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible && trigger === 'click') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, trigger]);

  // Update position whenever popup becomes visible
  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible]);

  return (
    <div 
      ref={triggerRef}
      className="inline-block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {isVisible && (
        <div
          ref={popupRef}
          className={`fixed z-[9999] bg-blue-50 rounded-lg shadow-lg p-3 text-sm text-neutral-800 border border-neutral-200 w-fit whitespace-nowrap ${className}`}
          style={positionStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
          <div 
            className="absolute w-3 h-3 bg-blue-50 transform rotate-45 -z-10 border border-neutral-200"
            style={{
              ...(position === 'top' && { bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderTop: 'none', borderLeft: 'none' }),
              ...(position === 'right' && { left: '-6px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderTop: 'none', borderRight: 'none' }),
              ...(position === 'bottom' && { top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderBottom: 'none', borderRight: 'none' }),
              ...(position === 'left' && { right: '-6px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderBottom: 'none', borderLeft: 'none' }),
              ...(position === 'top-right' && { bottom: '-6px', right: '10px', transform: 'rotate(45deg)', borderTop: 'none', borderLeft: 'none' }),
              ...(position === 'top-left' && { bottom: '-6px', left: '10px', transform: 'rotate(45deg)', borderTop: 'none', borderLeft: 'none' }),
              ...(position === 'bottom-right' && { top: '-6px', right: '10px', transform: 'rotate(45deg)', borderBottom: 'none', borderRight: 'none' }),
              ...(position === 'bottom-left' && { top: '-6px', left: '10px', transform: 'rotate(45deg)', borderBottom: 'none', borderRight: 'none' }),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Popup;
