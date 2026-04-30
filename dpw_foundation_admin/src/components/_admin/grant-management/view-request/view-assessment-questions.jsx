import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import ModalStyle from 'src/components/dialog/dialog.style';
import { CloseIcon } from 'src/components/icons';

const FieldDisplay = ({ label, value, textTransform, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform={textTransform}>
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function ViewAssessmentQuestions({ open, handleClose }) {
  const grantRequestData = useSelector((state) => state?.grant?.grantRequestData);
  const theme = useTheme();
  const style = ModalStyle(theme);
  const {
    partnerOrganizationName,
    referenceNo,
    organizationIntro,
    projectLinkToPillars,
    hasCurrentAnnualAccounts,
    accountsIndependentlyAudited,
    auditorCompany,
    directGovtPartnership,
    associatedWithSanctionedCountries,
    adequateFinancialRecords,
    publishedAnnualReports,
    meetsEligibility,
    directAssistancePoliticallyLinked,
    dpwfMonitorAuditAbility,
    localLawsRequirements,
    priorExperienceConcerns,
    otherImportantDetail,
    assessorFinding,
    assessorConclusion
  } = grantRequestData?.grantAssessment || {};

  const basicQuestions = [
    { label: 'Partner Organization Name', value: partnerOrganizationName },
    { label: 'Reference No', value: referenceNo },
    {
      label: 'Short Introduction of the Charitable organization / NGO',
      value: organizationIntro,
      gridProps: { xs: 12 }
    },
    {
      label: 'How does this Donation / Project link to the Foundation Pillars / Focus Area',
      value: projectLinkToPillars,
      gridProps: { xs: 12 }
    }
  ];
  const booleanToYesNo = (value) => (value ? 'Yes' : 'No');

  const financialRecords = [
    {
      label: 'Does the organization have current annual accounts?',
      value: booleanToYesNo(hasCurrentAnnualAccounts),
      gridProps: { xs: 12 }
    },
    {
      label: 'Are the accounts independently audited? If so by whom?',
      value: booleanToYesNo(accountsIndependentlyAudited),
      gridProps: { xs: 12 }
    },
    ...(accountsIndependentlyAudited
      ? [
          {
            label: 'Auditor Company',
            value: auditorCompany,
            gridProps: { xs: 12 }
          }
        ]
      : []),
    {
      label: 'Is this a direct partnership with a government or a government/politically linked individual?',
      value: booleanToYesNo(directGovtPartnership),
      gridProps: { xs: 12 }
    },
    {
      label: 'Is the project associated with any sanctioned countries?',
      value: booleanToYesNo(associatedWithSanctionedCountries),
      gridProps: { xs: 12 }
    },
    {
      label: 'Does the organization have adequate financial records?',
      value: booleanToYesNo(adequateFinancialRecords),
      gridProps: { xs: 12 }
    },
    {
      label: 'Has the partner published regular annual reports?',
      value: booleanToYesNo(publishedAnnualReports),
      gridProps: { xs: 12 }
    },
    {
      label:
        'Does this request meet the eligibility for donation as laid down in the DP World Foundation Charity Partnership Policy?',
      value: booleanToYesNo(meetsEligibility),
      gridProps: { xs: 12 }
    },
    {
      label: 'Is this a direct assistance with politically linked individual?',
      value: booleanToYesNo(directAssistancePoliticallyLinked),
      gridProps: { xs: 12 }
    },
    {
      label: 'Will DPWF have the ability to monitor or audit the use of the donation?',
      value: booleanToYesNo(dpwfMonitorAuditAbility),
      gridProps: { xs: 12 }
    },
    {
      label: 'Are there any local laws and requirements to be aware of in carrying out the proposed donation?',
      value: booleanToYesNo(localLawsRequirements),
      gridProps: { xs: 12 }
    },
    {
      label: "Has DPWF's prior experience with the requester raised any concerns?",
      value: booleanToYesNo(priorExperienceConcerns),
      gridProps: { xs: 12 }
    },
    {
      label: 'Any other important detail',
      value: otherImportantDetail,
      gridProps: { xs: 12 }
    },
    {
      label: "Assessor's Finding",
      value: assessorFinding,
      gridProps: { xs: 12 }
    },
    {
      label: "Assessor's Conclusion",
      value: assessorConclusion,
      gridProps: { xs: 12 }
    }
  ];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main" mb={0}>
        View Assessment Questions
      </DialogTitle>
      <IconButton aria-label="close" onClick={handleClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main" sx={{ mb: 2 }}>
          Basic Questions
        </Typography>
        <Grid container spacing={2}>
          {basicQuestions?.map((field, index) => (
            <FieldDisplay
              key={`${field.label}-${field.value}`}
              label={field?.label}
              value={field?.value}
              textTransform={field?.textTransform}
              gridProps={field?.gridProps}
            />
          ))}
          <Grid item xs={12}>
            <Typography
              variant="subtitle6"
              component="h4"
              textTransform={'uppercase'}
              color="primary.main"
              sx={{ mt: 1 }}
            >
              Financial Records
            </Typography>
          </Grid>
          {financialRecords?.map((field) => (
            <FieldDisplay
              key={field.label}
              label={field?.label}
              value={field?.value}
              textTransform={field?.textTransform}
              gridProps={field?.gridProps}
            />
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
