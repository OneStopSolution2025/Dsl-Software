
import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setEditing, setFormData } from '@/store/slices/formSlice';
import { setDocxUrl, setHtmlUrl } from '@/store/slices/filesSlice';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { DynamicFormSection } from './forms/DynamicFormSection';
import apiService from '@/services/api.service';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from './forms/ImageUpload';
import { RichTextEditor } from './forms/RichTextEditor';
import { jsonToFormCategories, updateByPath } from '@/utils/formHelpers';

export const EditForm = () => {
  const dispatch = useDispatch();
  const { data, images } = useSelector((state: RootState) => state.form);
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [isSaving, setIsSaving] = useState(false);

  // Generate dynamic form categories from JSON data
  const formCategories = useMemo(() => {
    return jsonToFormCategories(data);
  }, [data]);

  const handleFieldChange = (path: string, value: any) => {
    const updatedData = updateByPath(data, path, value);
    dispatch(setFormData(updatedData));
  };

  const handleCancel = () => {
    dispatch(setEditing(false));
  };

  const handleSave = async () => {
    if (!sessionId) {
      toast.error('Session not found. Please try again.');
      return;
    }

    try {
      setIsSaving(true);

      // Prepare payload with images and text
      const payload = {
        images: images,
        text: data
      };

      // Send edited form data with images to the API
      const response = await apiService.mapReport.uploadMapReport(sessionId, payload, 'template1.docx');

      // Update the document URLs with the response
      if (response.docx_path) {
        dispatch(setDocxUrl(response.docx_path));
        if (response.html_path) {
          dispatch(setHtmlUrl(response.html_path));
        }
        toast.success(`Changes saved successfully! ${response.images_processed || 0} image(s) processed.`);
        dispatch(setEditing(false));
      } else {
        toast.success('Changes saved successfully!');
        dispatch(setEditing(false));
      }
    } catch (err: any) {
      let message = 'Failed to save changes. Please try again.';
      if (err.code === 'ECONNABORTED') {
        message = 'The request timed out. Please try again.';
      } else if (err.response?.status === 400) {
        message = err.response?.data?.detail || 'Invalid data. Please check your inputs.';
      } else if (err.response?.status === 404) {
        message = 'Session not found. Please start over.';
      } else if (err.response?.status === 500) {
        message = 'Server error. Please try again later.';
      } else {
        message = err.response?.data?.detail || err.message || message;
      }
      toast.error(message);
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Generate tabs dynamically from categories + Images tab
  const tabs = useMemo(() => {
    const dynamicTabs = formCategories.map(category => ({
      label: category.name,
      content: (
        <DynamicFormSection
          fields={category.fields}
          values={data}
          onChange={handleFieldChange}
        />
      ),
    }));

    // Add Image Upload tab
    dynamicTabs.push({
      label: 'Image Upload',
      content: <ImageUpload />,
    });

    // Add Rich Text Editor tab
    dynamicTabs.push({
      label: 'Rich Text Editor',
      content: <RichTextEditor />,
    });

    return dynamicTabs;
  }, [formCategories, data, handleFieldChange]);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-neutral-200 shadow-lg">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">Edit Extracted Data</h3>
      
      {formCategories.length > 0 ? (
        <Tabs tabs={tabs} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No form data available. Please complete the AutoFill step first.</p>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
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
