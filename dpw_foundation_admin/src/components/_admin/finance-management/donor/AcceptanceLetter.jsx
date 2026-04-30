import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { DownloadLetterIcon } from 'src/components/icons';
import MediaPreview from '../../campaign/steps/emailCampaign/mediaPreview';

const AcceptanceLetter = ({ mutate, params, isLoading, viewModeOn = true, type }) => {
  const { financeDonationData } = useSelector((state) => state?.finance);

  return (
    <>
      {financeDonationData?.donorPledgeResponse?.acceptanceAgreementLetter && (
        <Paper sx={{ p: 3, my: 3 }}>
          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant="h6" textTransform={'uppercase'} color="text.secondarydark" mb={1}>
              {financeDonationData?.donorPledgeResponse?.donationAmount < 50000
                ? 'Acceptance Letter'
                : 'Agreement Letter'}
            </Typography>
            <Tooltip title="Download Document">
              <IconButton onClick={() => mutate(params.id)} disabled={isLoading}>
                <DownloadLetterIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Paper>
            <Box className="ql-editor" sx={{ p: 3, mt: 1, color: 'text.secondarydark' }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: financeDonationData?.donorPledgeResponse?.acceptanceAgreementLetter
                }}
              ></div>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'} alignItems={'flex-start'}>
              {financeDonationData?.hodAgreementSignUrl && (
                <Stack flexDirection={'column'} rowGap={1} alignItems={'center'} justifyContent={'flex-start'} ml={4}>
                  <Box width={120} height={'auto'}>
                    <MediaPreview
                      src={financeDonationData?.hodAgreementSignUrl}
                      width={120}
                      height={80}
                      layout="intrinsic"
                      isCloseIcon={false}
                    />
                  </Box>
                  {viewModeOn && (
                    <Typography component={'p'} variant="subtitle4" sx={{ px: 3, my: 1 }} color="text.secondarydark">
                      DPW HOD Signature
                    </Typography>
                  )}
                </Stack>
              )}
              {financeDonationData?.userAgreementSignUrl && (
                <Stack flexDirection={'column'} rowGap={1} alignItems={'center'} justifyContent={'center'} mr={4}>
                  <Box width={120} height={'auto'}>
                    <MediaPreview
                      src={financeDonationData?.userAgreementSignUrl}
                      width={120}
                      height={80}
                      layout="intrinsic"
                      isCloseIcon={false}
                    />
                  </Box>
                  {viewModeOn && (
                    <Typography component={'p'} variant="subtitle4" sx={{ mb: 3 }} color="text.secondarydark">
                      Donor Signature
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>
          </Paper>
        </Paper>
      )}
    </>
  );
};

export default AcceptanceLetter;
