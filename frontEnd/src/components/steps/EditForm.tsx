
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setEditing } from '@/store/slices/formSlice';
import { setDocxUrl, setHtmlUrl } from '@/store/slices/filesSlice';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { HeaderForm } from './forms/HeaderForm';
import { MainReportForm } from './forms/MainReportForm';
import { ParticipantForm } from './forms/ParticipantForm';
import { ThirdPartyForm } from './forms/ThirdPartyForm';
import { AccidentSiteForm } from './forms/AccidentSiteForm';
import { WitnessForm } from './forms/WitnessForm';
import apiService from '@/services/api.service';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const EditForm = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.form);
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [isSaving, setIsSaving] = useState(false);

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

      // Send edited form data to the API
      const response = await apiService.document.saveEditedForm(
        sessionId,
        data,
        'template_with_placeholders.docx'
      );

      // Update the document URLs with the regenerated document
      if (response.report_docx_gcs_uri) {
        dispatch(setDocxUrl(response.report_docx_gcs_uri));
        if (response.report_html_gcs_uri) {
          dispatch(setHtmlUrl(response.report_html_gcs_uri));
        }
        toast.success('Changes saved successfully! Document regenerated.');
        dispatch(setEditing(false));
      } else {
        throw new Error('Document regeneration completed, but no document URL was returned.');
      }
    } catch (err: any) {
      let message = 'Failed to save changes. Please try again.';
      if (err.code === 'ECONNABORTED') {
        message = 'The request timed out. Please try again.';
      } else {
        message = err.response?.data?.detail || err.message || message;
      }
      toast.error(message);
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { label: 'Header', content: <HeaderForm /> },
    { label: 'Main Report', content: <MainReportForm /> },
    { label: 'Participant', content: <ParticipantForm /> },
    { label: 'Third Party', content: <ThirdPartyForm /> },
    { label: 'Accident Site', content: <AccidentSiteForm /> },
    { label: 'Witness', content: <WitnessForm /> },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-neutral-200 shadow-lg">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">Edit Extracted Data</h3>
      
      <Tabs tabs={tabs} />

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
