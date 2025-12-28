# Custom Rich Text Editor POC

## Overview
A proof-of-concept custom rich text editor built with React and Quill that accepts HTML input and outputs HTML code.

## Features
✅ **HTML Input** - Paste HTML code to load into the editor
✅ **Rich Text Editing** - Full WYSIWYG editing experience with:
  - Text formatting (bold, italic, underline, strikethrough)
  - Headers (H1-H6)
  - Font family and size selection
  - Text and background colors
  - Lists (ordered/unordered)
  - Alignment options
  - Links and blockquotes
  - Code blocks
✅ **Image Insertion** - Click the image icon to insert images from your computer
✅ **Table Support** - Create and edit tables
✅ **HTML Output** - View the generated HTML code in real-time
✅ **Preview Mode** - Toggle between code view and rendered preview
✅ **Copy to Clipboard** - One-click copy of generated HTML

## Access the POC
After logging in, navigate to:
```
/rich-editor-poc
```

Or manually enter the URL:
```
http://localhost:5173/rich-editor-poc
```

## Usage Flow
1. **Paste HTML** - Enter or paste HTML code in the "HTML Input" section
2. **Load to Editor** - Click "Load HTML to Editor" button
3. **Edit Content** - Use the rich text editor to modify content
4. **Insert Images** - Click the image icon (📷) in the toolbar to upload images
5. **View Output** - See the generated HTML code at the bottom
6. **Preview** - Toggle "Show Preview" to see rendered output
7. **Copy** - Click "Copy HTML" to copy the output

## Image Insertion
- Click the image icon in the toolbar
- Select an image from your computer
- Image is converted to base64 data URL and embedded in HTML
- Images are stored inline (no external dependencies)

## Technical Details
- **Editor**: Quill with custom configuration
- **Table Module**: quill-table-better
- **Image Handling**: Base64 data URLs (inline embedding)
- **Sticky Toolbar**: Remains visible when scrolling
- **Real-time Updates**: HTML output updates as you type

## File Structure
```
/src/components/editor/
  └── CustomRichTextEditor.tsx    # Reusable editor component

/src/pages/
  └── RichEditorPOC.tsx           # POC page with demo
```

## Example Use Cases
- Document template editing
- Email content creation
- Rich content management
- HTML report generation
- WYSIWYG form builders
