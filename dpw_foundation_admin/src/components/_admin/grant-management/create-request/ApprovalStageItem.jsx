// ApprovalStageItem.jsx
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { DeleteIconRed } from 'src/components/icons';
import TextFieldSelect from 'src/components/TextFieldSelect';
import { useApproverOptions } from 'src/hooks/useApproverOptions';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
const ApprovalStageItem = ({ index, stage, type, stageOptions, onDelete, moduleType }) => {
  const { setFieldValue, errors } = useFormikContext();
  const { masterData } = useSelector((state) => state?.common);
  const theme = useTheme();
  const style = CommonStyle(theme);
  const selectedStage = stageOptions?.find((item) => item.code === stage?.stageName);
  const descriptionKey = selectedStage?.description;
  const { data: options = [], isLoading } = useApproverOptions(descriptionKey);

  const isUserStage = stage.initialStage === 0;
  const isEditable = isUserStage || stage.initialStage === 2;

  const defaultStageNameGrant =
    type === 'requestApprovalStages'
      ? getLabelByCode(masterData, 'dpwf_grant_req_approval_stages_view', stage?.stageName)
      : getLabelByCode(masterData, 'dpwf_grant_doc_approval_stages_view', stage?.stageName);

  const defaultStageNamePartnership =
    type === 'requestApprovalStages'
      ? getLabelByCode(masterData, 'dpwf_partner_req_approval_stages_view', stage?.stageName)
      : getLabelByCode(masterData, 'dpwf_partner_doc_approval_stages_view', stage?.stageName);

  const defaultStageNameVolunteer =
    type === 'approvalStages'
      ? getLabelByCode(masterData, 'dpwf_volunteer_req_approval_stages_view', stage?.stageName)
      : getLabelByCode(masterData, 'dpwf_volunteer_req_approval_stages_add', stage?.stageName);

  const defaultStageNameBeneficiary =
    type === 'requestApprovalStages'
      ? getLabelByCode(masterData, 'dpwf_contribution_req_approval_stages_view', stage?.stageName)
      : getLabelByCode(masterData, 'dpwf_contribution_req_approval_stages_add', stage?.stageName);

  const defaultStageName = () => {
    switch (moduleType) {
      case 'grant':
        return defaultStageNameGrant;
      case 'partnership':
        return defaultStageNamePartnership;
      case 'volunteer':
        return defaultStageNameVolunteer;
      case 'beneficiary':
        return defaultStageNameBeneficiary;
    }
  };

  return (
    <Box
      sx={{
        ...style.documentCard
      }}
    >
      {isEditable ? (
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <FieldWithSkeleton isLoading={false} error={!!errors?.[type]?.[index]?.stageName}>
              <TextFieldSelect
                id={`${type}[${index}].stageName`}
                label="Select Approver Team"
                name={`${type}[${index}].stageName`}
                value={stage.stageName}
                itemsData={stageOptions}
                onChange={(e) => {
                  setFieldValue(`${type}[${index}].stageName`, e.target.value);
                  setFieldValue(`${type}[${index}].approverName`, '');
                  setFieldValue(`${type}[${index}].approverId`, '');
                }}
                error={Boolean(errors?.[type]?.[index]?.stageName)}
                helperText={errors?.[type]?.[index]?.stageName}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldWithSkeleton isLoading={false} error={!!errors?.[type]?.[index]?.approverName}>
              <Autocomplete
                options={options?.content || []}
                value={stage?.approverName || ''}
                onChange={(_, newValue) => {
                  setFieldValue(
                    `${type}[${index}].approverName`,
                    newValue ? `${newValue.firstName} ${newValue.lastName}` : ''
                  );
                  setFieldValue(`${type}[${index}].approverId`, newValue?.id || '');
                }}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : `${option.firstName} ${option.lastName}`
                }
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Approver Authority"
                    variant="standard"
                    error={Boolean(errors?.[type]?.[index]?.approverName)}
                    helperText={errors?.[type]?.[index]?.approverName}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading && <CircularProgress color="inherit" size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                renderOption={(props, item) => (
                  <li {...props} key={item.id}>
                    {item.firstName} {item.lastName}
                  </li>
                )}
              />
            </FieldWithSkeleton>
          </Grid>
          <Grid item xs={12} md={4}>
            {isUserStage && (
              <Box sx={style.deleteIcon}>
                <IconButton onClick={onDelete}>
                  <DeleteIconRed color="error" />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Approver Team
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {defaultStageName()}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <Typography variant="body3" color="text.secondary">
                Approver Authority
              </Typography>
              <Typography variant="subtitle4" color="text.secondarydark">
                {stage?.approverName}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ApprovalStageItem;
