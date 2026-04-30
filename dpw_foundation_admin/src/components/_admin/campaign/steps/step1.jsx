import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect } from 'react';
import CampaignSkeleton from 'src/components/skeletons/home/hero';
// Dynamically imported components
const CampaignDetails = React.lazy(() => import('./campaignDetails/campaignDetails'));
const PartnerForm = React.lazy(() => import('./partnerForm/partnerForm'));
const BannerSection = React.lazy(() => import('./bannerSection/bannerSection'));
const FundingFinancialDetails = React.lazy(() => import('./fundingFinancialDetails/fundingFinancialDetails'));
const ProjectLocation = React.lazy(() => import('./projectLocation/projectLocation'));
const TimeLine = React.lazy(() => import('./timeLine/timeLine'));
const TargetForm = React.lazy(() => import('./targets/targetForm'));

const VolunteersDetails = React.lazy(() => import('./volunteersDetails/volunteersDetails'));
const DocumentSection = React.lazy(() => import('./documentSection/documentSection'));

/**
 * Step1 component for rendering the first step of a multi-step form or process.
 * This component automatically scrolls to the top of the page upon mounting.
 *
 * @param {Object} props - The props for the component.
 * @param {Function} props.mediaListRefetch - Function to refetch the media list.
 * @param {boolean} props.isEdit - Flag indicating if the form is in edit mode.
 * @param {boolean} props.isApprove - Flag indicating if the form is in approval mode.
 * @param {Function} props.setIsAdvanced - Function to toggle or set the advanced step state.
 *
 * @returns {JSX.Element} The rendered Step1 component.
 */
const Step1 = ({ mediaListRefetch, isEdit, isApprove, setIsAdvanced, onDistribution }) => {
  // Scroll to the top of the page when the component mounts
  const { values } = useFormikContext();
  useEffect(() => {
    const firstElement = document.getElementById('top-of-page'); // Target the element with id 'top-of-page'
    if (firstElement) {
      firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scroll to the top of the page
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div id="top-of-page">
      <Suspense fallback={<CampaignSkeleton />}>
        <CampaignDetails isEdit={isEdit} />
      </Suspense>
      <Suspense fallback={<CampaignSkeleton />}>
        <BannerSection isEdit={isEdit} isApprove={isApprove} mediaListRefetch={mediaListRefetch} />
      </Suspense>
      <Suspense fallback={<CampaignSkeleton />}>
        <FundingFinancialDetails isEdit={isEdit} isApprove={isApprove} />
      </Suspense>
      <Suspense fallback={<CampaignSkeleton />}>
        <TimeLine isEdit={isEdit} isLoading={false} onDistribution={onDistribution} />
      </Suspense>
      <Suspense fallback={<CampaignSkeleton />}>
        <ProjectLocation isEdit={isEdit} />
      </Suspense>
      {values?.campaignType === 'FUNDCAMP' && (
        <Suspense fallback={<CampaignSkeleton />}>
          <TargetForm isEdit={isEdit} isApprove={isApprove} />
        </Suspense>
      )}

      <Suspense fallback={<CampaignSkeleton />}>
        <VolunteersDetails isEdit={isEdit} setIsAdvanced={setIsAdvanced} />
      </Suspense>

      <Suspense fallback={<CampaignSkeleton />}>
        <PartnerForm isEdit={isEdit} isApprove={isApprove} />
      </Suspense>
      <Suspense fallback={<CampaignSkeleton />}>
        <DocumentSection isEdit={isEdit} mediaListRefetch={mediaListRefetch} isApprove={isApprove} />
      </Suspense>
    </div>
  );
};

Step1.propTypes = {
  // 'mediaListRefetch' is a function for refetching the media list
  mediaListRefetch: PropTypes.func.isRequired,

  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the component is in approve mode
  isApprove: PropTypes.bool.isRequired,

  // 'setIsAdvanced' is a function to set the advanced state
  setIsAdvanced: PropTypes.func.isRequired
};

export default Step1;
