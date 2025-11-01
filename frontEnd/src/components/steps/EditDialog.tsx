import React from 'react';
import { Button } from '@/components/common/Button';
import { X } from 'lucide-react';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl transform transition-all">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Edit Document Details</h2>
          <button
            onClick={onClose}
            className="p-2 -m-2 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <form className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="claim-number" className="text-sm font-medium text-neutral-700 mb-1">
                  Claim Number
                </label>
                <input
                  type="text"
                  id="claim-number"
                  defaultValue="CLM-2024-07-XYZ"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="policy-holder" className="text-sm font-medium text-neutral-700 mb-1">
                  Policy Holder
                </label>
                <input
                  type="text"
                  id="policy-holder"
                  defaultValue="John Doe"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
                />
            </div>
             <div className="flex flex-col">
                <label htmlFor="claim-details" className="text-sm font-medium text-neutral-700 mb-1">
                  Claim Details
                </label>
                <textarea
                  id="claim-details"
                  rows={4}
                  defaultValue="Initial assessment of the damage..."
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
                />
            </div>
        </form>

        <div className="flex justify-end gap-3 mt-6 sm:mt-8">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default EditDialog;