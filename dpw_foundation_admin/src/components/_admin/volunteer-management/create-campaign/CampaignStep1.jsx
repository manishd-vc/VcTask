import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import FileUpload from 'src/components/fileUpload';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { handleFileUploadValidation } from 'src/hooks/getDefaultFileValidation';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';
import { getLabelObject } from 'src/utils/extractLabelValues';
import MediaPreview from '../../campaign/steps/emailCampaign/mediaPreview';
import EmailerVolunteers from './EmailerVolunteers';
import EnrolmentDetail from './EnrolmentDetail';
import VolunteerCampaignDetails from './VolunteerCampaignDetails';
import VolunteerCampaignLocation from './VolunteerCampaignLocation';
import VolunteerCriteria from './VolunteerCriteria';
import WaiverDetails from './WaiverDetails';

export default function CampaignStep1() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { masterData } = useSelector((state) => state?.common);
  const { existingCampaignData, volunteerCampaignData } = useSelector((state) => state?.volunteer);
  const volunteerEventTypeData = getLabelObject(masterData, 'dpwf_volunteer_event_type');
  const { values, getFieldProps, errors, touched, setFieldValue, handleBlur } = useFormikContext();

  const { data: campaignsList } = useQuery(['getCampaign', id], api.getCampaignListing, {
    enabled: !!id
  });

  const queryKey = useMemo(
    () => ['defaultBannerVolunteer', id, existingCampaignData?.bannerId],
    [existingCampaignData?.bannerId]
  );
  const queryFn = useCallback(
    () => volunteerApi.defaultBannerVolunteer(id, existingCampaignData?.bannerId),
    [existingCampaignData?.bannerId]
  );
  const { data: defaultBanner } = useQuery(queryKey, queryFn, {
    enabled: !!existingCampaignData?.bannerId && existingCampaignData?.bannerId !== 'undefined',
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes - cache kept for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second between retries
    refetchInterval: false, // Disable automatic refetching
    refetchIntervalInBackground: false // Disable background refetching
  });

  const { mutate, isLoading } = useMutation(
    'uploadCampaignBannerVolunteer',
    volunteerApi.uploadCampaignBannerVolunteer,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        if (response?.data) {
          setFieldValue('coverImageId', response?.data);
        }
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const { mutate: deleteCampaignBannerMutation } = useMutation(
    'deleteCampaignBannerVolunteer',
    volunteerApi.deleteCampaignBannerVolunteer,
    {
      onSuccess: (response) => {
        dispatch(setToastMessage({ message: response?.message, variant: 'success' }));
        setFieldValue('coverImageId', null);
      },
      onError: (error) => {
        dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
      }
    }
  );

  const handleFileUploadChange = (files) => {
    handleFileUploadValidation(files, {
      mutate,
      entityId: id,
      setToastMessage,
      dispatch
    });
  };

  const handleDeleteMedia = () => {
    deleteCampaignBannerMutation(id);
  };

  return (
    <>
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={values.createNewCampaign ? 'true' : 'false'}
                onChange={(e) => {
                  setFieldValue('createNewCampaign', e.target.value === 'true');
                  if (e.target.value === 'true') {
                    setFieldValue('existingCampaignId', '');
                    setFieldValue('volunteerCampaignTitle', '');
                    setFieldValue('startDateTime', null);
                    setFieldValue('endDateTime', null);
                    setFieldValue('volunteerCampaignDescription', '');
                    setFieldValue('country', '');
                    setFieldValue('state', '');
                    setFieldValue('city', '');
                    setFieldValue('coverImageId', null);
                    setFieldValue('addressLineOne', '');
                    setFieldValue('addressLineTwo', '');
                  }
                }}
              >
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Use Existing Campaign/Project"
                  sx={{ mr: 3 }}
                />
                <FormControlLabel value="true" control={<Radio />} label="Create New Volunteer Campaign" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {!values.createNewCampaign && (
            <Grid item xs={12} sm={6}>
              <FieldWithSkeleton isLoading={false} error={touched.existingCampaignId && errors.existingCampaignId}>
                <TextFieldSelect
                  id="existingCampaignId"
                  label={
                    <>
                      Select Campaign/Project{' '}
                      <Box component="span" sx={{ color: 'error.main' }}>
                        *
                      </Box>
                    </>
                  }
                  value={values?.existingCampaignId}
                  getFieldProps={getFieldProps}
                  itemsData={campaignsList?.data?.map((campaign) => ({
                    code: campaign.campaignId,
                    label: campaign.campaignTitle
                  }))}
                  error={Boolean(touched.existingCampaignId && errors.existingCampaignId)}
                />
              </FieldWithSkeleton>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <FieldWithSkeleton isLoading={false} error={touched.eventType && errors.eventType}>
              <TextFieldSelect
                id="eventType"
                label={
                  <>
                    Event Type{' '}
                    <Box component="span" sx={{ color: 'error.main' }}>
                      *
                    </Box>
                  </>
                }
                name={`eventType`}
                value={values?.eventType}
                getFieldProps={getFieldProps}
                onBlur={handleBlur}
                itemsData={volunteerEventTypeData?.values}
                error={Boolean(touched.eventType && errors.eventType)}
              />
            </FieldWithSkeleton>
          </Grid>
        </Grid>
      </Paper>
      <VolunteerCampaignDetails />
      <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
        <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 2 }}>
          Cover Image for volunteer Campaign
        </Typography>
        <Stack alignItems="center" flexDirection="row" gap={2} flexWrap="wrap">
          <FileUpload
            size="small"
            name={'coverImageId'}
            typeOfAllowed="photoAlbumAllowed"
            buttonText={'Attach Thumbnail'}
            onChange={(event) => handleFileUploadChange(Array.from(event.target.files))}
          />
          {isLoading && <Skeleton variant="rectangular" width={120} height={80} />}
          {(values?.coverImageId || defaultBanner?.preSignedUrl) && (
            <Box
              onClick={() => {
                if (
                  values?.coverImageId?.name ||
                  values?.coverImageId?.fileName ||
                  volunteerCampaignData?.coverImageFilename
                ) {
                  setOpen(true);
                }
              }}
              sx={{ cursor: 'pointer', width: '120px', height: '80px', overflow: 'hidden' }}
            >
              <MediaPreview
                src={
                  values?.coverImageId?.preSignedUrl ||
                  defaultBanner?.preSignedUrl ||
                  volunteerCampaignData?.coverImageUrl
                }
                name={values?.coverImageId?.name || defaultBanner?.name || volunteerCampaignData?.coverImageFilename}
                onRemove={handleDeleteMedia}
                width={120}
                height={80}
                layout="intrinsic"
                isCloseIcon={true}
                isOverlay={true}
                style={{ objectFit: 'cover' }}
              />
            </Box>
          )}
        </Stack>
      </Paper>
      <VolunteerCampaignLocation />
      <EnrolmentDetail />
      <VolunteerCriteria />
      <WaiverDetails />
      <EmailerVolunteers />
    </>
  );
}
