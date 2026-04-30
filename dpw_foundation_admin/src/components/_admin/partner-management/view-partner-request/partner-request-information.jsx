import { Grid, Paper, Stack, Typography } from '@mui/material';

import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import DocumentsRowView from 'src/components/table/rows/DocumentsRowView';
import * as partnerManagementApi from 'src/services/partner';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import PreviouslyProject from '../create-request/PreviouslyProject';

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
  const { masterData } = useSelector((state) => state?.common);
  const partnerRequestData = useSelector((state) => state?.partner?.partnershipRequestData);

  const {
    partnershipSector,
    requestedResource,
    documentType,
    partnershipTitle,
    partnershipDescription,
    yearsOfExperience,
    describePreviousProjects,
    startDate,
    endDate,
    totalDuration,
    describeSpecificAvailability,
    additionalComments,
    contactPersonEmail,
    contactPersonName,
    contactPersonDesignation,
    contactPhoneNumber,
    isPrimaryContact,
    partnerId
  } = partnerRequestData || {};

  const { data: previouslyProjectData } = useQuery(
    'getPreviouslyProject',
    () => partnerManagementApi.getPreviouslyProject({ partnerId }),
    {
      enabled: !!partnerId
    }
  );

  const requestInformation = [
    {
      label: 'Request Source',
      value: requestedResource ? getLabelByCode(masterData, 'dpwf_partner_request_source', requestedResource) : '-'
    },
    {
      label: 'Partnership Sector',
      value: partnershipSector ? getLabelByCode(masterData, 'dpwf_partner_sector', partnershipSector) : '-'
    },
    {
      label: 'Partnership / Agreement Type',
      value: documentType ? getLabelByCode(masterData, 'dpwf_partner_agreement_type', documentType) : '-'
    },
    { label: 'Partnership Title', value: partnershipTitle },
    { label: 'Partnership Description', value: partnershipDescription }
  ];

  const rolesAndResponsibilities = [
    {
      label: 'Years of Experience',
      value: yearsOfExperience ? getLabelByCode(masterData, 'dpwf_partner_year_of_exp', yearsOfExperience) : '-',
      gridProps: { xs: 12 }
    },
    { label: 'Describe Previous Projects', value: describePreviousProjects, gridProps: { xs: 12 } }
  ];

  const timeFrameAndAvailability = [
    { label: 'Start Date for Services', value: startDate ? fDateWithLocale(startDate) : '-' },
    { label: 'End Date for Services', value: endDate ? fDateWithLocale(endDate) : '-' },
    { label: 'Total Duration', value: totalDuration },
    { label: 'Describe Specific Availability / Unavailability', value: describeSpecificAvailability },
    { label: 'Additional Comments or Notes', value: additionalComments, gridProps: { xs: 12 } }
  ];

  const partnershipContactDetails = [
    { label: 'Contact Person Email ID', value: contactPersonEmail },
    { label: 'Contact Person Name', value: contactPersonName },
    { label: 'Contact Person Designation', value: contactPersonDesignation },
    { label: 'Contact Person Phone Number', value: contactPhoneNumber },
    { label: 'Is Primary Contact?', value: isPrimaryContact ? 'Yes' : 'No' }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary.main" textTransform="uppercase">
            Partnership request
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
            Partner's Role and Responsibilities
          </Typography>
        </Grid>
        {rolesAndResponsibilities?.map((field) => (
          <FieldDisplay
            key={field?.label}
            label={field?.label}
            value={field?.value}
            textTransform={field?.textTransform}
            gridProps={field?.gridProps}
          />
        ))}

        <Grid item xs={12}>
          <PreviouslyProject rowData={previouslyProjectData} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Time Frame and Availability
          </Typography>
        </Grid>
        {timeFrameAndAvailability?.map((field) => (
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
          <DocumentsRowView moduleName="partner" rowData={documentsList} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
            Partnership Contact Details
          </Typography>
        </Grid>
        {partnershipContactDetails?.map((field) => (
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
