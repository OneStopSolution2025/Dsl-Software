import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/common/Button';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import QuillTableBetter from 'quill-table-better';
import 'quill-table-better/dist/quill-table-better.css';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '@/services/api.service';

// Register the table module
Quill.register({
  'modules/table-better': QuillTableBetter,
});

interface RichTextEditorProps {
  htmlUrl?: string | null;
}

export const RichTextEditor = ({ htmlUrl }: RichTextEditorProps) => {
  const { htmlUrl: stateHtmlUrl } = useSelector((state: RootState) => state.files);
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [editorContent, setEditorContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const documentUrl = htmlUrl || stateHtmlUrl;

  // Fetch HTML content from the URL
  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (!documentUrl) {
        setIsLoading(false);
        setHasError(true);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);
        
        const response = await fetch(documentUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const html = await response.text();
        setEditorContent(html);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching HTML:', err);
        setHasError(true);
        setIsLoading(false);
        toast.error('Failed to load HTML content');
      }
    };

    fetchHtmlContent();
  }, [documentUrl]);

  const handleSaveChanges = async () => {
    if (!editorContent.trim()) {
      toast.error('Content cannot be empty');
      return;
    }

    if (!sessionId) {
      toast.error('Session not found. Please try again.');
      return;
    }

    try {
      setIsSaving(true);

      // Create a blob from the HTML content
      const blob = new Blob([editorContent], { type: 'text/html' });
      const file = new File([blob], 'report_edited.html', { type: 'text/html' });

      // Upload to /upload-files endpoint
      const response = await apiService.file.uploadFiles([file], sessionId);

      if (response) {
        toast.success('Changes saved successfully! HTML file uploaded.');
        setIsSaving(false);
      }
    } catch (err: any) {
      console.error('Error saving changes:', err);
      const message = err.response?.data?.detail || err.message || 'Failed to save changes';
      toast.error(message);
      setIsSaving(false);
    }
  };

  const modules = {
    'table-better': {},
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      ['table'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'indent',
    'align',
    'link', 'image', 'video',
    'color', 'background',
    'table'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
          <span className="text-sm text-gray-600">Loading document...</span>
        </div>
      </div>
    );
  }

  if (hasError || !documentUrl) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Failed to load document</p>
          <p className="text-sm text-red-500">Unable to load HTML content for editing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          Edit your document using the rich text editor below. You can format text, add images, tables, and more.
        </p>
      </div>

      <style>{`
        .quill-editor-container .ql-toolbar {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="quill-editor-container border border-gray-200 rounded-lg bg-white overflow-hidden">
        <ReactQuill
          theme="snow"
          value={editorContent}
          onChange={setEditorContent}
          modules={modules}
          formats={formats}
          style={{ height: '400px' }}
        />
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          variant="primary" 
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
};
