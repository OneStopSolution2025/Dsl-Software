import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setFormData } from '@/store/slices/formSlice';

export const HeaderForm = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.form);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({ 
        ...data, 
        headerInformation: { ...data.headerInformation, [name]: value } 
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="yourRef" className="text-sm font-medium text-neutral-700">Your Ref</label>
          <input
            type="text"
            id="yourRef"
            name="yourRef"
            value={data.headerInformation?.yourRef || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="ourRef" className="text-sm font-medium text-neutral-700">Our Ref</label>
          <input
            type="text"
            id="ourRef"
            name="ourRef"
            value={data.headerInformation?.ourRef || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="date" className="text-sm font-medium text-neutral-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={data.headerInformation?.date || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
        <div>
          <label htmlFor="attn" className="text-sm font-medium text-neutral-700">Attn</label>
          <input
            type="text"
            id="attn"
            name="attn"
            value={data.headerInformation?.attn || ''}
            onChange={handleInputChange}
            className="w-full mt-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>
      </div>
    </div>
  );
};
