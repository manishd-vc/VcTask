import CampaignRelatedTask from './CampaignRelatedTask';
import PublishVolunteerCampaign from './PublishVolunteerCampaign';
import RiskAssessment from './RiskAssessment';
import VolunteerCampaignMilestone from './VolunteerCampaignMilestone';

export default function CampaignStep2() {
  return (
    <>
      <RiskAssessment />
      <CampaignRelatedTask />
      <VolunteerCampaignMilestone />
      <PublishVolunteerCampaign />
    </>
  );
}
