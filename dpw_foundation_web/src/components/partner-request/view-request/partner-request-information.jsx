import { Grid, Paper, Stack, Typography } from '@mui/material';

import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import DocumentsRowView from './DocumentsRowView';
import PreviousDataRow from './PreviousDataRow';

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

export default function PartnerRequestInformation({ documentsList = [] }) {
  const partnerRequestData = useSelector((state) => state?.partner?.partnerRequestData);
  const { masterData } = useSelector((state) => state?.common);

  const {
    partnershipDescription,
    requestedResource,
    partnershipSector,
    documentType,
    partnershipTitle,
    yearsOfExperience,
    describePreviousProjects,
    totalDuration,
    contactPersonEmail,
    contactPersonName,
    contactPersonDesignation,
    contactPhoneNumber,
    endDate,
    startDate,
    additionalComments,
    isPrimaryContact,
    describeSpecificAvailability
  } = partnerRequestData || {};
  const requestInformation = [
    {
      label: 'Request Source',
      value: requestedResource || '-'
    },
    {
      label: 'Partnership Sector',
      value: partnershipSector || '-'
    },
    {
      label: 'Partnership / Agreement Type',
      value: documentType ? getLabelByCode(masterData, 'dpwf_partner_agreement_type', documentType) : '-'
    },
    {
      label: 'Partnership Title',
      value: partnershipTitle || '-'
    },
    {
      label: 'Partnership Description',
      value: partnershipDescription || '-',
      gridProps: { xs: 12 }
    }
  ];

  const proposedDetails = [
    { label: 'Years of Experience', value: yearsOfExperience || '-', gridProps: { xs: 12 } },
    { label: 'Describe Previous Projects', value: describePreviousProjects || '-', gridProps: { xs: 12 } }
  ];
  const dpWorldContact = [
    { label: 'Contact Person Email ID', value: contactPersonEmail },
    { label: 'Contact Person Name', value: contactPersonName },
    { label: 'Contact Person Designation', value: contactPersonDesignation },
    { label: 'Contact Person Phone Number', value: contactPhoneNumber },
    { label: 'Is Primary Contact?', value: isPrimaryContact == 'true' ? 'yes' : 'No' }
  ];

  const timeDetails = [
    { label: 'Start Date for Services', value: startDate ? fDateWithLocale(startDate) : '-' },
    { label: 'End Date for Services', value: endDate ? fDateWithLocale(endDate) : '-' },
    { label: 'Total Duration', value: totalDuration },
    { label: 'Describe Specific Availability / Unavailability', value: describeSpecificAvailability },
    { label: 'Additional Comments or Notes', value: additionalComments, gridProps: { xs: 12 } }
  ];
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            Partnership Request form
          </Typography>
        </Grid>
        {requestInformation?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            partner's role and responsibilities
          </Typography>
        </Grid>
        {proposedDetails?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}
        <Grid item xs={12}>
          <PreviousDataRow />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            time frame and availability
          </Typography>
        </Grid>
        {timeDetails?.map((field) => (
          <FieldDisplay
            key={field?.label}
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
            sx={{ pb: 3 }}
          >
            Supporting Docs
          </Typography>
          <DocumentsRowView rowData={documentsList} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Partnership Contact details
          </Typography>
        </Grid>
        {dpWorldContact?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}
      </Grid>
    </Paper>
  );
}
