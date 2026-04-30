'use client';
import { Typography } from '@mui/material';
import SkillCertificationsTable from 'src/components/table/SkillCertificationsTable';

export default function SkillsCertifications({ enrollmentData }) {
  const { skillCertifications } = enrollmentData || {};

  return (
    <>
      <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" mb={2} mt={2}>
        Skills Certifications
      </Typography>
      <SkillCertificationsTable
        data={skillCertifications || []}
        isEditable={false}
        showHeader={false}
        showAddButton={false}
        showPaper={true}
      />
    </>
  );
}
