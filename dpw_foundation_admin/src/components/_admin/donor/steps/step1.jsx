import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import CampaignSkeleton from 'src/components/skeletons/home/hero';
// Lazy-loaded components for IntentDetails and DonationForm
const DonationForm = React.lazy(() => import('./donationForm'));

/**
 * Step1 component renders the IntentDetails and DonationForm components.
 * Suspense is used to display a fallback skeleton loader while the components are being loaded lazily.
 *
 * @param {Object} props
 * @param {boolean} props.isLoading - A flag to indicate if the DonationForm is loading.
 * @returns {JSX.Element} The component rendering Step 1 with two lazy-loaded components.
 */
const Step1 = ({ isLoading, isViewOnly }) => {
  return (
    <>
      {/* Suspense to display CampaignSkeleton while DonationForm is being loaded */}
      <Suspense fallback={<CampaignSkeleton />}>
        <DonationForm isLoading={isLoading} isViewOnly={isViewOnly} />
      </Suspense>
    </>
  );
};

Step1.propTypes = {
  // 'isLoading' is a boolean indicating if the component is in edit mode
  isLoading: PropTypes.bool.isRequired
};

export default Step1;
