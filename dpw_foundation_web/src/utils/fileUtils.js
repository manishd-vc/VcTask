/**
 * Downloads a file from a given Blob object.
 * @param {Blob} blob - The file content as a Blob object.
 * @param {string | number} fileId - The identifier to use in the filename.
 */
export const downloadFile = (blob, fileId) => {
  // Create a temporary URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Create a temporary <a> element for triggering the download
  const a = document.createElement('a');
  a.href = url;

  // Set the filename for the downloaded file
  a.download = `file_${fileId}`;

  // Append the <a> element to the document to make it clickable
  document.body.appendChild(a);

  // Programmatically trigger a click event to start the download
  a.click();

  // Revoke the temporary URL to free up memory
  URL.revokeObjectURL(url);

  // Remove the temporary <a> element from the DOM
  document.body.removeChild(a);
};
