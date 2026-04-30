/**
 * Uploads new files and updates their information in the form field.
 * @param {File[]} files - The array of files to be uploaded.
 * @param {Function} mutate - The mutation function to handle the file upload.
 * @param {Function} setFieldValue - The function to update the form field value.
 * @param {string | number} entityId - The identifier of the entity to which the file belongs.
 * @param {string} entityType - The type of the entity (e.g., 'user', 'campaign').
 * @param {string} moduleType - The type of module (e.g., 'media', 'documents').
 * @param {string} fieldName - The name of the field in the form where the file attachments are stored.
 */
export const uploadFiles = async (files, mutate, setFieldValue, entityId, entityType, moduleType, fieldName) => {
  const newFiles = files.filter((file) => !file.id); // Files without `id` are new

  if (newFiles.length === 0) return; // No new files to upload

  const uploadPromises = newFiles.map(async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Perform the upload mutation for each new file
      const uploadedFile = await mutate({
        entityId: entityId,
        entityType: entityType,
        moduleType: moduleType,
        payload: formData
      });

      // Update the file in `attachments` with the returned `id`
      setFieldValue(fieldName, (prevAttachments) =>
        prevAttachments.map((prevFile) => (prevFile === file ? { ...file, id: uploadedFile.id } : prevFile))
      );
    } catch (error) {
      console.error('Upload failed', error);
      // You might want to handle the error further, like updating the status to "Failed"
    }
  });

  await Promise.all(uploadPromises);
};
