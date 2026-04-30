import { getLabelObject } from 'src/utils/extractLabelValues';

/**
 * Retrieves default file validation parameters, such as allowed file types,
 * maximum file size, and maximum upload count, based on master data configuration.
 *
 * @param {string} typeOfAllowed - The code for the type of files allowed (e.g., "image", "video").
 * @param {Object} masterData - The master data containing configuration values.
 * @returns {Object} - An object containing validation parameters:
 *                     `photoAlbumAllowed`, `maxPhotoSizeKB`, `uploadCount`.
 */
export const getDefaultFileValidation = (typeOfAllowed, masterData) => {
  const imageValidation = getLabelObject(masterData, 'dpw_foundation_configuration');

  // Fetches allowed file type, max file size, and upload count from the configuration
  const photoAlbumAllowed = imageValidation?.values?.find((item) => item.code === typeOfAllowed)?.label || '';
  const maxPhotoSizeKB = parseInt(imageValidation?.values?.find((item) => item.code === 'fileSize')?.label);
  const uploadCount = parseInt(imageValidation?.values?.find((item) => item.code === 'fileCountPerUpload')?.label);

  return { photoAlbumAllowed, maxPhotoSizeKB, uploadCount };
};

/**
 * Handles file upload validation by checking against defined rules for maximum file size
 * and upload count. Displays error messages for invalid files and proceeds to upload valid ones.
 *
 * @param {File[]} files - An array of files selected for upload.
 * @param {Object} options - An object containing additional options and dependencies:
 *                           - `currentFileCount` {number}: The current number of uploaded files.
 *                           - `mutate` {Function}: Function to handle the file upload API.
 *                           - `setToastMessage` {Function}: Function to display toast messages.
 *                           - `dispatch` {Function}: Redux dispatch function.
 *                           - `maxPhotoSizeKB` {number}: Maximum allowed file size in KB.
 *                           - `uploadCount` {number}: Maximum allowed file count per upload.
 *                           - `...extraData` {Object}: Additional data for upload.
 * @returns {Promise<void>}
 */
export const handleFileUploadValidation = async (
  files,
  { currentFileCount, mutate, setToastMessage, dispatch, maxPhotoSizeKB, uploadCount, ...extraData }
) => {
  // Check if the total file count exceeds the allowed upload count
  if (files.length + currentFileCount > uploadCount) {
    dispatch(
      setToastMessage({
        message: `You can only upload ${uploadCount} photos in the Photo Album.`,
        variant: 'error'
      })
    );
    return;
  }
  // Validate each file's size and upload them if valid
  for (const file of files) {
    // Check if the file size exceeds the allowed limit
    if (file.size > maxPhotoSizeKB * 1024) {
      dispatch(
        setToastMessage({
          message: `File ${file.name} exceeds the size limit of ${maxPhotoSizeKB} KB.`,
          variant: 'error'
        })
      );
      continue;
    }

    try {
      // Attempt to upload the valid file
      await uploadFile(file, { mutate, ...extraData });
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
    }
  }
};

/**
 * Uploads a single file using the provided mutation function and additional data.
 *
 * @param {File} file - The file to upload.
 * @param {Object} options - An object containing the `mutate` function and extra data for the upload.
 * @returns {Promise<void>}
 */
const uploadFile = async (file, { mutate, ...extraData }) => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
    // Call the mutation function with the form data and additional options
    mutate({
      payload: formData,
      ...extraData
    });
  }
};
