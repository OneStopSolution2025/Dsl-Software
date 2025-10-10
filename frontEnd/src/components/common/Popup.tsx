import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    
    const styles: Record<PopupPosition, React.CSSProperties> = {
      'top': {
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '8px',
      },
      'right': {
        position: 'absolute',
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '8px',
      },
      'bottom': {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '8px',
      },
      'left': {
        position: 'absolute',
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '8px',
      },
      'top-right': {
        position: 'absolute',
        bottom: '100%',
        right: 0,
        marginBottom: '8px',
      },
      'top-left': {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        marginBottom: '8px',
      },
      'bottom-right': {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
      },
      'bottom-left': {
        position: 'absolute',
        top: '100%',
        left: 0,
        marginTop: '8px',
      },
    };

    setPositionStyle(styles[position]);
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
          className={`z-50 bg-blue-50 rounded-lg shadow-lg p-3 text-sm text-neutral-800 border border-neutral-200 w-fit ${className}`}
          style={positionStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
          <div 
            className="absolute w-3 h-3 bg-blue-50 transform rotate-45 -z-10 border-t border-l"
            style={{
              ...(position === 'top' && { bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' }),
              ...(position === 'right' && { left: '-6px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' }),
              ...(position === 'bottom' && { top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' }),
              ...(position === 'left' && { right: '-6px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' }),
              ...(position === 'top-right' && { bottom: '-6px', right: '10px', transform: 'rotate(45deg)' }),
              ...(position === 'top-left' && { bottom: '-6px', left: '10px', transform: 'rotate(45deg)' }),
              ...(position === 'bottom-right' && { top: '-6px', right: '10px', transform: 'rotate(45deg)' }),
              ...(position === 'bottom-left' && { top: '-6px', left: '10px', transform: 'rotate(45deg)' }),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Popup;
