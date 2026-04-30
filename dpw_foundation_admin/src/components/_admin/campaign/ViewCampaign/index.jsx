'use client';
import { Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomAccordion from 'src/components/customAccordion';
import CampaignDetailsView from '../steps/campaignDetails/campaignDetailsView';
import CampaignRelatedTask from '../steps/campaignRelatedTask';
import ContributionSectionView from '../steps/contributionSection/contributionSectionView';
import DocumentSection from '../steps/documentSection/documentSection';
import EmailCampaignView from '../steps/emailCampaign/emailCampaignView';
import FundingFinancialDetailsView from '../steps/fundingFinancialDetails/view/fundingFinancialDetailsView';
import PartnerFormView from '../steps/partnerForm/partnerFormView';
import PaymentHistory from '../steps/paymentHistory';
import PostAnalysisReport from '../steps/postAnalysisReport';
import ProjectLocationView from '../steps/projectLocation/projectLocationView';
import RiskAssessment from '../steps/riskAssesment';
import CampaignTarget from '../steps/TargetDetails';
import VolunteersDetailsView from '../steps/volunteersDetails/volunteersDetailsView';
import PublishingDetails from './publishingDetails';

export default function ViewCampaign({ isApproval, isSupervisor, refetchCampaignApi, beneficiaryProject }) {
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const [expandedPanels, setExpandedPanels] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      setExpandedPanels([...expandedPanels, panel]);
    } else {
      setExpandedPanels(expandedPanels.filter((item) => item !== panel));
    }
  };
  const allPanels = [
    'basic',
    'funding',
    'volunteering',
    'Partnership',
    'projectDocumnets',
    'inKind',
    'emailer',
    'postProjectAnalysisReport',
    'projectPublishingDetails',
    'paymentHistory',
    'target',
    'relatedTask',
    'risk',
    'postProjectCompletionDetails'
  ];

  const handleExpandAll = () => {
    if (expandedPanels.length === allPanels.length) {
      setExpandedPanels([]);
    } else {
      setExpandedPanels(allPanels);
    }
  };
  let toolTipTitle = '';
  if (isSupervisor) {
    if (campaignUpdateData?.status === 'COMPLETED') {
      toolTipTitle = 'Please complete post project completion details';
    } else {
      toolTipTitle = 'Please update dispenses';
    }
  }

  return (
    <>
      <Stack
        justifyContent={{ xs: 'flex-start', sm: 'space-between', md: 'space-between' }}
        flexDirection="row"
        gap={2}
        flexWrap="wrap"
        mt={3}
      >
        <Typography variant="h5" color="primary.main" textTransform="uppercase">
          {campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Overview' : ' Project Overview'}
        </Typography>
        <Button variant="contained" size="small" onClick={handleExpandAll}>
          {expandedPanels.length === allPanels.length ? 'Collapse All' : 'Expand All'}
        </Button>
      </Stack>
      <Suspense
        fallback={
          <Stack flexDirection="column" alignItems="center" sx={{ height: '50vh' }}>
            <LinearProgress />
          </Stack>
        }
      >
        <CustomAccordion
          accordionTitle={
            campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Basic Detail' : 'Project Basic Detail'
          }
          handleChange={handleChange('basic')}
          expanded={expandedPanels.includes('basic')}
        >
          <Paper sx={{ p: 3 }}>
            <CampaignDetailsView />
            <ProjectLocationView />
          </Paper>
        </CustomAccordion>

        <CustomAccordion
          accordionTitle={
            campaignUpdateData?.campaignType === 'FUNDCAMP'
              ? 'Campaign Funding and Sector Details'
              : 'Project Funding and Distribution Details'
          }
          handleChange={handleChange('funding')}
          expanded={expandedPanels.includes('funding')}
          isSupervisor={isSupervisor}
          whiteBackground={campaignUpdateData?.status === 'COMPLETED' || isSupervisor}
          toolTipTitle={toolTipTitle}
          isUpdate={campaignUpdateData?.status === 'COMPLETED' && !isSupervisor}
        >
          <FundingFinancialDetailsView
            isSupervisor={isSupervisor}
            refetchCampaignApi={refetchCampaignApi}
            beneficiaryProject={beneficiaryProject}
          />
        </CustomAccordion>
        {campaignUpdateData?.campaignType === 'FUNDCAMP' && (
          <>
            <CustomAccordion
              accordionTitle={'Campaign Target'}
              handleChange={handleChange('target')}
              expanded={expandedPanels.includes('target')}
              isSupervisor={isSupervisor}
              toolTipTitle="Please update campaign target progress"
              whiteBackground={isSupervisor}
            >
              <CampaignTarget isSupervisor={isSupervisor} refetchCampaignApi={refetchCampaignApi} />
            </CustomAccordion>
          </>
        )}
        <CustomAccordion
          accordionTitle={
            campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Related Task' : 'Project Related Task'
          }
          handleChange={handleChange('relatedTask')}
          expanded={expandedPanels.includes('relatedTask')}
          isSupervisor={isSupervisor}
          toolTipTitle={`Please update ${campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'campaign' : 'project'} related task progress`}
          whiteBackground={isSupervisor}
        >
          <CampaignRelatedTask isSupervisor={isSupervisor} refetchCampaignApi={refetchCampaignApi} />
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="Volunteering Details"
          handleChange={handleChange('volunteering')}
          expanded={expandedPanels.includes('volunteering')}
        >
          <VolunteersDetailsView />
        </CustomAccordion>

        <CustomAccordion
          accordionTitle={'Partnership Details'}
          handleChange={handleChange('Partnership')}
          expanded={expandedPanels.includes('Partnership')}
        >
          <PartnerFormView />
        </CustomAccordion>
        <CustomAccordion
          accordionTitle={campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign Documents' : 'Project Documents'}
          handleChange={handleChange('projectDocumnets')}
          expanded={expandedPanels.includes('projectDocumnets')}
        >
          <DocumentSection isView />
        </CustomAccordion>
        {campaignUpdateData?.campaignType !== 'FUNDCAMP' && (
          <CustomAccordion
            accordionTitle={'in kind contributions'}
            handleChange={handleChange('inKind')}
            expanded={expandedPanels.includes('inKind')}
            isSupervisor={isSupervisor}
            toolTipTitle="Please updated in kind contribution details"
          >
            <ContributionSectionView isSupervisor={isSupervisor} refetchCampaignApi={refetchCampaignApi} />
          </CustomAccordion>
        )}
        <CustomAccordion
          accordionTitle={campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'Campaign emailer' : 'Project emailer'}
          handleChange={handleChange('emailer')}
          expanded={expandedPanels.includes('emailer')}
        >
          <EmailCampaignView />
        </CustomAccordion>
        {campaignUpdateData?.status !== 'REJECTED' && (
          <CustomAccordion
            accordionTitle={
              campaignUpdateData?.campaignType === 'FUNDCAMP'
                ? 'post Campaign analysis report'
                : 'post project analysis report'
            }
            handleChange={handleChange('postProjectAnalysisReport')}
            expanded={expandedPanels.includes('postProjectAnalysisReport')}
          >
            <PostAnalysisReport />
          </CustomAccordion>
        )}
        <CustomAccordion
          accordionTitle={
            campaignUpdateData?.campaignType === 'FUNDCAMP'
              ? 'Campaign publishing details'
              : 'project publishing details'
          }
          handleChange={handleChange('projectPublishingDetails')}
          expanded={expandedPanels.includes('projectPublishingDetails')}
        >
          <PublishingDetails />
        </CustomAccordion>
        {campaignUpdateData?.campaignType === 'FUNDCAMP' && (
          <CustomAccordion
            accordionTitle={'Risk Assessment'}
            handleChange={handleChange('risk')}
            expanded={expandedPanels.includes('risk')}
          >
            <RiskAssessment />
          </CustomAccordion>
        )}
        <CustomAccordion
          accordionTitle={campaignUpdateData?.campaignType === 'FUNDCAMP' ? 'donation history' : 'payment history'}
          handleChange={handleChange('paymentHistory')}
          expanded={expandedPanels.includes('paymentHistory')}
        >
          <PaymentHistory />
        </CustomAccordion>
      </Suspense>
    </>
  );
}
