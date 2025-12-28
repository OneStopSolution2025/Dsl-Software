import { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, 
  AlignRight, List, ListOrdered, Image, Link, Code, Heading1, 
  Heading2, Heading3, Quote, Undo, Redo, Palette, Paintbrush
} from 'lucide-react';

interface CustomRichTextEditorProps {
  initialHtml?: string;
  onHtmlChange?: (html: string) => void;
}

export const CustomRichTextEditor = ({ initialHtml = '', onHtmlChange }: CustomRichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textColorInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);
  const textColorBtnRef = useRef<HTMLDivElement>(null);
  const bgColorBtnRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('3');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffff00');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialHtml) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textColorBtnRef.current && 
        !textColorBtnRef.current.contains(event.target as Node)
      ) {
        setShowTextColorPicker(false);
      }
      if (
        bgColorBtnRef.current && 
        !bgColorBtnRef.current.contains(event.target as Node)
      ) {
        setShowBgColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInput = () => {
    const content = editorRef.current?.innerHTML || '';
    if (onHtmlChange) {
      onHtmlChange(content);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleHeading = (level: number) => {
    executeCommand('formatBlock', `h${level}`);
  };

  const handleTextColor = () => {
    setShowTextColorPicker(!showTextColorPicker);
    setShowBgColorPicker(false);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    executeCommand('foreColor', color);
  };

  const handleBackgroundColor = () => {
    setShowBgColorPicker(!showBgColorPicker);
    setShowTextColorPicker(false);
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBgColor(color);
    executeCommand('backColor', color);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setFontSize(size);
    executeCommand('fontSize', size);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) executeCommand('createLink', url);
  };

  const handleImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        executeCommand('insertImage', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertTable = () => {
    const rows = prompt('Enter number of rows:', '3');
    const cols = prompt('Enter number of columns:', '3');
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="border: 1px solid transparent; padding: 8px;">Cell</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table>';
      executeCommand('insertHTML', tableHTML);
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void; 
    icon: any; 
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-2 hover:bg-gray-100 rounded transition-colors"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Icon className="h-4 w-4 text-gray-700" />
    </button>
  );

  return (
    <div className="custom-rich-text-editor border border-gray-300 rounded-lg overflow-hidden bg-white">
      <style>{`
        .custom-rich-text-editor .editor-toolbar {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .custom-rich-text-editor .editor-content {
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }
        .custom-rich-text-editor .editor-content:focus {
          outline: none;
        }
        .custom-rich-text-editor .editor-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        .custom-rich-text-editor .editor-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .custom-rich-text-editor .editor-content h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        .custom-rich-text-editor .editor-content ul {
          list-style-type: disc;
          margin-left: 40px;
          margin: 1em 0;
        }
        .custom-rich-text-editor .editor-content ol {
          list-style-type: decimal;
          margin-left: 40px;
          margin: 1em 0;
        }
        .custom-rich-text-editor .editor-content blockquote {
          border-left: 4px solid #ddd;
          padding-left: 16px;
          margin: 1em 0;
          color: #666;
        }
        .custom-rich-text-editor .editor-content a {
          color: #0066cc;
          text-decoration: underline;
        }
        .custom-rich-text-editor .editor-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px 0;
        }
        .custom-rich-text-editor .editor-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 10px 0;
        }
        .custom-rich-text-editor .editor-content table td,
        .custom-rich-text-editor .editor-content table th {
          border: 1px solid transparent;
          padding: 8px;
        }
        .custom-rich-text-editor .toolbar-separator {
          width: 1px;
          height: 24px;
          background-color: #e5e7eb;
          margin: 0 4px;
        }
        .custom-rich-text-editor .color-picker-popup {
          position: absolute;
          z-index: 1000;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          margin-top: 8px;
        }
        .custom-rich-text-editor .color-picker-popup input[type="color"] {
          width: 150px;
          height: 40px;
          border: none;
          cursor: pointer;
        }
      `}</style>

      {/* Toolbar */}
      <div className="editor-toolbar">
        <ToolbarButton onClick={() => executeCommand('undo')} icon={Undo} title="Undo" />
        <ToolbarButton onClick={() => executeCommand('redo')} icon={Redo} title="Redo" />
        
        <div className="toolbar-separator" />
        
        <ToolbarButton onClick={() => handleHeading(1)} icon={Heading1} title="Heading 1" />
        <ToolbarButton onClick={() => handleHeading(2)} icon={Heading2} title="Heading 2" />
        <ToolbarButton onClick={() => handleHeading(3)} icon={Heading3} title="Heading 3" />
        
        <div className="toolbar-separator" />
        
        <ToolbarButton onClick={() => executeCommand('bold')} icon={Bold} title="Bold" />
        <ToolbarButton onClick={() => executeCommand('italic')} icon={Italic} title="Italic" />
        <ToolbarButton onClick={() => executeCommand('underline')} icon={Underline} title="Underline" />
        <ToolbarButton onClick={() => executeCommand('strikeThrough')} icon={Strikethrough} title="Strikethrough" />
        
        <div className="toolbar-separator" />
        
        <div ref={textColorBtnRef} style={{ position: 'relative' }}>
          <ToolbarButton onClick={handleTextColor} icon={Palette} title="Text Color" />
          {showTextColorPicker && (
            <div className="color-picker-popup">
              <input
                type="color"
                value={textColor}
                onChange={handleTextColorChange}
                ref={textColorInputRef}
              />
            </div>
          )}
        </div>
        
        <div ref={bgColorBtnRef} style={{ position: 'relative' }}>
          <ToolbarButton onClick={handleBackgroundColor} icon={Paintbrush} title="Background Color" />
          {showBgColorPicker && (
            <div className="color-picker-popup">
              <input
                type="color"
                value={bgColor}
                onChange={handleBackgroundColorChange}
                ref={bgColorInputRef}
              />
            </div>
          )}
        </div>
        
        <select
          value={fontSize}
          onChange={handleFontSizeChange}
          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 cursor-pointer"
          title="Font Size"
        >
          <option value="1">Tiny</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Medium</option>
          <option value="5">Large</option>
          <option value="6">Huge</option>
          <option value="7">Maximum</option>
        </select>
        
        <div className="toolbar-separator" />
        
        <ToolbarButton onClick={() => executeCommand('justifyLeft')} icon={AlignLeft} title="Align Left" />
        <ToolbarButton onClick={() => executeCommand('justifyCenter')} icon={AlignCenter} title="Align Center" />
        <ToolbarButton onClick={() => executeCommand('justifyRight')} icon={AlignRight} title="Align Right" />
        
        <div className="toolbar-separator" />
        
        <ToolbarButton onClick={() => executeCommand('insertUnorderedList')} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => executeCommand('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
        
        <div className="toolbar-separator" />
        
        <ToolbarButton onClick={() => executeCommand('formatBlock', 'blockquote')} icon={Quote} title="Quote" />
        <ToolbarButton onClick={() => executeCommand('formatBlock', 'pre')} icon={Code} title="Code Block" />
        
        <div className="toolbar-separator" />
        
        <ToolbarButton onClick={handleLink} icon={Link} title="Insert Link" />
        <ToolbarButton onClick={handleImage} icon={Image} title="Insert Image" />
        <button
          type="button"
          onClick={insertTable}
          className="p-2 hover:bg-gray-100 rounded transition-colors text-xs font-semibold text-gray-700"
          title="Insert Table"
          onMouseDown={(e) => e.preventDefault()}
        >
          Table
        </button>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
      />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};
