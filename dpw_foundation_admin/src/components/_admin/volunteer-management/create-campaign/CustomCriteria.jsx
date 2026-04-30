import { Box, Button, Grid, IconButton, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import CommonStyle from 'src/components/common.styles';
import FieldWithSkeleton from 'src/components/FieldWithSkeleton';
import { DeleteIconRed } from 'src/components/icons';

export default function CustomCriteria() {
  const { values, setFieldValue, handleBlur, handleChange, touched, errors } = useFormikContext();
  const theme = useTheme();
  const style = CommonStyle(theme);
  return (
    <>
      <Stack
        gap={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ pt: 2 }}
      >
        <Typography variant="subtitle4" color="text.black">
          Add Custom Criteria
        </Typography>

        <Button
          size="small"
          variant="contained"
          onClick={() =>
            setFieldValue('customCriteria', [
              ...values.customCriteria,
              {
                order: 'criteria' + values.customCriteria.length + 1,
                criteria: '',
                criteriaRequirement: ''
              }
            ])
          }
        >
          Add Criteria
        </Button>
      </Stack>

      <FieldArray name="customCriteria">
        {({ remove }) => (
          <>
            {values.customCriteria?.map((criteria, index) => (
              <Box
                key={criteria?.order}
                sx={{
                  ...style.documentCard
                }}
              >
                <Box sx={style.deleteIcon}>
                  <Tooltip title="Remove" arrow>
                    <IconButton aria-label="delete" onClick={() => remove(index)}>
                      <DeleteIconRed />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FieldWithSkeleton
                      isLoading={false}
                      error={touched.customCriteria?.[index]?.criteria && errors.customCriteria?.[index]?.criteria}
                    >
                      <TextField
                        variant="standard"
                        fullWidth
                        label={<>Criteria </>}
                        name={`customCriteria[${index}].criteria`}
                        value={values.customCriteria[index].criteria}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.customCriteria?.[index]?.criteria && errors.customCriteria?.[index]?.criteria}
                      />
                    </FieldWithSkeleton>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <FieldWithSkeleton
                      isLoading={false}
                      error={
                        touched.customCriteria?.[index]?.criteriaRequirement &&
                        errors.customCriteria?.[index]?.criteriaRequirement
                      }
                    >
                      <TextField
                        variant="standard"
                        fullWidth
                        label={<>Criteria Requirement </>}
                        name={`customCriteria[${index}].criteriaRequirement`}
                        value={values.customCriteria[index].criteriaRequirement}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.customCriteria?.[index]?.criteriaRequirement &&
                          errors.customCriteria?.[index]?.criteriaRequirement
                        }
                      />
                    </FieldWithSkeleton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </>
        )}
      </FieldArray>
    </>
  );
}
