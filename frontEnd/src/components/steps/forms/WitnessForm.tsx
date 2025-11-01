import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setFormData } from '@/store/slices/formSlice';

export const WitnessForm = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.form);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({ 
        ...data, 
        witnessInformation: { ...data.witnessInformation, [name]: value } 
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-neutral-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.witnessInformation?.name || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="contact" className="text-sm font-medium text-neutral-700">Contact No.</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={data.witnessInformation?.contact || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
      </div>
      <div>
        <label htmlFor="statement" className="text-sm font-medium text-neutral-700">Statement</label>
        <textarea
          id="statement"
          name="statement"
          value={data.witnessInformation?.statement || ''}
          onChange={handleInputChange}
          rows={6}
          className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        />
      </div>
    </div>
  );
};
