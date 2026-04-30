'use client';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import * as volunteerApi from 'src/services/volunteer';

Export.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  isVolunteer: PropTypes.bool
};

export default function Export({ id, type, isVolunteer = false }) {
  const dispatch = useDispatch();
  const exportFunction = isVolunteer ? volunteerApi.exportVolunteerCampaignDataAdmin : api.exportCampaignDataAdmin;

  const { mutate, isLoading } = useMutation(`export-${type}`, exportFunction, {
    onSuccess: (data) => {
      dispatch(setToastMessage({ message: data.message, variant: 'success' }));
    },
    onError: (err) => {
      dispatch(setToastMessage({ message: err.response.data.message, variant: 'error' }));
    }
  });

  const onExport = () => {
    const obj = {
      campaignId: id,
      fieldName: type
    };
    mutate(obj);
  };
  return (
    <LoadingButton
      variant="outlinedWhite"
      size="small"
      onClick={onExport}
      loading={isLoading}
      sx={{
        width: { xs: '20%', sm: 'auto' }
      }}
    >
      Export
    </LoadingButton>
  );
}
