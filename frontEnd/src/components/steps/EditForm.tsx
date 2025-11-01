import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setEditing } from '@/store/slices/formSlice';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { HeaderForm } from './forms/HeaderForm';
import { MainReportForm } from './forms/MainReportForm';
import { ParticipantForm } from './forms/ParticipantForm';
import { ThirdPartyForm } from './forms/ThirdPartyForm';
import { AccidentSiteForm } from './forms/AccidentSiteForm';
import { WitnessForm } from './forms/WitnessForm';

export const EditForm = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.form);

  const handleCancel = () => {
    dispatch(setEditing(false));
  };

  const handleSave = () => {
    // Here you would typically handle the form submission,
    // e.g., send data to a server to regenerate the document.
    console.log('Saving form data...', data);
    dispatch(setEditing(false));
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
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};
