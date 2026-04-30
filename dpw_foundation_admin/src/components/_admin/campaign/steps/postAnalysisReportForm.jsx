'use client';
import { Button, Divider, Grid, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import ReusableTable from 'src/components/table/ReusableTable';
import { fDateWithLocale } from 'src/utils/formatTime';
import { getNumberColor } from 'src/utils/getNumberColor';
import Export from './export';
import QuestionForm from './questionForm';

PostAnalysisReportForm.propTypes = {
  // 'isLoading' is a boolean indicating whether data is loading
  isLoading: PropTypes.bool.isRequired,

  // 'modalTitle' is a string for the title of the modal (defaults to 'Prepare Questions')
  modalTitle: PropTypes.string,
  campaignUpdateData: PropTypes.object.isRequired,
  isSuperior: PropTypes.bool.isRequired
};

const tableHeaders = [
  { label: 'Questions', key: 'questions' },
  { label: 'Target Unit', key: 'targetUnit' },
  { label: 'Target Value', key: 'targetValue' },
  { label: 'Achieved Value', key: 'achievedValue' },
  { label: 'Variance', key: 'variance' },
  { label: 'Success Rate', key: 'successRate' }
];

export default function PostAnalysisReportForm({
  isView,
  isLoading,
  modalTitle = 'Prepare Questions',
  campaignUpdateData,
  isSuperior,
  rowData,
  modalType
}) {
  const { values, setFieldValue, handleChange, handleBlur, touched, errors } = useFormikContext(); // Formik hooks for form management.
  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              {modalType === 'campaign' ? 'Campaign' : 'Project'} Report Analysis ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.analysisReportId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              {modalType === 'campaign' ? 'Campaign' : 'Project'} ID
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.campaignNumbericId || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Analysis Report Title
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              Analysis report for - {campaignUpdateData?.reportTitle || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Target Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(campaignUpdateData?.projectEndDate && fDateWithLocale(campaignUpdateData?.projectEndDate)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              End Date
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {(campaignUpdateData?.projectEndDate && fDateWithLocale(campaignUpdateData?.projectEndDate)) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              Assign To
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.supervisorName || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack>
            <Typography variant="body3" color="text.secondary">
              {modalType === 'campaign' ? 'Campaign' : 'Project'} Post Analysis Status
            </Typography>
            <Typography variant="subtitle4" color="text.secondarydark">
              {campaignUpdateData?.analysisStatus?.toLowerCase()?.replace(/^\w/, (c) => c.toUpperCase()) || '-'}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={12}>
          <Divider sx={{ mt: 3, mb: 2 }} />
        </Grid>
      </Grid>
      {rowData?.analysisReportStatus === 'COMPLETED' && isView ? (
        <>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" textTransform={'uppercase'} color="primary.main" sx={{ py: 3 }} component="p">
                All Questions ({campaignUpdateData?.postAnalysisQues?.length})
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ py: 2, textAlign: 'right' }}>
              <Export id={campaignUpdateData?.entityId} type={'POST_ANALYSIS'} />
            </Grid>
          </Grid>
          <ReusableTable headers={tableHeaders}>
            {campaignUpdateData?.postAnalysisQues?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.questionText || '-'}</TableCell> {/* Risk Code */}
                <TableCell>{item?.targetUnit || '-'}</TableCell>
                <TableCell>{item?.targetValue || '-'}</TableCell>
                <TableCell>{item?.achieveValue || '-'}</TableCell>
                <TableCell sx={{ color: getNumberColor(item?.variance) }}>{item?.variance || '-'}</TableCell>
                <TableCell sx={{ color: getNumberColor(item?.variance) }}>
                  {item?.rateDifference + '%' || '-'}
                </TableCell>
              </TableRow>
            ))}
          </ReusableTable>
        </>
      ) : (
        <>
          <Stack alignItems="center" direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={3}>
            <Typography variant="subtitle3" color="primary.main" textTransform="uppercase">
              {modalTitle}
            </Typography>
            {!isSuperior && (
              <Button
                variant="contained"
                onClick={() =>
                  setFieldValue('questions', [
                    ...values.questions,
                    {
                      targetUnit: '',
                      questionText: '',
                      targetValue: ''
                    }
                  ])
                }
                sx={{ width: '250px' }}
              >
                Add More Questions
              </Button>
            )}
          </Stack>
          <FieldArray name="questions">
            {({ remove }) => (
              <QuestionForm
                values={values}
                touched={touched}
                errors={errors}
                isLoading={isLoading}
                handleBlur={handleBlur}
                handleChange={handleChange}
                remove={remove}
                isSuperior={isSuperior}
              />
            )}
          </FieldArray>
        </>
      )}
    </>
  );
}
