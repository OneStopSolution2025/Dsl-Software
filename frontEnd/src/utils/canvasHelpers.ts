import { fabric } from 'fabric';

/**
 * Exports a Fabric.js canvas to a base64 PNG string with compression
 * @param canvas - The Fabric.js canvas instance
 * @param maxSizeBytes - Maximum file size in bytes (default: 2MB)
 * @returns Base64 string of the canvas image
 */
export const exportCanvasToBase64 = async (
  canvas: fabric.Canvas,
  maxSizeBytes: number = 2 * 1024 * 1024
): Promise<string> => {
  let quality = 0.95;
  let dataURL = canvas.toDataURL({ format: 'png', quality });
  
  // Iteratively reduce quality until under size limit
  while (getBase64Size(dataURL) > maxSizeBytes && quality > 0.1) {
    quality -= 0.05;
    dataURL = canvas.toDataURL({ format: 'png', quality });
  }
  
  return dataURL;
};

/**
 * Calculates the size of a base64 string in bytes
 * @param base64String - The base64 encoded string
 * @returns Size in bytes
 */
export const getBase64Size = (base64String: string): number => {
  const base64 = base64String.split(',')[1] || base64String;
  const padding = (base64.match(/=/g) || []).length;
  return (base64.length * 3) / 4 - padding;
};

/**
 * Checks if a canvas has any user-drawn content (excluding background)
 * @param canvas - The Fabric.js canvas instance
 * @param hasBackgroundImage - Whether the canvas has a background image
 * @returns True if canvas has changes, false if empty
 */
export const hasCanvasChanges = (
  canvas: fabric.Canvas,
  hasBackgroundImage: boolean = false
): boolean => {
  const objects = canvas.getObjects();
  
  if (hasBackgroundImage) {
    // If there's a background image, check if there are additional objects
    return objects.length > 1;
  } else {
    // For blank canvas, check if any objects exist
    return objects.length > 0;
  }
};

/**
 * Validates file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum allowed size in megabytes
 * @returns True if valid, error message if invalid
 */
export const validateFileSize = (
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }
  return { valid: true };
};

/**
 * Converts a File to base64 string
 * @param file - File to convert
 * @returns Promise resolving to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Formats file size for display
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
