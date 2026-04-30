// Enable client-side rendering for Next.js pages using React hooks
'use client';

// Import necessary hooks and components
import { useParams } from 'next/navigation'; // Import hook to retrieve dynamic parameters from the URL
import PropTypes from 'prop-types';
import { useState } from 'react'; // Import React's useState hook for managing component state
import { useQuery } from 'react-query'; // Import React Query's useQuery hook to fetch data
import { useDispatch, useSelector } from 'react-redux'; // Import Redux's useDispatch hook for dispatching actions
import { useAuthorizationRedirect } from 'src/hooks/useAuthorizationRedirect';
import { setToastMessage } from 'src/redux/slices/common'; // Import Redux action to display toast messages
import * as api from 'src/services'; // Import API functions from services
import DonationView from './donationView'; // Import the DonationView component for viewing donation details
// Define the module list for media attachment
const moduleList = ['DONOR_IDENTITY_PROOF_ATTACHEMENT']; // Array of module types, indicating the attachment type

// Define a type for donor-related actions
const type = 'DONOR'; // String representing the type of entity (donor)

// Define the main Donation component
const DonationAccept = () => {
  const [detail, setDetail] = useState(); // Declare state to hold the donation details
  const params = useParams(); // Retrieve dynamic URL parameters using useParams hook
  const dispatch = useDispatch(); // Set up dispatch function from Redux
  const { profileData } = useSelector((state) => state.profile);
  const contributed = profileData?.contributedAs ?? [];
  // Fetch donor data using React Query's useQuery hook
  const { isLoading, refetch } = useQuery(['getDonor', params.id], () => api.getDonationDetailById(params.id), {
    enabled: !!params.id, // Only run the query if the params.id exists
    onSuccess: async (response) => {
      // On successful data retrieval, process the response
      if (response?.data) {
        // Fetch media attachments associated with the donor
        let donorMediaList = await api.getMediaList({ type, moduleList, id: response?.data?.donor?.id });

        // Filter for identity proof attachments from the media list
        const donorIdentity = donorMediaList?.filter((item) => item.moduleType === 'DONOR_IDENTITY_PROOF_ATTACHEMENT');

        // Fetch the assessment details for the donor and donation
        const assessment = await api.getAssessmentDetailById(response?.data?.donor?.id, params.id);

        // Update the state with the retrieved data, including attachments and assessment
        setDetail({
          ...response?.data, // Spread the original response data
          assessment: {
            ...assessment?.data, // Spread the assessment data
            passportAttachments: donorIdentity // Add filtered identity proof attachments
          }
        });
      }
    },
    onError: (err) => {
      // Handle errors when the query fails
      // Dispatch an error message using Redux to show a toast notification
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  useAuthorizationRedirect({
    condition: !contributed?.includes('DONOR'),
    redirectTo: '/user/settings',
    deps: [contributed]
  });

  // Return the appropriate component based on the isView prop
  return <DonationView data={detail} loading={isLoading} isAccept={true} donorDataRefetch={refetch} />;
};

DonationAccept.propTypes = {
  // 'isView' determines if the component is in view mode
  isView: PropTypes.bool.isRequired
};

export default DonationAccept; // Export the Donation component for use in other parts of the application
