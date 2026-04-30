import { Grid, Paper } from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from 'react-query';
import TextFieldSelect from 'src/components/TextFieldSelect';
import * as api from 'src/services';
import { onSpotDonationOBJ } from 'src/utils/onSpotUtils';
const FieldWithSkeleton = React.lazy(() => import('src/components/FieldWithSkeleton'));

const UserFormComponent = ({ showHiddenForm, isExistingUser, isEdit, formFieldReadOnly, donationTypeData }) => {
  const { errors, getFieldProps, touched, values } = useFormikContext();

  const enableFormField = (field) => {
    return (isExistingUser && formFieldReadOnly?.[field]) || isEdit;
  };

  const { data: campaignsList } = useQuery(['getCampaign', values?.donationType], () => api.getCampaignListing(), {
    enabled: values?.donationType === onSpotDonationOBJ.eventSpecific, // Only fetch if state is selected
    refetchOnWindowFocus: false // Avoid refetching on window focus
  });

  const campaignData =
    campaignsList?.data?.map((campaign) => ({
      code: campaign.campaignId,
      label: campaign.campaignTitle
    })) || [];

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Grid container spacing={3}>
        {/* Hidden Form Fields */}
        {showHiddenForm && (
          <Grid container item spacing={3}>
            {/* <Grid item xs={12} md={4}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="body3" color="text.secondary">
                  Registered As
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {values?.accountType || '-'}
                </Typography>
              </Stack>
            </Grid> */}
            <Grid item xs={12} md={6}>
              <FieldWithSkeleton error={touched.donationType && errors.donationType}>
                <TextFieldSelect
                  id="donationType"
                  label="Select Donation Type"
                  getFieldProps={getFieldProps}
                  itemsData={donationTypeData?.values}
                  value={values?.donationType}
                  required
                  InputProps={{ readOnly: enableFormField() }}
                  error={Boolean(touched.donationType && errors.donationType)}
                />
              </FieldWithSkeleton>
            </Grid>
            {values?.donationType === onSpotDonationOBJ.eventSpecific && (
              <Grid item xs={12} md={6}>
                <FieldWithSkeleton error={touched.campaignId && errors.campaignId}>
                  <TextFieldSelect
                    id="campaignId"
                    label="Select Campaign/ Project"
                    getFieldProps={getFieldProps}
                    itemsData={campaignData}
                    value={values?.campaignId}
                    required
                    InputProps={{ readOnly: enableFormField() }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 200, // Limit the dropdown height (adjust as needed)
                            overflowY: 'auto' // Enable vertical scrolling
                          }
                        }
                      }
                    }}
                  />
                </FieldWithSkeleton>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

UserFormComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  showHiddenForm: PropTypes.bool.isRequired,
  setShowHiddenForm: PropTypes.func.isRequired,
  isExistingUser: PropTypes.bool.isRequired,
  setIsExistingUser: PropTypes.func.isRequired,
  setUserDetail: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  formFieldReadOnly: PropTypes.object,
  donationTypeData: PropTypes.array,
  setFormFieldReadOnly: PropTypes.func,
  registeredAs: PropTypes.array,
  setFileDetail: PropTypes.func
};

export default UserFormComponent;
