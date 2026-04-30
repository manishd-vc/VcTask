import {
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { BackArrow, NextArrow } from 'src/components/icons';
const ListHeader = ({ title }) => (
  <>
    <Typography variant="subtitle1" sx={{ p: 1, color: 'secondary.darker' }}>
      {title}
    </Typography>
  </>
);

const SelectField = ({ moduleFields }) => {
  const { values, setFieldValue } = useFormikContext();
  const { selectedResultFields } = values;
  const theme = useTheme();
  const [availableSearch, setAvailableSearch] = useState('');
  const [selectedSearch, setSelectedSearch] = useState('');

  const filteredAvailableFields = moduleFields
    .filter((field) => !selectedResultFields.includes(field.backendColumn))
    .filter((field) => field.displayLabel.toLowerCase().includes(availableSearch.toLowerCase()));

  const filteredSelectedFields = [...new Set(selectedResultFields)]
    .map((fieldCode) => moduleFields.find((f) => f.backendColumn === fieldCode))
    .filter((field) => field && field.displayLabel.toLowerCase().includes(selectedSearch.toLowerCase()));

  return (
    <Grid item xs={12} mb={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mt: -2 }}>
          <Divider />
        </Grid>
        <Grid item xs={5}>
          {/* <ListHeader title={'Available Fields'} /> */}
          <TextField
            size="small"
            type="search"
            label="Search Available Fields"
            value={availableSearch}
            onChange={(e) => setAvailableSearch(e.target.value)}
            variant="outlined"
            sx={{ width: '100%' }}
          />
          <Paper
            sx={{ height: 200, overflow: 'auto', border: `1px solid ${theme.palette.grey[500_32]}`, borderTop: 'none' }}
          >
            <List dense sx={{ p: 0 }}>
              {filteredAvailableFields.map((field) => (
                <ListItem
                  key={field.id}
                  disablePadding
                  sx={{
                    p: 0,
                    boxShadow: 'none',
                    '&::after': { display: 'none' },
                    minHeight: '40px'
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      const newFields = selectedResultFields.includes(field.backendColumn)
                        ? selectedResultFields
                        : [...selectedResultFields, field.backendColumn];
                      setFieldValue('selectedResultFields', newFields);
                    }}
                    sx={{
                      py: 0.5,
                      px: 1,
                      border: 'none',
                      borderBottom: 'none',
                      minHeight: '40px',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <ListItemText
                      primary={field.displayLabel}
                      sx={{ m: 0, '& .MuiListItemText-primary': { color: 'secondary.darker' } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <IconButton
            onClick={() => {
              const allFields = [...new Set(moduleFields.map((f) => f.backendColumn))];
              setFieldValue('selectedResultFields', allFields);
            }}
          >
            <NextArrow />
          </IconButton>
          <IconButton
            onClick={() => {
              setFieldValue('selectedResultFields', []);
            }}
          >
            <BackArrow />
          </IconButton>
        </Grid>
        <Grid item xs={5}>
          {/* <ListHeader title={'Selected Fields'} /> */}
          <TextField
            label="Search Selected Fields"
            size="small"
            type="search"
            value={selectedSearch}
            onChange={(e) => setSelectedSearch(e.target.value)}
            variant="outlined"
            sx={{ width: '100%' }}
          />
          <Paper
            sx={{ height: 200, overflow: 'auto', border: `1px solid ${theme.palette.grey[500_32]}`, borderTop: 'none' }}
          >
            <List dense sx={{ p: 0 }}>
              {filteredSelectedFields.map((field) => {
                return (
                  <ListItem
                    key={field.backendColumn}
                    disablePadding
                    sx={{
                      p: 0,
                      boxShadow: 'none',
                      '&::after': { display: 'none' },
                      minHeight: '40px'
                    }}
                  >
                    <ListItemButton
                      onClick={() => {
                        const newFields = selectedResultFields.filter((f) => f !== field.backendColumn);
                        setFieldValue('selectedResultFields', newFields);
                      }}
                      sx={{
                        py: 0.5,
                        px: 1,
                        border: 'none',
                        borderBottom: 'none',
                        minHeight: '40px',
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                    >
                      <ListItemText
                        primary={field.displayLabel}
                        sx={{ m: 0, '& .MuiListItemText-primary': { color: 'secondary.darker' } }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectField;
