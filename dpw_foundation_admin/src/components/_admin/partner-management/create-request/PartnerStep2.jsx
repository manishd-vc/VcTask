import { Box, Grid, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as partnerManagementApi from 'src/services/partner';
import { getLabelObject } from 'src/utils/extractLabelValues';
import ContactDetails from './ContactDetails';
import PreviouslyProject from './PreviouslyProject';
import TimeFrame from './TimeFrame';
import UploadPartnershipDocuments from './UploadPartnershipDocuments';

export default function PartnerStep2() {
  const { values, getFieldProps, errors, touched, setFieldValue } = useFormikContext();
  const partnershipRequestLoading = useSelector((state) => state?.partner?.partnershipRequestLoading);
  const { masterData } = useSelector((state) => state?.common);
  const partnerRequestData = useSelector((state) => state?.partner?.partnershipRequestData);
  const partnerSectorData = getLabelObject(masterData, 'dpwf_partner_sector');
  const requestSourceData = getLabelObject(masterData, 'dpwf_partner_request_source');
  const partnerAgreementTypeData = getLabelObject(masterData, 'dpwf_partner_agreement_type');
  const partnerYearOfExpData = getLabelObject(masterData, 'dpwf_partner_year_of_exp');

  const { partnerId } = partnerRequestData || {};

  const { data: previouslyProjectData } = useQuery(
    'getPreviouslyProject',
    () => partnerManagementApi.getPreviouslyProject({ partnerId }),
    {
      enabled: !!partnerId
    }
  );

  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="primary.main" sx={{ pb: 3 }}>
        Partnership request form
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton
            isLoading={partnershipRequestLoading}
            error={touched.requestedResource && errors.requestedResource}
          >
            <TextFieldSelect
              id="requestedResource"
              label={
                <>
                  Request Source{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={requestSourceData?.values}
              value={values?.requestedResource}
              onChange={(e) => setFieldValue('requestedResource', e.target.value)}
              error={Boolean(touched?.requestedResource && errors?.requestedResource)}
              disabled={false}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton
            isLoading={partnershipRequestLoading}
            error={touched.partnershipSector && errors.partnershipSector}
          >
            <TextFieldSelect
              id="partnershipSector"
              label={
                <>
                  Partnership Sector{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={partnerSectorData?.values}
              value={values?.partnershipSector}
              onChange={(e) => setFieldValue('partnershipSector', e.target.value)}
              error={Boolean(touched?.partnershipSector && errors?.partnershipSector)}
              disabled={false}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={partnershipRequestLoading} error={touched.documentType && errors.documentType}>
            <TextFieldSelect
              id="documentType"
              label={
                <>
                  Partnership / Agreement Type{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={partnerAgreementTypeData?.values}
              value={values?.documentType}
              onChange={(e) => setFieldValue('documentType', e.target.value)}
              error={Boolean(touched?.documentType && errors?.documentType)}
              disabled={false}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton
            isLoading={partnershipRequestLoading}
            error={touched.partnershipTitle && errors.partnershipTitle}
          >
            <TextField
              id="partnershipTitle"
              variant="standard"
              fullWidth
              {...getFieldProps('partnershipTitle')}
              label={
                <>
                  Partnership Title{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputProps={{ maxLength: 255 }}
              value={values?.partnershipTitle}
              onChange={(e) => setFieldValue('partnershipTitle', e.target.value)}
              error={Boolean(touched?.partnershipTitle && errors?.partnershipTitle)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12}>
          <FieldWithSkeleton isLoading={partnershipRequestLoading}>
            <TextField
              id="partnershipDescription"
              variant="standard"
              fullWidth
              {...getFieldProps('partnershipDescription')}
              label="Partnership Description"
              inputProps={{ maxLength: 255 }}
              value={values?.partnershipDescription}
              onChange={(e) => setFieldValue('partnershipDescription', e.target.value)}
              error={Boolean(touched?.partnershipDescription && errors?.partnershipDescription)}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
      <Typography
        variant="subtitle6"
        component="h4"
        textTransform={'uppercase'}
        color="primary.main"
        sx={{ mb: 2, mt: 3 }}
      >
        Partner's Role and Responsibilities
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton
            isLoading={partnershipRequestLoading}
            error={touched.yearsOfExperience && errors.yearsOfExperience}
          >
            <TextFieldSelect
              id="yearsOfExperience"
              label={
                <>
                  Years of Experience{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={partnerYearOfExpData?.values}
              value={values?.yearsOfExperience}
              onChange={(e) => setFieldValue('yearsOfExperience', e.target.value)}
              error={Boolean(touched?.yearsOfExperience && errors?.yearsOfExperience)}
              disabled={false}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} mb={3}>
          <FieldWithSkeleton isLoading={partnershipRequestLoading}>
            <TextField
              id="describePreviousProjects"
              variant="standard"
              fullWidth
              {...getFieldProps('describePreviousProjects')}
              label="Describe Previous Projects"
              inputProps={{ maxLength: 255 }}
              value={values?.describePreviousProjects}
              onChange={(e) => setFieldValue('describePreviousProjects', e.target.value)}
              error={Boolean(touched?.describePreviousProjects && errors?.describePreviousProjects)}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
      <PreviouslyProject rowData={previouslyProjectData} />
      <Typography
        variant="subtitle6"
        component="h4"
        textTransform={'uppercase'}
        color="primary.main"
        sx={{ pb: 2, mt: 3 }}
      >
        Time Frame and Availability
      </Typography>
      <Grid container spacing={3}>
        <TimeFrame />
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={partnershipRequestLoading}>
            <TextField
              id="describeSpecificAvailability"
              variant="standard"
              fullWidth
              {...getFieldProps('describeSpecificAvailability')}
              label="Describe Specific Availability / Unavailability"
              inputProps={{ maxLength: 255 }}
              value={values?.describeSpecificAvailability}
              onChange={(e) => setFieldValue('describeSpecificAvailability', e.target.value)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12}>
          <FieldWithSkeleton isLoading={partnershipRequestLoading}>
            <TextField
              id="additionalComments"
              variant="standard"
              fullWidth
              {...getFieldProps('additionalComments')}
              label="Additional Comments or Notes"
              inputProps={{ maxLength: 255 }}
              value={values?.additionalComments}
              onChange={(e) => setFieldValue('additionalComments', e.target.value)}
              error={Boolean(touched?.additionalComments && errors?.additionalComments)}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>
      <UploadPartnershipDocuments />
      <ContactDetails />
    </>
  );
}
