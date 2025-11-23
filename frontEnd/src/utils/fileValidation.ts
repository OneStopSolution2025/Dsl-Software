// Utility for validating image file type and size

export const ALLOWED_IMAGE_TYPES = ["image/svg+xml", "image/png", "image/jpeg"];
export const MAX_IMAGE_SIZE_MB = 2;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export function validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: "Only SVG, PNG, and JPEG images are allowed.",
        };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return {
            valid: false,
            error: `File size must not exceed ${MAX_IMAGE_SIZE_MB}MB.`,
        };
    }
    return { valid: true };
}
