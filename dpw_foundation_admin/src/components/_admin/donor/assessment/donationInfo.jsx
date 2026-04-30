import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { downloadFile } from 'src/utils/fileUtils';

const InfoField = ({ label, value }) => (
  <Grid item xs={12} md={4}>
    <Stack>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark">
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);
export default function DonationInfo({ data }) {
  const dispatch = useDispatch();

  const { mutate: downloadMedia } = useMutation('downloadMedia', api.downloadMedia, {
    onSuccess: ({ data, headers }, fileId) => {
      const contentDisposition = headers.get('content-disposition');
      if (contentDisposition) {
        let filename = contentDisposition.split('filename=')[1];
        if (filename.startsWith('"') && filename.endsWith('"')) {
          filename = filename.slice(1, -1);
        }
        downloadFile(data, filename, headers);
      } else {
        downloadFile(data, fileId, headers);
      }
      dispatch(setToastMessage({ message: 'File downloaded successfully!', variant: 'success' }));
    },
    onError: (error) => {
      dispatch(setToastMessage({ message: error.response.data.message, variant: 'error' }));
    }
  });

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Donation Form
      </Typography>
      {/* Grid container to organize each field of the donation form in a responsive layout */}
      <Grid container spacing={3}>
        {/* InfoField components are used to display each field with a label and value */}
        <InfoField label="Gender" value={data?.gender} />
        <InfoField label="Landline Number" value={data?.landlineNumber} />
        <InfoField label="Mobile" value={data?.mobile} />
        <InfoField label="Employed" value={data?.isEmployed ? 'Yes' : 'No'} />

        <InfoField label="Occupation if Employed" value={data?.occupation} />
        {/* <InfoField label="Employer if Employed" value={data?.employer} /> */}
        <InfoField label="National ID Validity" value={data?.nationalIdValidity} />
        <InfoField label="Passport Number" value={data?.passportNo} />
        <InfoField label="Passport Validity" value={data?.passportValidity} />
        <InfoField label="Marital Status" value={data?.maritalStatus} />
        <InfoField label="Spouse / Guardian Name" value={data?.spouseGuardianName} />
        <InfoField label="Spouse/ Guardian Employed ?" value={data?.isSpouseGuardianEmployed} />
        <InfoField label="Nationality" value={data?.nationality} />
        <InfoField label="Current Country of Residence" value={data?.currentCountryOfResidence} />
        <InfoField label="Recidential State/ Provenance" value={data?.state} />
        <InfoField label="Home Status" value={data?.homeStatus} />
        {/* Custom layout for the home address and assistance requested, using full-width grid item (md={8}) */}
        <Grid item xs={12} md={8}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Home Address
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.homeAddress || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Assistance Requested
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {data?.assistanceRequested || '-'}
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <Typography variant="h6" textTransform={'uppercase'} color="text.black" sx={{ pb: 3 }}>
        Attachments
      </Typography>
      {data?.passportAttachments?.map((file, index) => (
        <Box key={file?.id}>
          <Typography component="span" variant="body2" color="text.blue">
            <Box
              component="span"
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => downloadMedia(file?.id)}
            >
              {file?.fileName}
            </Box>
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

DonationInfo.propTypes = {
  data: PropTypes.shape({
    gender: PropTypes.string,
    landlineNumber: PropTypes.string,
    mobile: PropTypes.string,
    isEmployed: PropTypes.bool,
    occupation: PropTypes.string,
    // employer: PropTypes.string,
    nationalIdValidity: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    passportNo: PropTypes.string,
    passportValidity: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    maritalStatus: PropTypes.string,
    spouseGuardianName: PropTypes.string,
    isSpouseGuardianEmployed: PropTypes.bool,
    nationality: PropTypes.string,
    currentCountryOfResidence: PropTypes.string,
    state: PropTypes.string,
    homeStatus: PropTypes.string,
    homeAddress: PropTypes.string,
    assistanceRequested: PropTypes.string
  }).isRequired
};
