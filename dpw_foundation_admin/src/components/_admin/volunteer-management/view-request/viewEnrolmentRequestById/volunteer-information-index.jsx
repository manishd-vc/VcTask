'use client';
import { Typography } from '@mui/material';
import IdentityDocuments from './identity-documents';
import ProfileDetails from './profile-details';
import SkillsCertifications from './skills-certifications';
import SupportingDocuments from './supporting-documents';
import VolunteeringInformation from './volunteer-information';

export default function VolunteerInformation({ enrollmentData }) {
  return (
    <>
      <Typography variant="h6" color="primary.main" textTransform="uppercase" mb={3}>
        Volunteer Information Form
      </Typography>
      <ProfileDetails enrollmentData={enrollmentData} />
      <IdentityDocuments enrollmentData={enrollmentData} />
      <VolunteeringInformation enrollmentData={enrollmentData} />
      <SkillsCertifications enrollmentData={enrollmentData} />
      <SupportingDocuments enrollmentData={enrollmentData} />
    </>
  );
}
