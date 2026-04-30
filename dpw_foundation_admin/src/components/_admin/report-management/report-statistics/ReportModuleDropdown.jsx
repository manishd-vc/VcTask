import { Autocomplete, TextField } from '@mui/material';

const ReportModuleDropdown = ({ loading, modules, selectedModule, setSelectedModule }) => {
  return (
    <>
      <Autocomplete
        options={modules?.map((module) => ({ value: module?.id, label: module?.name })) || []}
        value={
          selectedModule
            ? modules
                ?.map((module) => ({ value: module?.id, label: module?.name }))
                ?.find((option) => option.value === selectedModule) || null
            : null
        }
        onChange={(event, newValue) => {
          setSelectedModule(newValue?.value || '');
        }}
        getOptionLabel={(option) => option?.label || ''}
        isOptionEqualToValue={(option, value) => {
          if (!option || !value) return false;
          return option.value === value.value;
        }}
        disabled={loading}
        renderInput={(params) => (
          <TextField {...params} label="Select Module" variant="standard" sx={{ padding: '7px 4px 7px 0px' }} />
        )}
      />
    </>
  );
};

export default ReportModuleDropdown;
