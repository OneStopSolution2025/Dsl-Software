import { RotateCcw, RotateCw, ZoomIn, ZoomOut, FlipHorizontal, FlipVertical, Trash2, Palette, Type, MessageSquareText, MessageSquare, MessageCircle, Edit3 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TransformControlsProps {
  onRotate: (direction: 'cw' | 'ccw') => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onDelete: () => void;
  onColorChange?: (color: string) => void;
  currentColor?: string;
  showColorPicker?: boolean;
  position: { x: number; y: number, h: number, w: number };
  // Text callout specific props
  isTextCallout?: boolean;
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'semibold';
  calloutStyle?: 'speech-bubble' | 'rectangular' | 'cloud';
  backgroundColor?: string;
  onTextChange?: (text: string) => void;
  onFontSizeChange?: (size: number) => void;
  onFontWeightChange?: (weight: 'normal' | 'bold' | 'semibold') => void;
  onCalloutStyleChange?: (style: 'speech-bubble' | 'rectangular' | 'cloud') => void;
  onBackgroundColorChange?: (color: string) => void;
  onEditText?: () => void;
}

const PRESET_COLORS = [
  '#000000', // Black
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#64748B', // Slate
  '#FFFFFF', // White
];

export default function TransformControls({
  onRotate,
  onScaleUp,
  onScaleDown,
  onFlipHorizontal,
  onFlipVertical,
  onDelete,
  onColorChange,
  currentColor = '#3B82F6',
  showColorPicker = true,
  position,
  // Text callout props
  isTextCallout = false,
  text = '',
  fontSize = 16,
  fontWeight = 'normal',
  calloutStyle = 'rectangular',
  backgroundColor = '#FFFFFF',
  onTextChange,
  onFontSizeChange,
  onFontWeightChange,
  onCalloutStyleChange,
  onBackgroundColorChange,
  onEditText,
}: TransformControlsProps) {
  const [showColorPickerDropdown, setShowColorPickerDropdown] = useState(false);
  const [showBgColorPickerDropdown, setShowBgColorPickerDropdown] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorButtonRef = useRef<HTMLButtonElement>(null);
  const bgColorButtonRef = useRef<HTMLButtonElement>(null);
  const bgColorPickerRef = useRef<HTMLDivElement>(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [bgPickerPosition, setBgPickerPosition] = useState({ top: 0, left: 0 });

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node) &&
          colorButtonRef.current && !colorButtonRef.current.contains(event.target as Node)) {
        setShowColorPickerDropdown(false);
      }
      if (bgColorPickerRef.current && !bgColorPickerRef.current.contains(event.target as Node) &&
          bgColorButtonRef.current && !bgColorButtonRef.current.contains(event.target as Node)) {
        setShowBgColorPickerDropdown(false);
      }
    };

    if (showColorPickerDropdown || showBgColorPickerDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPickerDropdown, showBgColorPickerDropdown]);

  // Update picker position when button is clicked
  const handleColorButtonClick = () => {
    if (colorButtonRef.current) {
      const rect = colorButtonRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
    setShowColorPickerDropdown(!showColorPickerDropdown);
  };

  const handleBgColorButtonClick = () => {
    if (bgColorButtonRef.current) {
      const rect = bgColorButtonRef.current.getBoundingClientRect();
      setBgPickerPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
    setShowBgColorPickerDropdown(!showBgColorPickerDropdown);
  };

  return (
    <div
      className="absolute bg-white shadow-2xl rounded-xl border border-gray-200/80 backdrop-blur-sm z-50 overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '280px',
      }}
    >
      {/* Header with gradient */}
      <div className="px-3 py-2 bg-gradient-to-r from-primary-500 to-blue-500 flex items-center justify-between">
        <span className="text-xs font-semibold text-white uppercase tracking-wide">Transform Tools</span>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-white/20 rounded transition-colors text-white"
          title="Delete Marker"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Controls */}
      <div className="p-2.5 space-y-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {/* Rotation & Scale Row - Hide for text callouts */}
        {!isTextCallout && (
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => onRotate('ccw')}
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Rotate CCW"
              >
                <RotateCcw className="w-4 h-4 text-gray-700" />
              </button>
              <div className="w-px h-5 bg-gray-300" />
              <button
                onClick={() => onRotate('cw')}
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Rotate CW"
              >
                <RotateCw className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              <button
                onClick={onScaleDown}
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Scale Down"
              >
                <ZoomOut className="w-4 h-4 text-gray-700" />
              </button>
              <div className="w-px h-5 bg-gray-300" />
              <button
                onClick={onScaleUp}
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Scale Up"
              >
                <ZoomIn className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        )}

        {/* Flip Controls - Hide for text callouts */}
        {!isTextCallout && (
          <div className="flex gap-2">
            <button
              onClick={onFlipHorizontal}
              className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">H-Flip</span>
            </button>
            <button
              onClick={onFlipVertical}
              className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              title="Flip Vertical"
            >
              <FlipVertical className="w-4 h-4 text-gray-700" />
              <span className="text-xs font-medium text-gray-700">V-Flip</span>
            </button>
          </div>
        )}

        {/* Text Callout Controls - Only show for text callouts */}
        {isTextCallout && (
          <>
            {/* Font Size Control */}
            {onFontSizeChange && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Type className="w-3.5 h-3.5" />
                    Font Size
                  </label>
                  <span className="text-xs font-semibold text-primary-600">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
            )}

            {/* Font Weight Control */}
            {onFontWeightChange && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Font Weight</label>
                <div className="flex gap-1">
                  <button
                    onClick={() => onFontWeightChange('normal')}
                    className={`flex-1 px-2 py-1.5 text-xs rounded transition-colors ${
                      fontWeight === 'normal'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => onFontWeightChange('semibold')}
                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded transition-colors ${
                      fontWeight === 'semibold'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Semibold
                  </button>
                  <button
                    onClick={() => onFontWeightChange('bold')}
                    className={`flex-1 px-2 py-1.5 text-xs font-bold rounded transition-colors ${
                      fontWeight === 'bold'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Bold
                  </button>
                </div>
              </div>
            )}

            {/* Callout Style Control */}
            {onCalloutStyleChange && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Callout Style</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => onCalloutStyleChange('speech-bubble')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                      calloutStyle === 'speech-bubble'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Speech Bubble"
                  >
                    <MessageSquareText className="w-4 h-4" />
                    <span className="text-[9px]">Speech</span>
                  </button>
                  <button
                    onClick={() => onCalloutStyleChange('rectangular')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                      calloutStyle === 'rectangular'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Rectangular Box"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-[9px]">Box</span>
                  </button>
                  <button
                    onClick={() => onCalloutStyleChange('cloud')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                      calloutStyle === 'cloud'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Cloud Callout"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[9px]">Cloud</span>
                  </button>
                </div>
              </div>
            )}

            {/* Background Color Picker for Text Callouts */}
            {onBackgroundColorChange && (
              <div className="relative">
                <button
                  ref={bgColorButtonRef}
                  onClick={handleBgColorButtonClick}
                  className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Background Color"
                >
                  <span className="text-xs font-medium text-gray-700">Background</span>
                  <div
                    className="w-6 h-6 rounded border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor }}
                  />
                </button>

                {/* Background Color Picker Dropdown */}
                {showBgColorPickerDropdown && createPortal(
                  <div 
                    ref={bgColorPickerRef}
                    className="fixed bg-white shadow-2xl rounded-lg p-3 z-[9999] border border-gray-200"
                    style={{
                      top: `${bgPickerPosition.top}px`,
                      left: `${bgPickerPosition.left}px`,
                      minWidth: '280px',
                    }}
                  >
                    <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Background Color</p>
                    <div className="grid grid-cols-6 gap-1.5 mb-3">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            onBackgroundColorChange(color);
                            setShowBgColorPickerDropdown(false);
                          }}
                          className={`w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform ${
                            backgroundColor === color ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    
                    {/* Custom Color Input */}
                    <div className="pt-2 border-t border-gray-200">
                      <label className="text-xs font-medium text-gray-600 block mb-1">Custom Color</label>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => onBackgroundColorChange(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                      />
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            )}

            {/* Live Text Editor for Text Callouts */}
            {onTextChange && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => onTextChange(e.target.value.slice(0, 500))}
                  placeholder="Enter your notes here"
                  maxLength={500}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  style={{
                    minHeight: '80px',
                    maxHeight: '150px',
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Multi-line supported</span>
                  <span>{text.length}/500</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Color Picker - only show for colorChangeable icons */}
        {showColorPicker && onColorChange && (
          <div className="relative">
            <button
              ref={colorButtonRef}
              onClick={handleColorButtonClick}
              className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              title="Change Color"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-700" />
                <span className="text-xs font-medium text-gray-700">Color</span>
              </div>
              <div
                className="w-6 h-6 rounded border-2 border-white shadow-sm"
                style={{ backgroundColor: currentColor }}
              />
            </button>

            {/* Color Picker Dropdown - Rendered via Portal */}
            {showColorPickerDropdown && createPortal(
              <div 
                ref={colorPickerRef}
                className="fixed bg-white shadow-2xl rounded-lg p-3 z-[9999] border border-gray-200"
                style={{
                  top: `${pickerPosition.top}px`,
                  left: `${pickerPosition.left}px`,
                  minWidth: '280px',
                }}
              >
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Select Color</p>
                <div className="grid grid-cols-6 gap-1.5 mb-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        onColorChange?.(color);
                        setShowColorPickerDropdown(false);
                      }}
                      className={`w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform ${
                        currentColor === color ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                
                {/* Custom Color Input */}
                <div className="pt-2 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Custom Color</label>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => onColorChange?.(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer border border-gray-300"
                  />
                </div>
              </div>,
              document.body
            )}
          </div>
        )}
      </div>
    </div>
  );
}
