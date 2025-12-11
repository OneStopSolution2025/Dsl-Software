/**
 * Utility functions for dynamic form generation
 */

/**
 * Convert camelCase or PascalCase to Title Case
 * Example: "participantDriverDetails" -> "Participant Driver Details"
 */
export const toTitleCase = (str: string): string => {
  return str
    // Insert space before capital letters
    .replace(/([A-Z])/g, ' $1')
    // Handle acronyms
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    // Capitalize first letter of each word
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

/**
 * Detect field type from value
 */
export const detectFieldType = (value: any): 'text' | 'date' | 'number' | 'textarea' => {
  if (value === null || value === undefined || value === '') {
    return 'text';
  }

  const strValue = String(value);

  // Check for date patterns
  const datePatterns = [
    /^\d{1,2}\/\d{1,2}\/\d{2,4}/, // DD/MM/YYYY or D/M/YY
    /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
    /^\d{1,2}-\d{1,2}-\d{2,4}/, // DD-MM-YYYY
  ];

  if (datePatterns.some(pattern => pattern.test(strValue))) {
    return 'text'; // Keep as text to preserve format
  }

  // Check for numbers
  if (!isNaN(Number(strValue)) && strValue.trim() !== '') {
    return 'number';
  }

  // Long text → textarea
  if (strValue.length > 100) {
    return 'textarea';
  }

  return 'text';
};

/**
 * Transform nested JSON into categorized fields structure
 */
export interface FormField {
  key: string;
  label: string;
  value: any;
  type: 'text' | 'date' | 'number' | 'textarea';
  path: string; // Full path for updates (e.g., "headerInformation.yourRef")
}

export interface FormCategory {
  name: string;
  fields: FormField[];
}

/**
 * Flatten nested object into array of fields with paths
 */
const flattenObject = (
  obj: any,
  parentPath: string = '',
  parentKey: string = ''
): FormField[] => {
  const fields: FormField[] = [];

  if (obj === null || obj === undefined) {
    return [];
  }

  // If it's not an object or it's an array, treat as single field
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    fields.push({
      key: parentKey,
      label: toTitleCase(parentKey),
      value: obj === null ? '' : obj,
      type: detectFieldType(obj),
      path: parentPath,
    });
    return fields;
  }

  // Process each property
  Object.entries(obj).forEach(([key, value]) => {
    const fieldPath = parentPath ? `${parentPath}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Nested object - flatten it
      const nestedFields = flattenObject(value, fieldPath, key);
      fields.push(...nestedFields);
    } else {
      // Leaf node - create field
      fields.push({
        key,
        label: toTitleCase(key),
        value: value === null ? '' : value,
        type: detectFieldType(value),
        path: fieldPath,
      });
    }
  });

  return fields;
};

/**
 * Convert JSON data to categorized form structure
 */
export const jsonToFormCategories = (data: any): FormCategory[] => {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const categories: FormCategory[] = [];

  Object.entries(data).forEach(([categoryKey, categoryValue]) => {
    // Skip null categories
    if (categoryValue === null) {
      return;
    }

    const fields = flattenObject(categoryValue, categoryKey, categoryKey);

    if (fields.length > 0) {
      categories.push({
        name: toTitleCase(categoryKey),
        fields,
      });
    }
  });

  return categories;
};

/**
 * Update nested object value by path
 * Example: updateByPath(obj, "headerInformation.yourRef", "new value")
 */
export const updateByPath = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Get value from nested object by path
 */
export const getByPath = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};
