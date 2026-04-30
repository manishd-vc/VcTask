import React, { Suspense } from 'react';
import CampaignSkeleton from 'src/components/skeletons/home/hero';

// Lazy-loaded component for Step2Form
const Step2Form = React.lazy(() => import('./step2Form'));

/**
 * Step2 component renders the Step2Form component.
 * Suspense is used to display a fallback skeleton loader while the component is being loaded lazily.
 *
 * @returns {JSX.Element} The component rendering Step 2 with lazy-loaded Step2Form.
 */
const Step2 = ({ isViewOnly }) => {
  return (
    <Suspense fallback={<CampaignSkeleton />}>
      {/* Suspense to display CampaignSkeleton while Step2Form is being loaded */}
      <Step2Form isViewOnly={isViewOnly} />
    </Suspense>
  );
};

export default Step2;
