# Custom Rich Text Editor Integration

## Overview
The custom rich text editor (built without third-party libraries) has been successfully integrated into the EditForm Preview workflow.

## Implementation Details

### Components Modified

1. **EditForm.tsx** (`/src/components/steps/EditForm.tsx`)
   - Replaced `RichTextEditor` (Quill-based) with `CustomRichTextEditor`
   - Added state management for active tab and HTML content
   - Implemented conditional save logic based on active tab
   - Added HTML content loading from `htmlUrl` on component mount
   - Added special handling for HTML editor tab save

2. **Tabs.tsx** (`/src/components/common/Tabs.tsx`)
   - Made the component controllable with optional `activeTab` and `onTabChange` props
   - Maintains backward compatibility with internal state when props are not provided
   - Exposes tab selection state to parent components

### Key Features

#### 1. HTML Content Loading
- When EditForm mounts, it fetches HTML content from `htmlUrl` (from Redux state)
- Displays loaded HTML in the CustomRichTextEditor
- Handles loading errors gracefully

#### 2. Conditional Save Logic
The save button behavior changes based on the active tab:

**When on Rich Text Editor tab:**
- Extracts filename from `htmlUrl` (e.g., "generated_report_20251221_124814.htm")
- Creates HTML file from editor content
- Uploads to `/upload-files` API with original filename
- Does NOT update Redux state (as per requirements)
- Shows success toast: "HTML file saved successfully!"
- Exits edit mode

**When on other tabs:**
- Uses existing logic: uploads via `mapReport.uploadMapReport`
- Updates Redux state with `docx_path` and `html_path`
- Shows success toast with image count
- Exits edit mode

#### 3. Tab Structure
The tabs are generated dynamically:
1. Dynamic form category tabs (based on form data)
2. Image Upload tab
3. **Rich Text Editor tab** (CustomRichTextEditor)

## Usage Flow

1. User completes AutoFill step → HTML document is generated
2. User enters Preview/Edit mode
3. User clicks on "Rich Text Editor" tab
4. CustomRichTextEditor loads with HTML content from `htmlUrl`
5. User edits content using toolbar (formatting, images, tables, etc.)
6. User clicks "Save Changes" button
7. System detects Rich Text Editor tab is active
8. Extracts filename from `htmlUrl`
9. Creates HTML file with edited content
10. Uploads to `/upload-files` API
11. Success message shown, edit mode exits

## API Endpoints

### /upload-files
Used for saving edited HTML content
- Method: POST (multipart/form-data)
- Payload: HTML file with original filename
- Session ID: Passed as parameter

### /mapReport/upload
Used for saving form data and images (other tabs)
- Method: POST
- Payload: { images, text }
- Returns: { docx_path, html_path, images_processed }

## File Locations

- **CustomRichTextEditor**: `/src/components/editor/CustomRichTextEditor.tsx`
- **EditForm**: `/src/components/steps/EditForm.tsx`
- **Tabs**: `/src/components/common/Tabs.tsx`
- **POC Page**: `/src/pages/RichEditorPOC.tsx` (for testing/demo)

## Technical Notes

- CustomRichTextEditor uses `contentEditable` div and `document.execCommand()` for formatting
- HTML content is stored in component state, not Redux
- File upload uses `apiService.file.uploadFiles()` method
- Filename extraction handles full URLs by splitting on '/' and taking last segment
- Empty HTML content validation prevents saving blank documents
- Error handling for missing `htmlUrl` or `sessionId`

## Testing

Build successful: ✓
- No TypeScript errors
- All imports resolved correctly
- Component integration working
- Controlled tab state functioning properly

## Future Enhancements

Potential improvements:
- Add auto-save functionality for HTML editor
- Implement undo/redo history
- Add keyboard shortcuts for common operations
- Enhance table editing capabilities
- Add HTML validation before save
