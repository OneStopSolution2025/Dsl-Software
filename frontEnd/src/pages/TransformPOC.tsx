import { useState, useRef, useEffect } from 'react';
import { CarIcon } from '../components/map/MapIconsSVG';
import { RotateCw, RotateCcw, FlipHorizontal2, FlipVertical2, Trash2, Move, Maximize2 } from 'lucide-react';

interface TransformableMarker {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  color: string;
}

type HandleType = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | 'rotate' | 'move' | null;

export default function TransformPOC() {
  const [marker, setMarker] = useState<TransformableMarker>({
    id: '1',
    x: 300,
    y: 200,
    width: 100,
    height: 100,
    rotation: 0,
    flipX: false,
    flipY: false,
    color: '#3B82F6',
  });

  const [isSelected, setIsSelected] = useState(true);
  const [dragState, setDragState] = useState<{
    type: HandleType;
    startX: number;
    startY: number;
    startMarkerX: number;
    startMarkerY: number;
    startWidth: number;
    startHeight: number;
    startRotation: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on handles
  const handleMouseDown = (e: React.MouseEvent, type: HandleType) => {
    e.stopPropagation();
    if (type === null) return;

    setDragState({
      type,
      startX: e.clientX,
      startY: e.clientY,
      startMarkerX: marker.x,
      startMarkerY: marker.y,
      startWidth: marker.width,
      startHeight: marker.height,
      startRotation: marker.rotation,
    });
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      if (dragState.type === 'move') {
        // Move marker
        setMarker((prev) => ({
          ...prev,
          x: dragState.startMarkerX + deltaX,
          y: dragState.startMarkerY + deltaY,
        }));
      } else if (dragState.type === 'rotate') {
        // Calculate rotation angle
        const centerX = dragState.startMarkerX + dragState.startWidth / 2;
        const centerY = dragState.startMarkerY + dragState.startHeight / 2;

        const startAngle = Math.atan2(
          dragState.startY - centerY,
          dragState.startX - centerX
        );
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

        const angleDelta = (currentAngle - startAngle) * (180 / Math.PI);
        const newRotation = (dragState.startRotation + angleDelta) % 360;

        setMarker((prev) => ({
          ...prev,
          rotation: newRotation,
        }));
      } else {
        // Handle corner resize
        let newWidth = dragState.startWidth;
        let newHeight = dragState.startHeight;
        let newX = dragState.startMarkerX;
        let newY = dragState.startMarkerY;

        // Convert delta based on rotation
        const rad = (marker.rotation * Math.PI) / 180;
        const rotatedDeltaX = deltaX * Math.cos(rad) + deltaY * Math.sin(rad);
        const rotatedDeltaY = -deltaX * Math.sin(rad) + deltaY * Math.cos(rad);

        switch (dragState.type) {
          case 'se':
            // Bottom-right corner
            newWidth = Math.max(30, dragState.startWidth + rotatedDeltaX);
            newHeight = Math.max(30, dragState.startHeight + rotatedDeltaY);
            break;
          case 'sw':
            // Bottom-left corner
            newWidth = Math.max(30, dragState.startWidth - rotatedDeltaX);
            newHeight = Math.max(30, dragState.startHeight + rotatedDeltaY);
            newX = dragState.startMarkerX + deltaX;
            break;
          case 'ne':
            // Top-right corner
            newWidth = Math.max(30, dragState.startWidth + rotatedDeltaX);
            newHeight = Math.max(30, dragState.startHeight - rotatedDeltaY);
            newY = dragState.startMarkerY + deltaY;
            break;
          case 'nw':
            // Top-left corner
            newWidth = Math.max(30, dragState.startWidth - rotatedDeltaX);
            newHeight = Math.max(30, dragState.startHeight - rotatedDeltaY);
            newX = dragState.startMarkerX + deltaX;
            newY = dragState.startMarkerY + deltaY;
            break;
          case 'e':
            // Right side
            newWidth = Math.max(30, dragState.startWidth + rotatedDeltaX);
            break;
          case 'w':
            // Left side
            newWidth = Math.max(30, dragState.startWidth - rotatedDeltaX);
            newX = dragState.startMarkerX + deltaX;
            break;
          case 's':
            // Bottom side
            newHeight = Math.max(30, dragState.startHeight + rotatedDeltaY);
            break;
          case 'n':
            // Top side
            newHeight = Math.max(30, dragState.startHeight - rotatedDeltaY);
            newY = dragState.startMarkerY + deltaY;
            break;
        }

        setMarker((prev) => ({
          ...prev,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        }));
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, marker.rotation]);

  // Flip functions
  const handleFlipHorizontal = () => {
    setMarker((prev) => ({ ...prev, flipX: !prev.flipX }));
  };

  const handleFlipVertical = () => {
    setMarker((prev) => ({ ...prev, flipY: !prev.flipY }));
  };

  // Rotate by specific angle
  const handleRotateBy = (angle: number) => {
    setMarker((prev) => ({ ...prev, rotation: (prev.rotation + angle) % 360 }));
  };

  // Update numeric inputs
  const handleNumericUpdate = (field: keyof TransformableMarker, value: number) => {
    setMarker((prev) => ({ ...prev, [field]: value }));
  };

  // Reset transformations
  const handleReset = () => {
    setMarker((prev) => ({
      ...prev,
      width: 100,
      height: 100,
      rotation: 0,
      flipX: false,
      flipY: false,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Main Canvas Area */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 h-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Figma-Style Transform POC
            </h1>
            <p className="text-gray-600">
              Use visual handles OR the properties panel on the right. Both are synced!
            </p>
          </div>

          {/* Canvas Area */}
          <div
            ref={containerRef}
            className="flex-1 relative w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-gray-200 overflow-hidden"
            style={{ cursor: dragState ? 'grabbing' : 'default' }}
            onClick={() => setIsSelected(false)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0.03)_1px,_transparent_1px)] bg-[length:20px_20px]" />

            {/* Transformable Marker */}
            <div
              style={{
                position: 'absolute',
                left: marker.x,
                top: marker.y,
                width: marker.width,
                height: marker.height,
                transform: `rotate(${marker.rotation}deg) scaleX(${marker.flipX ? -1 : 1}) scaleY(${
                  marker.flipY ? -1 : 1
                })`,
                transformOrigin: 'center',
                cursor: dragState?.type === 'move' ? 'grabbing' : 'grab',
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsSelected(true);
                handleMouseDown(e, 'move');
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Marker Icon */}
              <div className="w-full h-full flex items-center justify-center">
                <CarIcon color={marker.color} size={Math.min(marker.width, marker.height)} />
              </div>

              {/* Selection Border and Handles */}
              {isSelected && (
                <>
                  {/* Selection Border */}
                  <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
                    <div className="absolute inset-0 bg-blue-500/5" />
                  </div>

                  {/* Corner Handles */}
                  {['nw', 'ne', 'sw', 'se'].map((handle) => (
                    <div
                      key={handle}
                      onMouseDown={(e) => handleMouseDown(e, handle as HandleType)}
                      className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-pointer hover:scale-150 transition-transform z-10"
                      style={{
                        top: handle.includes('n') ? -6 : 'auto',
                        bottom: handle.includes('s') ? -6 : 'auto',
                        left: handle.includes('w') ? -6 : 'auto',
                        right: handle.includes('e') ? -6 : 'auto',
                        cursor:
                          handle === 'nw' || handle === 'se'
                            ? 'nwse-resize'
                            : 'nesw-resize',
                      }}
                    />
                  ))}

                  {/* Side Handles */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'n')}
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-white border-2 border-blue-500 rounded-full cursor-ns-resize hover:scale-110 transition-transform"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 's')}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-white border-2 border-blue-500 rounded-full cursor-ns-resize hover:scale-110 transition-transform"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'w')}
                    className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-6 bg-white border-2 border-blue-500 rounded-full cursor-ew-resize hover:scale-110 transition-transform"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'e')}
                    className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-6 bg-white border-2 border-blue-500 rounded-full cursor-ew-resize hover:scale-110 transition-transform"
                  />

                  {/* Rotation Handle */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'rotate')}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
                  >
                    <div className="w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                    <div className="w-0.5 h-8 bg-blue-500" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200 shadow-xl p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Maximize2 className="w-5 h-5" />
          Properties Panel
        </h2>

        {isSelected ? (
          <div className="space-y-6">
            {/* Position Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <Move className="w-4 h-4" />
                Position
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">X</label>
                  <input
                    type="number"
                    value={Math.round(marker.x)}
                    onChange={(e) => handleNumericUpdate('x', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Y</label>
                  <input
                    type="number"
                    value={Math.round(marker.y)}
                    onChange={(e) => handleNumericUpdate('y', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Size Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Size</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
                  <input
                    type="number"
                    value={Math.round(marker.width)}
                    onChange={(e) => handleNumericUpdate('width', Math.max(30, parseFloat(e.target.value) || 30))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
                  <input
                    type="number"
                    value={Math.round(marker.height)}
                    onChange={(e) => handleNumericUpdate('height', Math.max(30, parseFloat(e.target.value) || 30))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Rotation Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Rotation</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={Math.round(marker.rotation)}
                    onChange={(e) => handleNumericUpdate('rotation', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="1"
                  />
                  <span className="text-sm text-gray-600">°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={marker.rotation}
                  onChange={(e) => handleNumericUpdate('rotation', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRotateBy(-45)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    -45°
                  </button>
                  <button
                    onClick={() => handleRotateBy(45)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <RotateCw className="w-4 h-4" />
                    +45°
                  </button>
                </div>
              </div>
            </div>

            {/* Flip Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Flip</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleFlipHorizontal}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    marker.flipX
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FlipHorizontal2 className="w-4 h-4" />
                  Horizontal
                </button>
                <button
                  onClick={handleFlipVertical}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    marker.flipY
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FlipVertical2 className="w-4 h-4" />
                  Vertical
                </button>
              </div>
            </div>

            {/* Color Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Color</h3>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={marker.color}
                  onChange={(e) => setMarker((prev) => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  value={marker.color}
                  onChange={(e) => setMarker((prev) => ({ ...prev, color: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Reset Transform
              </button>
              <button
                onClick={() => setIsSelected(false)}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Marker
              </button>
            </div>

            {/* Info Display */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Current State</h3>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono text-gray-600">
                <div>Position: ({Math.round(marker.x)}, {Math.round(marker.y)})</div>
                <div>Size: {Math.round(marker.width)} × {Math.round(marker.height)}</div>
                <div>Rotation: {Math.round(marker.rotation)}°</div>
                <div>Flipped: H:{marker.flipX ? '✓' : '✗'} V:{marker.flipY ? '✓' : '✗'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Maximize2 className="w-12 h-12 mb-3" />
            <p className="text-sm">Click on a marker to see properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
