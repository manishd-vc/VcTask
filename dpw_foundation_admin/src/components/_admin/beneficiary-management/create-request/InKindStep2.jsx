import { Box, Grid, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { useParams } from 'next/navigation';
import { NumericFormat } from 'react-number-format';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getLabelObject } from 'src/utils/extractLabelValues';
import AddDocument from '../../grant-management/create-request/addDocument';
import DpWorldInfo from '../../grant-management/create-request/DpWorldInfo';
import AddInKindContribution from './AddInKindContribution';

export default function InKindStep2() {
  const { id } = useParams();
  const { masterData } = useSelector((state) => state?.common);
  const { inKindContributionRequestLoading } = useSelector((state) => state?.beneficiary);
  const { values, getFieldProps, errors, touched, setFieldValue } = useFormikContext();
  const requestSourceData = getLabelObject(masterData, 'dpwf_contribution_req_source');
  const currencyData = getLabelObject(masterData, 'dpw_foundation_currency');
  const assistanceTypeData = getLabelObject(masterData, 'dpwf_contribution_assistance_requested');
  const requestNatureData = getLabelObject(masterData, 'dpwf_contribution_req_nature');
  const frequencyData = getLabelObject(masterData, 'dpwf_contribution_frequency');

  const { data: documentsList, refetch: refetchDocumentsList } = useQuery(['getGrantDocumentsList', id], () =>
    beneficiaryApi.getInKindBeneficiaryDocumentsList({ entityId: id }, { enabled: !!id })
  );

  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        In kind contribution request form
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton
            isLoading={inKindContributionRequestLoading}
            error={touched.requestResource && errors.requestResource}
          >
            <TextFieldSelect
              id="requestResource"
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
              value={values?.requestResource}
              onChange={(e) => setFieldValue('requestResource', e.target.value)}
              error={Boolean(touched?.requestResource && errors?.requestResource)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton isLoading={inKindContributionRequestLoading} error={touched.currency && errors.currency}>
            <TextFieldSelect
              id="currency"
              label={
                <>
                  Currency{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={currencyData?.values}
              value={values?.currency}
              onChange={(e) => setFieldValue('currency', e.target.value)}
              error={Boolean(touched?.currency && errors?.currency)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton
            isLoading={inKindContributionRequestLoading}
            error={touched.assistanceRequested && errors.assistanceRequested}
          >
            <TextFieldSelect
              id="assistanceRequested"
              label={
                <>
                  Type of Assistance Required{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={assistanceTypeData?.values}
              value={values?.assistanceRequested}
              onChange={(e) => setFieldValue('assistanceRequested', e.target.value)}
              error={Boolean(touched?.assistanceRequested && errors?.assistanceRequested)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton
            isLoading={inKindContributionRequestLoading}
            error={touched.requestTitle && errors.requestTitle}
          >
            <TextField
              id="requestTitle"
              variant="standard"
              fullWidth
              {...getFieldProps('requestTitle')}
              label={
                <>
                  Request Title{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputProps={{ maxLength: 255 }}
              value={values?.requestTitle}
              onChange={(e) => setFieldValue('requestTitle', e.target.value)}
              error={Boolean(touched?.requestTitle && errors?.requestTitle)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton
            isLoading={inKindContributionRequestLoading}
            error={touched.requestDescription && errors.requestDescription}
          >
            <TextField
              id="requestDescription"
              variant="standard"
              fullWidth
              {...getFieldProps('requestDescription')}
              label={
                <>
                  Request Description{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputProps={{ maxLength: 255 }}
              value={values?.requestDescription}
              onChange={(e) => setFieldValue('requestDescription', e.target.value)}
              error={Boolean(touched?.requestDescription && errors?.requestDescription)}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FieldWithSkeleton
            isLoading={inKindContributionRequestLoading}
            error={touched.requestNature && errors.requestNature}
          >
            <TextFieldSelect
              id="requestNature"
              label={
                <>
                  Request Nature{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              getFieldProps={getFieldProps}
              itemsData={requestNatureData?.values}
              value={values?.requestNature}
              onChange={(e) => setFieldValue('requestNature', e.target.value)}
              error={Boolean(touched?.requestNature && errors?.requestNature)}
            />
          </FieldWithSkeleton>
        </Grid>
        {(values?.assistanceRequested === 'inkind' || values?.assistanceRequested === 'mixed') && (
          <Grid item xs={12} sm={4}>
            <FieldWithSkeleton
              isLoading={inKindContributionRequestLoading}
              error={touched.estimatedValueInkind && errors.estimatedValueInkind}
            >
              <NumericFormat
                label={
                  <>
                    Estimated Value of In-Kind{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                error={touched.estimatedValueInkind && Boolean(errors.estimatedValueInkind)}
                onValueChange={({ floatValue }) => {
                  setFieldValue('estimatedValueInkind', floatValue ?? '');
                }}
                value={values?.estimatedValueInkind}
                customInput={TextField}
                thousandSeparator
                variant="standard"
                valueIsNumericString
                fullWidth
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        {values?.assistanceRequested === 'mixed' && (
          <Grid item xs={12} sm={4}>
            <FieldWithSkeleton
              isLoading={inKindContributionRequestLoading}
              error={touched.estimatedValueDonation && errors.estimatedValueDonation}
            >
              <NumericFormat
                label={
                  <>
                    Estimated Value of Donation{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                error={touched.estimatedValueDonation && Boolean(errors.estimatedValueDonation)}
                onValueChange={({ floatValue }) => {
                  setFieldValue('estimatedValueDonation', floatValue ?? '');
                }}
                value={values?.estimatedValueDonation}
                customInput={TextField}
                thousandSeparator
                variant="standard"
                valueIsNumericString
                fullWidth
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        {values?.requestNature === 'one-off' && (
          <Grid item xs={12} sm={4}>
            <FieldWithSkeleton
              isLoading={inKindContributionRequestLoading}
              error={touched.expectedDateContribution && errors.expectedDateContribution}
            >
              <DatePickers
                label={
                  <>
                    Expected Date of Contribution{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputFormat="yyyy-MM-dd HH:mm"
                handleClear={() => setFieldValue('expectedDateContribution', null)}
                onChange={(value) =>
                  setFieldValue('expectedDateContribution', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)
                }
                value={values.expectedDateContribution}
                error={touched.expectedDateContribution && Boolean(errors.expectedDateContribution)}
                type="date"
              />
            </FieldWithSkeleton>
          </Grid>
        )}
        {(values?.requestNature === 'recurring' || values?.requestNature === 'fixed-period') && (
          <>
            <Grid item xs={12} sm={4}>
              <FieldWithSkeleton error={touched.periodFrom && errors.periodFrom}>
                <DatePickers
                  label={
                    <>
                      Period From{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  inputFormat="yyyy-MM-dd HH:mm"
                  handleClear={() => setFieldValue('periodFrom', null)}
                  onChange={(value) =>
                    setFieldValue('periodFrom', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)
                  }
                  value={values.periodFrom}
                  error={touched.periodFrom && Boolean(errors.periodFrom)}
                  type="date"
                  maxDate={values.periodTo}
                />
              </FieldWithSkeleton>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FieldWithSkeleton error={touched.periodTo && errors.periodTo}>
                <DatePickers
                  label={
                    <>
                      Period To{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  inputFormat="yyyy-MM-dd HH:mm"
                  handleClear={() => setFieldValue('periodTo', null)}
                  onChange={(value) => setFieldValue('periodTo', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
                  value={values.periodTo}
                  error={touched.periodTo && Boolean(errors.periodTo)}
                  type="date"
                  minDate={values.periodFrom}
                  disabled={!values.periodFrom}
                />
              </FieldWithSkeleton>
            </Grid>
            {values?.requestNature !== 'fixed-period' && (
              <Grid item xs={12} sm={4}>
                <FieldWithSkeleton isLoading={inKindContributionRequestLoading}>
                  <TextFieldSelect
                    id="frequency"
                    label="Frequency"
                    getFieldProps={getFieldProps}
                    itemsData={frequencyData?.values}
                    value={values?.frequency}
                    onChange={(e) => setFieldValue('frequency', e.target.value)}
                  />
                </FieldWithSkeleton>
              </Grid>
            )}
          </>
        )}
      </Grid>
      <AddInKindContribution />
      <AddDocument type="beneficiary" refetch={refetchDocumentsList} documentsList={documentsList} />
      <DpWorldInfo />
    </>
  );
}
