import { Button, Stack } from '@mui/material';

const ReportActions = ({
  edit,
  handleReset,
  handleApplyFilter,
  selectedModule,
  saveConfigMutation,
  handleSaveConfiguration,
  queryMutation
}) => {
  return (
    <>
      <Stack justifyContent="flex-end" flexDirection="row" gap={1}>
        {!edit ? (
          <Button variant="outlined" color="error" size="small" onClick={handleReset}>
            Reset
          </Button>
        ) : (
          ''
        )}
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleSaveConfiguration}
          disabled={!selectedModule || saveConfigMutation.isLoading}
        >
          {saveConfigMutation.isLoading ? 'Saving...' : 'Save Report Configuration'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleApplyFilter}
          disabled={queryMutation.isLoading || !selectedModule}
        >
          {queryMutation.isLoading ? 'Loading...' : 'Run Report'}
        </Button>
      </Stack>
    </>
  );
};

export default ReportActions;
