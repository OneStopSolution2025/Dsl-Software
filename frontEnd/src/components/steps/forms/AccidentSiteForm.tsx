import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setFormData } from '@/store/slices/formSlice';

export const AccidentSiteForm = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.form);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({ 
        ...data, 
        accidentSiteDescription: { ...data.accidentSiteDescription, [name]: value } 
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="siteDescription" className="text-sm font-medium text-neutral-700">Accident Site Description</label>
        <textarea
          id="siteDescription"
          name="siteDescription"
          value={data.accidentSiteDescription?.siteDescription || ''}
          onChange={handleInputChange}
          rows={6}
          className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
        />
      </div>
    </div>
  );
};
