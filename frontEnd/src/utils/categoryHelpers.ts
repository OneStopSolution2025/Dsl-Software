// Utility to extract categories and fields from API field names
// Example: 'INSURED_NRIC_BACK' => category: 'Insured', field: 'NRIC BACK'

export function extractCategoriesFromFields(fields: string[]) {
    const categories: { [key: string]: string[] } = {};
    fields.forEach((field) => {
        // Split by underscore, first part is category, rest is field
        const parts = field.split('_');
        if (parts.length < 2) return;
        // Category: capitalize first letter, rest lower
        const rawCategory = parts[0].toLowerCase();
        const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
        // Field: join rest, replace underscores with space, capitalize words
        const rawField = parts.slice(1).join(' ');
        const fieldName = rawField.replace(/\b\w/g, (c) => c.toUpperCase());
        if (!categories[category]) categories[category] = [];
        categories[category].push(fieldName);
    });
    return categories;
}

// Utility to get original field name from category and field display name
export function getFieldKey(category: string, fieldDisplay: string, fields: string[]) {
    // Find the field in the original list that matches the category and display name
    return fields.find((f) => {
        const parts = f.split('_');
        if (parts.length < 2) return false;
        const cat = parts[0].toLowerCase();
        const catDisplay = cat.charAt(0).toUpperCase() + cat.slice(1);
        const fieldName = parts.slice(1).join(' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return catDisplay === category && fieldName === fieldDisplay;
    }) || '';
}
