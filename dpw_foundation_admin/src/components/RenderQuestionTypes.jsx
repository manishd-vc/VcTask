import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import DatePickers from './datePicker';
import FileUpload from './fileUpload';
import { DeleteIconRed } from './icons';

export default function RenderQuestionTypes({
  question: q,
  formik,
  handleUploadFile,
  handleDeleteFile,
  uploadingFiles
}) {
  switch (q.questionType.toUpperCase()) {
    case 'CHECKBOX':
      return (
        <FormControl component="fieldset" error={Boolean(formik.touched[q.id] && formik.errors[q.id])}>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
            {q.options.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    value={option.optionText}
                    checked={formik.values[q.id]?.includes(option.optionText)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      const current = formik.values[q.id] || [];
                      formik.setFieldValue(q.id, checked ? [...current, value] : current.filter((v) => v !== value));
                    }}
                    sx={{
                      color: Boolean(formik.touched[q.id] && formik.errors[q.id]) ? 'error.main' : undefined,
                      '&.Mui-checked': {
                        color: Boolean(formik.touched[q.id] && formik.errors[q.id]) ? 'error.main' : 'primary.main'
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondarydark">
                    {option.optionText}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
          <FormHelperText sx={{ color: 'error.main' }}>{formik.touched[q.id] && formik.errors[q.id]}</FormHelperText>
        </FormControl>
      );
    case 'RADIO':
      return (
        <FormControl component="fieldset" error={Boolean(formik.touched[q.id] && formik.errors[q.id])}>
          <RadioGroup name={q.id} value={formik.values[q.id]} onChange={formik.handleChange} row>
            {q.options.length > 0
              ? q.options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.optionText}
                    control={
                      <Radio
                        sx={{
                          color: Boolean(formik.touched[q.id] && formik.errors[q.id]) ? 'error.main' : undefined,
                          '&.Mui-checked': {
                            color: Boolean(formik.touched[q.id] && formik.errors[q.id]) ? 'error.main' : 'primary.main'
                          },
                          mr: 2
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondarydark" sx={{ mr: 3 }}>
                        {option.optionText}
                      </Typography>
                    }
                  />
                ))
              : ['Yes', 'No'].map((option) => (
                  <FormControlLabel key={option} value={option} control={<Radio />} label={option} sx={{ mr: 3 }} />
                ))}
          </RadioGroup>
          <FormHelperText>{formik.touched[q.id] && formik.errors[q.id]}</FormHelperText>
        </FormControl>
      );
    case 'FREETEXT':
    case 'TEXTAREA':
      return (
        <TextField
          fullWidth
          variant="standard"
          name={q.id}
          value={formik.values[q.id]}
          onChange={formik.handleChange}
          label="Enter Your Answer"
          error={Boolean(formik.touched[q.id] && formik.errors[q.id])}
          helperText={formik.touched[q.id] && formik.errors[q.id]}
        />
      );
    case 'FILE':
      return (
        <Box sx={{ display: 'inline-flex', gap: 2 }}>
          <FileUpload
            name={'file'}
            buttonText={'Upload File'}
            onChange={(event) => {
              const file = event.target.files[0];
              formik.setFieldValue(q.id, file);
              handleUploadFile(file, q.id);
            }}
            disabled={uploadingFiles?.has(q.id) || false}
            size="small"
            sx={{ display: 'inline-block' }}
          />
          {(q?.responseFileName || formik.values[q.id]?.fileName) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondarydark">
                {q?.responseFileName || formik.values[q.id]?.fileName}
              </Typography>
              {(q?.responseFileName || formik.values[q.id]) && (
                <IconButton onClick={() => handleDeleteFile(q?.response || formik.values[q.id]?.id, q.id)}>
                  <DeleteIconRed />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      );
    case 'DATE':
      return (
        <DatePickers
          label={
            <>
              Select Date{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </>
          }
          inputFormat="yyyy-MM-dd HH:mm"
          handleClear={() => {
            formik.setFieldValue(q.id, null);
          }}
          onChange={(value) => formik.setFieldValue(q.id, value ? format(value, "yyyy-MM-dd'T'HH:mm:ss") : null)}
          value={formik.values[q.id]}
          error={Boolean(formik.touched[q.id] && formik.errors[q.id])}
          helperText={formik.touched[q.id] && formik.errors[q.id]}
          type="date"
        />
      );
    default:
      return null;
  }
}
