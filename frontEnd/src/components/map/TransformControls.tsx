import { RotateCcw, RotateCw, ZoomIn, ZoomOut, FlipHorizontal, FlipVertical, Trash2 } from 'lucide-react';

interface TransformControlsProps {
  onRotate: () => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onDelete: () => void;
  position: { x: number; y: number, h: number, w: number };
}

export default function TransformControls({
  onRotate,
  onScaleUp,
  onScaleDown,
  onFlipHorizontal,
  onFlipVertical,
  onDelete,
  position,
}: TransformControlsProps) {
  return (
    <div
      className="absolute bg-white shadow-lg rounded-lg p-2 flex gap-1 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y }px`,
      }}
    >
      <button
        onClick={onRotate}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Rotate"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={onRotate}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Rotate"
      >
        <RotateCw className="w-4 h-4" />
      </button>
      <button
        onClick={onScaleUp}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Scale Up"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={onScaleDown}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Scale Down"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={onFlipHorizontal}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Flip Horizontal"
      >
        <FlipHorizontal className="w-4 h-4" />
      </button>
      <button
        onClick={onFlipVertical}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Flip Vertical"
      >
        <FlipVertical className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 hover:bg-red-100 rounded transition-colors text-red-600"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
