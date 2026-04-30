import { Button, Stack } from '@mui/material';
import { useSelector } from 'react-redux';

export default function AssessmentApproval({
  handleClickOpenMoreInfo,
  handleClickOpenReject,
  handleClickOpenApproval,
  type
}) {
  const btnText = () => {
    if (type === 'assessment') {
      return 'Assessment Done & Approve';
    } else if (type === 'hod') {
      return 'Approve & Share with donor';
    } else {
      return 'Approve';
    }
  };
  const { getDonorAdminData } = useSelector((state) => state.donor);

  const disabled =
    type === 'hod' &&
    getDonorAdminData?.donorPledgeResponse?.acceptanceAgreementLetterType === 'AGREEMENT_LETTER' &&
    !getDonorAdminData?.hodAgreementSignUrl;

  return (
    <Stack justifyContent={{ sm: 'space-between', md: 'flex-end' }} flexDirection="row" gap={2} flexWrap="wrap">
      <Button
        variant="contained"
        color="warning"
        onClick={handleClickOpenMoreInfo}
        sx={{ width: { xs: '60%', sm: '28%', md: 'auto' } }}
      >
        Need more info
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleClickOpenReject}
        sx={{ width: { xs: '35%', sm: '20%', md: 'auto' } }}
      >
        Reject
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handleClickOpenApproval}
        sx={{ width: { xs: '100%', sm: '40%', md: 'auto' } }}
        disabled={disabled}
      >
        {btnText()}
      </Button>
    </Stack>
  );
}
