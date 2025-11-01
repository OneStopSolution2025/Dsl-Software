import html2canvas from 'html2canvas';

export const captureMapScreenshot = async (elementId: string): Promise<string> => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error('Element not found for screenshot');
    }

    // Temporarily remove the transform controls from the DOM before taking the screenshot
    const transformControls = element.querySelector('.transform-controls');
    if (transformControls) {
        transformControls.style.display = 'none';
    }

    const canvas = await html2canvas(element, {
        useCORS: true, // This is important for fetching Google Maps tiles
        allowTaint: true,
    });

    // Restore the transform controls after taking the screenshot
    if (transformControls) {
        transformControls.style.display = 'block';
    }

    return canvas.toDataURL('image/png');
};
