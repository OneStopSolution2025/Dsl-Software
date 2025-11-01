import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setFormData } from '@/store/slices/formSlice';

export const MainReportForm = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.form);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({ 
        ...data, 
        mainReportDetails: { ...data.mainReportDetails, [name]: value } 
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateOfInstruction" className="text-sm font-medium text-neutral-700">Date of Instruction</label>
          <input
            type="date"
            id="dateOfInstruction"
            name="dateOfInstruction"
            value={data.mainReportDetails?.dateOfInstruction || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="claimNumber" className="text-sm font-medium text-neutral-700">Claim Number</label>
          <input
            type="text"
            id="claimNumber"
            name="claimNumber"
            value={data.mainReportDetails?.claimNumber || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="policyNoAndPeriodOfCover" className="text-sm font-medium text-neutral-700">Policy No & Period of Cover</label>
          <input
            type="text"
            id="policyNoAndPeriodOfCover"
            name="policyNoAndPeriodOfCover"
            value={data.mainReportDetails?.policyNoAndPeriodOfCover || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="participantInsuredVehicle" className="text-sm font-medium text-neutral-700">Participant/Insured Vehicle</label>
          <input
            type="text"
            id="participantInsuredVehicle"
            name="participantInsuredVehicle"
            value={data.mainReportDetails?.participantInsuredVehicle || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="accidentDateTime" className="text-sm font-medium text-neutral-700">Accident Date & Time</label>
          <input
            type="datetime-local"
            id="accidentDateTime"
            name="accidentDateTime"
            value={data.mainReportDetails?.accidentDateTime || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="accidentLocation" className="text-sm font-medium text-neutral-700">Accident Location</label>
          <textarea
            id="accidentLocation"
            name="accidentLocation"
            value={data.mainReportDetails?.accidentLocation || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
      </div>
    </div>
  );
};
