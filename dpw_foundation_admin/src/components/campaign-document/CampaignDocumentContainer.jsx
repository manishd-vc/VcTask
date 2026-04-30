import PropTypes from 'prop-types';
import { useState } from 'react';
import CampaignDocumentTable from './CampaignDocumentTable';

/**
 * CampaignDocumentContainer Component
 *
 * A container component that manages the state and business logic for campaign documents.
 * This component demonstrates how to integrate the CampaignDocumentTable with your application.
 *
 * @param {Object} props - Component props
 * @param {string} props.campaignId - The ID of the campaign
 * @param {Array} props.initialDocuments - Initial documents to display
 * @param {boolean} props.readonly - Whether the table is in readonly mode
 */
const CampaignDocumentContainer = ({ initialDocuments = [], readonly = false }) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isLoading, setIsLoading] = useState(false);

  // Sample documents for demonstration
  const sampleDocuments = [
    {
      id: 1,
      name: 'National ID',
      purpose: 'The primary purpose of document.',
      type: 'Driving License.jpg',
      fileUrl: '/path/to/document1.jpg',
      uploadDate: new Date('2025-06-11T09:45:00'),
      uploadedBy: 'John'
    },
    {
      id: 2,
      name: 'Driving License',
      purpose: 'Purpose of document',
      type: 'National ID.pdf',
      fileUrl: '/path/to/document2.pdf',
      uploadDate: new Date('2025-06-11T09:45:00'),
      uploadedBy: 'Jokee'
    }
  ];

  // Use sample documents if no initial documents provided
  const displayDocuments = documents.length > 0 ? documents : sampleDocuments;

  /**
   * Handle viewing a document
   * @param {Object} document - The document to view
   */
  const handleViewDocument = (document) => {
    if (document.fileUrl) {
      // Open document in new tab
      window.open(document.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log('Viewing document:', document);
      // Implement your view logic here
      // You could open a modal, navigate to a detail page, etc.
    }
  };

  /**
   * Handle deleting a document
   * @param {Object} document - The document to delete
   */
  const handleDeleteDocument = async (document) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${document.name}"?`);

    if (!confirmDelete) return;

    try {
      setIsLoading(true);

      // Update local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== document.id));

      console.log('Document deleted:', document.name);
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle attaching a new document
   * @param {Object} documentData - The new document data
   */
  const handleAttachDocument = async (documentData) => {
    try {
      setIsLoading(true);

      // Create new document object
      const newDocument = {
        id: Date.now(), // Use proper ID from API response
        name: documentData.documentName,
        purpose: documentData.purpose,
        type: documentData.documentType,
        fileUrl: '#', // Use actual file URL from API response
        uploadDate: documentData.uploadDate,
        uploadedBy: documentData.uploadedBy,
        description: documentData.description
      };

      // Update local state
      setDocuments((prev) => [...prev, newDocument]);

      // Show success message
      // dispatch(setToastMessage({
      //   message: 'Document attached successfully',
      //   variant: 'success'
      // }));

      console.log('Document attached:', newDocument);
    } catch (error) {
      console.error('Error attaching document:', error);

      // Show error message
      // dispatch(setToastMessage({
      //   message: 'Failed to attach document',
      //   variant: 'error'
      // }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CampaignDocumentTable
      documents={displayDocuments}
      isLoading={isLoading}
      onView={handleViewDocument}
      onDelete={readonly ? undefined : handleDeleteDocument}
      onAttach={readonly ? undefined : handleAttachDocument}
      showActions={!readonly}
      title="CAMPAIGN DOCUMENT"
    />
  );
};

CampaignDocumentContainer.propTypes = {
  initialDocuments: PropTypes.array,
  readonly: PropTypes.bool
};

export default CampaignDocumentContainer;
