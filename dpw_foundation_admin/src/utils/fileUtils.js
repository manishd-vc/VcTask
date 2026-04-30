/**
 * Downloads a file from provided data and headers.
 * @param {BlobPart} data - The file content as a BlobPart (e.g., string, ArrayBuffer, or TypedArray).
 * @param {string} filename - The name of the file to be downloaded.
 * @param {Headers} headers - The HTTP headers containing the content type.
 */
export const downloadFile = (data, filename, headers) => {
  const blob = new Blob([data], { type: headers.get('content-type') });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
