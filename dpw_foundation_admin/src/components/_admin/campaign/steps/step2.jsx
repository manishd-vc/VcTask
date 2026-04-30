'use client';
// mui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import CampaignSkeleton from 'src/components/skeletons/home/hero';
import EmailPreview from './emailPreview';
// Dynamically imported components
const ContributionSection = React.lazy(() => import('./contributionSection/contributionSection'));
const RelatedTasks = React.lazy(() => import('./relatedTasks/relatedTasks'));
const RiskAssessmentForm = React.lazy(() => import('./riskAssessment/riskAssessmentForm'));
const EmailCampaign = React.lazy(() => import('./emailCampaign/emailCampaign'));
const PublishCampaign = React.lazy(() => import('./publishCampaign'));
Step2.propTypes = {
  // 'isEdit' is a boolean indicating if the component is in edit mode
  isEdit: PropTypes.bool.isRequired,

  // 'isApprove' is a boolean indicating if the component is in approve mode
  isApprove: PropTypes.bool.isRequired
};

export default function Step2({ isEdit, isApprove }) {
  const [viewEmail, setViewEmail] = useState(false);

  const { values } = useFormikContext();

  // Handle closing the email view
  const handleViewClose = () => {
    setViewEmail(false);
  };

  // Scroll to the top of the page on mount
  useEffect(() => {
    const firstElement = document.getElementById('top-of-page');
    if (firstElement) {
      firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Optional: You can manage loading state for lazy-loaded components if needed
  const isLoading = false; // This can be dynamically set if needed
  return (
    <div id="top-of-page">
      {values?.campaignType === 'CHARITY' && (
        <Suspense fallback={<CampaignSkeleton />}>
          <ContributionSection isEdit={isEdit} isLoading={isLoading} />
        </Suspense>
      )}

      <Suspense fallback={<CampaignSkeleton />}>
        <RelatedTasks isEdit={isEdit} isLoading={isLoading} isApprove={isApprove} />
      </Suspense>

      <Suspense fallback={<CampaignSkeleton />}>
        <EmailCampaign isEdit={isEdit} isLoading={isLoading} isApprove={isApprove} />
      </Suspense>

      {values?.campaignType === 'FUNDCAMP' && (
        <Suspense fallback={<CampaignSkeleton />}>
          <RiskAssessmentForm isEdit={isEdit} isLoading={isLoading} />
        </Suspense>
      )}

      <Suspense fallback={<CampaignSkeleton />}>
        <PublishCampaign isEdit={isEdit} isLoading={isLoading} />
      </Suspense>

      <Dialog open={viewEmail} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle>Email {values?.campaignType === 'CHARITY' ? 'Project ' : 'Campaign '} Preview</DialogTitle>
        <DialogContent>
          <EmailPreview values={values} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
