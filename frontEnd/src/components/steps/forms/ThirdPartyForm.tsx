import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setFormData } from '@/store/slices/formSlice';

export const ThirdPartyForm = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.form);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    dispatch(setFormData({ 
        ...data, 
        [section]: { ...data[section], [field]: value } 
    }));
  };

  return (
    <div className="space-y-4">
      {/* Third-Party Insured Details */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h4 className="text-lg font-semibold text-neutral-800 mb-2">Third-Party Insured Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="insuredName" className="text-sm font-medium text-neutral-700">Name</label>
            <input
              type="text"
              id="insuredName"
              name="thirdPartyInsuredDetails.name"
              value={data.thirdPartyInsuredDetails?.name || ''}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
          <div>
            <label htmlFor="insuredNric" className="text-sm font-medium text-neutral-700">NRIC No.</label>
            <input
              type="text"
              id="insuredNric"
              name="thirdPartyInsuredDetails.nricNo"
              value={data.thirdPartyInsuredDetails?.nricNo || ''}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
          <div>
            <label htmlFor="insuredAddress" className="text-sm font-medium text-neutral-700">Address</label>
            <textarea
              id="insuredAddress"
              name="thirdPartyInsuredDetails.address"
              value={data.thirdPartyInsuredDetails?.address || ''}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Third-Party Driver Details */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h4 className="text-lg font-semibold text-neutral-800 mb-2">Third-Party Driver Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="driverName" className="text-sm font-medium text-neutral-700">Name</label>
            <input
              type="text"
              id="driverName"
              name="thirdPartyDriverDetails.name"
              value={data.thirdPartyDriverDetails?.name || ''}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
          <div>
            <label htmlFor="driverNric" className="text-sm font-medium text-neutral-700">NRIC No.</label>
            <input
              type="text"
              id="driverNric"
              name="thirdPartyDriverDetails.nricNo"
              value={data.thirdPartyDriverDetails?.nricNo || ''}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
          <div>
            <label htmlFor="driverAddress" className="text-sm font-medium text-neutral-700">Address</label>
            <textarea
              id="driverAddress"
              name="thirdPartyDriverDetails.address"
              value={data.thirdPartyDriverDetails?.address || ''}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
