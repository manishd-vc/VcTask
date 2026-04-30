'use client';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';

/**
 * ViewLoginDetails component
 *
 * Displays details about the campaign record, including campaign status,
 * created by, created on, updated by, and updated on. Each field is displayed in a grid layout.
 *
 * @component
 * @example
 * return <ViewLoginDetails />;
 */
export default function ViewLoginDetails() {
  // Access campaign update data and master data from the Redux store
  const { campaignUpdateData } = useSelector((state) => state?.campaign);
  const { masterData } = useSelector((state) => state?.common);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        {/* Campaign Status */}
        <Grid item xs={12} sm={6} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Campaign Status
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {/* Get campaign status label from master data */}
              {getLabelByCode(masterData, 'dpw_foundation_campaign_status', campaignUpdateData?.status) ||
                campaignUpdateData?.status}
            </Typography>
          </Stack>
        </Grid>

        {/* Record Created By */}
        <Grid item xs={12} sm={6} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Record Created By
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark" textTransform="capitalize">
              {campaignUpdateData?.createdByName} {/* Display creator's name */}
            </Typography>
          </Stack>
        </Grid>

        {/* Record Created On */}
        <Grid item xs={12} sm={6} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Record Created On
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {/* Format and display creation date */}
              {campaignUpdateData?.createdOn && fDateWithLocale(campaignUpdateData?.createdOn)}
            </Typography>
          </Stack>
        </Grid>

        {/* Record Updated By */}
        <Grid item xs={12} sm={6} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Record Updated By
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.updatedByName} {/* Display updater's name */}
            </Typography>
          </Stack>
        </Grid>

        {/* Record Updated On */}
        <Grid item xs={12} sm={6} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Record Updated On
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {/* Format and display update date */}
              {campaignUpdateData?.updatedOn && fDateWithLocale(campaignUpdateData?.updatedOn)}
            </Typography>
          </Stack>
        </Grid>
        {campaignUpdateData?.status !== 'NEED_MORE_INFO' &&
          campaignUpdateData?.status !== 'PENDING_APPROVAL' &&
          (campaignUpdateData?.iacadRequired ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Stack>
                  <Typography variant="body3" color="text.secondary">
                    {campaignUpdateData?.iacadPermitId ? 'Permit ID' : 'Request ID'}
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.iacadPermitId
                      ? campaignUpdateData?.iacadPermitId
                      : campaignUpdateData?.iacadRequestId || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Stack>
                  <Typography variant="body3" color="text.secondary">
                    Response Date
                  </Typography>
                  <Typography variant="subtitle4" color="text.secondarydark">
                    {campaignUpdateData?.iaCadResponseDate
                      ? fDateWithLocale(campaignUpdateData?.iaCadResponseDate)
                      : '-'}
                  </Typography>
                </Stack>
              </Grid>
            </>
          ) : (
            <Grid item xs={12} sm={6} md={9}>
              <Stack>
                <Typography variant="body3" color="text.secondary">
                  Justification - if IACAD approval is not required
                </Typography>
                <Typography variant="subtitle4" color="text.secondarydark">
                  {campaignUpdateData?.notes || '-'}
                </Typography>
              </Stack>
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
}
