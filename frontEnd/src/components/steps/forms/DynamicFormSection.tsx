import React from 'react';
import { Input } from '@/components/common/Input';
import { FormField } from '@/utils/formHelpers';

interface DynamicFormSectionProps {
  fields: FormField[];
  values?: any; // Optional for future use
  onChange: (path: string, value: any) => void;
}

export const DynamicFormSection: React.FC<DynamicFormSectionProps> = ({
  fields,
  onChange,
}) => {
  const handleChange = (field: FormField, newValue: string) => {
    onChange(field.path, newValue);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const value = field.value || '';

          if (field.type === 'textarea') {
            return (
              <div key={field.path} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => handleChange(field, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            );
          }

          return (
            <div key={field.path}>
              <Input
                label={field.label}
                type={field.type}
                value={value}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          );
        })}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No fields available in this section
        </div>
      )}
    </div>
  );
};
