import { useState } from 'react';
import { CustomRichTextEditor } from '@/components/editor/CustomRichTextEditor';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Code, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RichEditorPOC = () => {
  const navigate = useNavigate();
  const [htmlInput, setHtmlInput] = useState(`<h1>Welcome to Custom Rich Text Editor</h1>
<p>This is a <strong>proof of concept</strong> for a custom rich text editor.</p>
<p>You can:</p>
<ul>
  <li>Format text with <em>various styles</em></li>
  <li>Insert images</li>
  <li>Create tables</li>
  <li>Add links and more!</li>
</ul>
<p><br></p>
<table>
  <tr>
    <th>Feature</th>
    <th>Status</th>
  </tr>
  <tr>
    <td>Bold/Italic</td>
    <td>✅ Available</td>
  </tr>
  <tr>
    <td>Images</td>
    <td>✅ Available</td>
  </tr>
  <tr>
    <td>Tables</td>
    <td>✅ Available</td>
  </tr>
</table>`);
  
  const [htmlOutput, setHtmlOutput] = useState(htmlInput);
  const [showPreview, setShowPreview] = useState(false);

  const handleLoadHtml = () => {
    setHtmlOutput(htmlInput);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlOutput);
    alert('HTML copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Custom Rich Text Editor POC</h1>
          <p className="text-gray-600 mt-2">
            A proof of concept editor that accepts HTML input and outputs HTML code with image insertion support
          </p>
        </div>

        {/* HTML Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Code className="h-5 w-5 text-teal-600" />
            HTML Input
          </h2>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="Paste your HTML code here..."
          />
          <div className="mt-4 flex gap-2">
            <Button variant="primary" onClick={handleLoadHtml}>
              Load HTML to Editor
            </Button>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-teal-600" />
            Rich Text Editor
          </h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <CustomRichTextEditor
              initialHtml={htmlOutput}
              onHtmlChange={setHtmlOutput}
            />
          </div>
        </div>

        {/* HTML Output Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Code className="h-5 w-5 text-teal-600" />
              HTML Output
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Show Code' : 'Show Preview'}
              </Button>
              <Button variant="primary" onClick={handleCopyHtml}>
                Copy HTML
              </Button>
            </div>
          </div>

          {showPreview ? (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Preview:</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>
          ) : (
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{htmlOutput}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Paste HTML code in the "HTML Input" section and click "Load HTML to Editor"</li>
            <li>2. Edit content using the rich text editor (supports formatting, images, tables)</li>
            <li>3. Click the image icon in the toolbar to insert images from your computer</li>
            <li>4. View the generated HTML code in the "HTML Output" section</li>
            <li>5. Toggle between code view and preview to see how it renders</li>
            <li>6. Copy the HTML output to use in your application</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
