import html2canvas from 'html2canvas';

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const captureMapScreenshot = async (elementId: string): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Map element not found');
  }

  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
  });

  return canvas.toDataURL('image/png');
};

export const downloadMapImage = (dataUrl: string, filename: string = 'map-scene.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateMarkerId = (): string => {
  return `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
