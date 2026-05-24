export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadText = (text: string, filename: string, mimeType = 'text/plain') => {
  const blob = new Blob([text], { type: mimeType });
  downloadFile(blob, filename);
};

export const downloadJSON = (data: Record<string, unknown>, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  downloadText(json, filename, 'application/json');
};
