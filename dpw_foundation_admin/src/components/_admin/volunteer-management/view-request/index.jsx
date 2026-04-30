'use client';
import { Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import CustomAccordion from 'src/components/customAccordion';
import LoadingFallback from 'src/components/loadingFallback';
import { setVolunteerCampaignData } from 'src/redux/slices/volunteer';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import MoreInfoView from '../../donor/needInfo';
import CampaignBasicDetails from './campaignBasicDetails';
import CampaignLocation from './campaignLocation';
import CampaignRelatedTask from './campaignRelatedTask';
import EmailerView from './EmailerView';
import EnrolmentDetails from './enrolmentDetails';
import PageHeader from './page-header';
import PublishingDetails from './publishingDetails';
import QuestionsAndRequestApproval from './questionsAndRequestApproval';
import RequestDetails from './request-details';
import RiskAssessmentDetails from './riskAssessmentDetails';
import VolunteerCampaignMilestone from './volunteerCampaignMilestone';
import VolunteerSelectionCriteria from './volunteerSelectionCriteria';
import WaiverDetails from './waiverDetails';

export default function ViewRequest() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [expandedPanels, setExpandedPanels] = useState([]);
  const { masterData } = useSelector((state) => state?.common);
  const volunteerCampaignData = useSelector((state) => state?.volunteer?.volunteerCampaignData);
  const { status, notes, needMoreInfoFileName, needMoreInfoId } = volunteerCampaignData || {};

  const handleChange = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      setExpandedPanels([...expandedPanels, panel]);
    } else {
      setExpandedPanels(expandedPanels.filter((item) => item !== panel));
    }
  };

  const allPanels = [
    'campaignBasicDetails',
    'enrolmentDetails',
    'volunteerSelectionCriteria',
    'wavierDetails',
    'campaignEmailer',
    'riskAssessment',
    'campaignRelatedTask',
    'volunteerCampaignMilestone',
    'campaignPublishingDetails',
    'checklistQuestions',
    'requestApprovals'
  ];

  const handleExpandAll = () => {
    if (expandedPanels.length === allPanels.length) {
      setExpandedPanels([]);
    } else {
      setExpandedPanels(allPanels);
    }
  };

  const showNeedMoreInfoBox = status === 'FEEDBACK_REQUESTED' && notes;

  const { isLoading, refetch } = useQuery(
    ['volunteerCampaign', volunteerApi.fetchVolunteerCampaignById, id],
    () => volunteerApi.fetchVolunteerCampaignById(id),
    {
      enabled: !!id,
      onSuccess: (data) => {
        dispatch(setVolunteerCampaignData(data));
      }
    }
  );

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <>
      <PageHeader refetch={refetch} />

      <RequestDetails />
      {showNeedMoreInfoBox && (
        <MoreInfoView
          chipLabel={getLabelByCode(masterData, 'dpwf_volunteer_status', status)}
          message={notes}
          fileName={needMoreInfoFileName}
          attachment={needMoreInfoId}
          spacing={false}
        />
      )}
      <Stack
        justifyContent={{ xs: 'flex-start', sm: 'space-between', md: 'space-between' }}
        flexDirection="row"
        gap={2}
        flexWrap="wrap"
        mt={3}
      >
        <Typography variant="h5" color="primary.main" textTransform="uppercase">
          volunteer Campaign Overview
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
          accordionTitle="Campaign Basic Details"
          handleChange={handleChange('campaignBasicDetails')}
          expanded={expandedPanels.includes('campaignBasicDetails')}
        >
          <Paper sx={{ p: 3 }}>
            <CampaignBasicDetails />
            <CampaignLocation />
          </Paper>
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="enrolment Details"
          handleChange={handleChange('enrolmentDetails')}
          expanded={expandedPanels.includes('enrolmentDetails')}
        >
          <Paper sx={{ p: 3 }}>
            <EnrolmentDetails />
          </Paper>
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="volunteer selection criteria"
          handleChange={handleChange('volunteerSelectionCriteria')}
          expanded={expandedPanels.includes('volunteerSelectionCriteria')}
        >
          <Paper sx={{ p: 3 }}>
            <VolunteerSelectionCriteria />
          </Paper>
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="wavier details"
          handleChange={handleChange('wavierDetails')}
          expanded={expandedPanels.includes('wavierDetails')}
        >
          <WaiverDetails />
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="campaign emailer"
          handleChange={handleChange('campaignEmailer')}
          expanded={expandedPanels.includes('campaignEmailer')}
        >
          <EmailerView />
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="risk assessment"
          handleChange={handleChange('riskAssessment')}
          expanded={expandedPanels.includes('riskAssessment')}
        >
          <RiskAssessmentDetails />
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="campaign related task"
          handleChange={handleChange('campaignRelatedTask')}
          expanded={expandedPanels.includes('campaignRelatedTask')}
        >
          <CampaignRelatedTask />
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="volunteer campaign milestone"
          handleChange={handleChange('volunteerCampaignMilestone')}
          expanded={expandedPanels.includes('volunteerCampaignMilestone')}
        >
          <VolunteerCampaignMilestone />
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="campaign publishing details"
          handleChange={handleChange('campaignPublishingDetails')}
          expanded={expandedPanels.includes('campaignPublishingDetails')}
        >
          <PublishingDetails />
        </CustomAccordion>
        <CustomAccordion
          accordionTitle="campaign approvals and checklist"
          handleChange={handleChange('checklistQuestions')}
          expanded={expandedPanels.includes('checklistQuestions')}
        >
          <QuestionsAndRequestApproval />
        </CustomAccordion>
      </Suspense>
    </>
  );
}
