import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import DatePickers from 'src/components/datePicker';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as grantManagementApi from 'src/services/grantManagement';
import { getLabelObject } from 'src/utils/extractLabelValues';
import { getDurationString } from 'src/utils/getDurationString';
import AddDocument from './AddDocument';
import DpWorldInfo from './DpWorldInfo';

export default function GrantStep2() {
  const { id } = useParams();
  const { values, getFieldProps, errors, touched, setFieldValue } = useFormikContext();
  const { grantRequestData, grantRequestLoading } = useSelector((state) => state?.grant);
  const { masterData } = useSelector((state) => state?.common);
  const assistanceTypeData = getLabelObject(masterData, 'dpwf_grant_assistance_required');
  const demographyData = getLabelObject(masterData, 'dpwf_grant_demography');
  const currencyData = getLabelObject(masterData, 'dpw_foundation_currency');

  const { data: documentsList, refetch: refetchDocumentsList } = useQuery(['getGrantDocumentsList', id], () =>
    grantManagementApi.getGrantDocumentsList({ entityId: id }, { enabled: !!id })
  );

  useEffect(() => {
    if (values?.startDate && values?.endDate) {
      const duration = getDurationString(values.startDate, values.endDate);
      setFieldValue('totalDuration', duration);
    }
  }, [values.startDate, values.endDate, setFieldValue]);

  return (
    <>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Grant Request form
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body3" color="text.secondary">
              Request Source
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {grantRequestData?.requestedResource || 'Online'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={grantRequestLoading} error={touched.assistanceType && errors.assistanceType}>
            <TextFieldSelect
              id="assistanceType"
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
              value={values?.assistanceType}
              onChange={(e) => setFieldValue('assistanceType', e.target.value)}
              error={Boolean(touched?.assistanceType && errors?.assistanceType)}
              disabled={false}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={grantRequestLoading} error={touched.amountRequested && errors.amountRequested}>
            <NumericFormat
              label={
                <>
                  Amount Requested{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              error={touched.amountRequested && Boolean(errors.amountRequested)}
              onValueChange={({ floatValue }) => {
                setFieldValue('amountRequested', floatValue ?? '');
              }}
              value={values?.amountRequested}
              customInput={TextField}
              thousandSeparator
              variant="standard"
              valueIsNumericString
              fullWidth
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={grantRequestLoading} error={touched.currency && errors.currency}>
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
              disabled={false}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Amount Granted
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {values?.amountGranted || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <FieldWithSkeleton
            isLoading={grantRequestLoading}
            error={touched.projectBackground && errors.projectBackground}
          >
            <TextField
              id="projectBackground"
              variant="standard"
              fullWidth
              {...getFieldProps('projectBackground')}
              label={
                <>
                  Background or Details of Project for Which Financial Support Is Required{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              inputProps={{ maxLength: 255 }}
              value={values?.projectBackground}
              onChange={(e) => setFieldValue('projectBackground', e.target.value)}
              error={Boolean(touched?.projectBackground && errors?.projectBackground)}
            />
          </FieldWithSkeleton>
        </Grid>
      </Grid>

      <Typography
        variant="subtitle6"
        component="h4"
        textTransform={'uppercase'}
        color="primary.main"
        sx={{ pt: 3, pb: 2 }}
      >
        Proposed length of partnership/charitable donation project
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DatePickers
            label={
              <>
                Start Date{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            inputFormat="yyyy-MM-dd HH:mm"
            handleClear={() => setFieldValue('startDate', null)}
            onChange={(value) => setFieldValue('startDate', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
            value={values.startDate}
            error={touched.startDate && Boolean(errors.startDate)}
            helperText={touched.startDate && errors.startDate}
            type="date"
            maxDate={values.endDate}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePickers
            label={
              <>
                End Date{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </>
            }
            inputFormat="yyyy-MM-dd HH:mm"
            handleClear={() => setFieldValue('endDate', null)}
            onChange={(value) => setFieldValue('endDate', value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
            value={values.endDate}
            error={touched.endDate && Boolean(errors.endDate)}
            helperText={touched.endDate && errors.endDate}
            type="date"
            minDate={values.startDate ? new Date(values.startDate) : new Date()}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Total Duration
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {values?.totalDuration || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldWithSkeleton isLoading={grantRequestLoading} error={touched.demography && errors.demography}>
            <TextFieldSelect
              id="demography"
              label={
                <>
                  Demography{' '}
                  <Box component="span" sx={{ color: 'error.main' }}>
                    *
                  </Box>
                </>
              }
              {...getFieldProps('demography')}
              itemsData={demographyData?.values}
              value={values?.demography}
              onChange={(e) => setFieldValue('demography', e.target.value)}
              error={Boolean(touched?.demography && errors?.demography)}
              disabled={false}
            />
          </FieldWithSkeleton>
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <FormLabel id="receivedSupportBefore-radio-buttons-group-label" sx={{ mb: 1 }}>
              <Typography variant="body3" color="text.secondary">
                Is this grant seeker received any support before ?
              </Typography>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="receivedSupportBefore-radio-buttons-group-label"
              name="receivedSupportBefore"
              value={values?.receivedSupportBefore ? 'true' : 'false'}
              onChange={(e) => setFieldValue('receivedSupportBefore', e.target.value === 'true')}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" sx={{ mr: 3 }} />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {values?.receivedSupportBefore && (
          <Grid item xs={12}>
            <FieldWithSkeleton
              isLoading={grantRequestLoading}
              error={touched.previousSupportDetails && errors.previousSupportDetails}
            >
              <TextField
                id="previousSupportDetails"
                variant="standard"
                fullWidth
                label={
                  <>
                    Details of Previous Support{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                inputProps={{ maxLength: 255 }}
                {...getFieldProps('previousSupportDetails')}
                value={values?.previousSupportDetails}
                onChange={(e) => setFieldValue('previousSupportDetails', e.target.value)}
                error={Boolean(touched?.previousSupportDetails && errors?.previousSupportDetails)}
              />
            </FieldWithSkeleton>
          </Grid>
        )}
      </Grid>
      <AddDocument type="grant" refetch={refetchDocumentsList} documentsList={documentsList} />
      <DpWorldInfo />
    </>
  );
}
