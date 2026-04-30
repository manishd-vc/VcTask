import { Box, Button, Grid, Link, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import CommonStyle from 'src/components/common.styles';
import InKindContributionViewDetailsModal from 'src/components/dialog/InKindContributionViewDetailsModal';
import * as beneficiaryApi from 'src/services/beneficiary';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateWithLocale } from 'src/utils/formatTime';
import AssessmentQuestionsModal from './assessment-questions-modal';

const FieldDisplay = ({ label, value, textTransform, gridProps = { xs: 12, sm: 6 } }) => (
  <Grid item {...gridProps}>
    <Stack spacing={0.5}>
      <Typography variant="body3" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle4" color="text.secondarydark" textTransform={textTransform}>
        {value || '-'}
      </Typography>
    </Stack>
  </Grid>
);

export default function ApprovalForm() {
  const { id } = useParams();
  const inKindContributionRequestData = useSelector((state) => state?.beneficiary?.inKindContributionRequestData);
  const { masterData } = useSelector((state) => state?.common);
  const theme = useTheme();
  const styles = CommonStyle(theme);
  const [openAssessmentModal, setOpenAssessmentModal] = useState(false);
  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [viewDetailsData, setViewDetailsData] = useState(null);

  const { isAgreedDocImplemented, requestApprovalStages } = inKindContributionRequestData || {};

  const { data: agreementDocuments = [] } = useQuery(
    ['inKindAgreementDocuments', id],
    () => beneficiaryApi.getInKindDocumentsByType({ entityId: id, type: 'AGREEMENT' }),
    {
      enabled: !!id
    }
  );

  const handleViewDetails = (stage) => {
    setViewDetailsData(stage);
    setOpenViewDetails(true);
  };

  const renderAgreementDocument = (doc) => {
    const { type, validFrom, validTill, fileName, preSignedUrl } = doc || {};

    const fields = [
      { label: 'Type of Document', value: type || '-' },
      { label: 'Valid From Date', value: validFrom ? fDateWithLocale(validFrom) : '-' },
      { label: 'Valid To Date', value: validTill ? fDateWithLocale(validTill) : '-' }
    ];

    return (
      <Box key={doc?.id} sx={styles.documentCard}>
        <Grid container spacing={2}>
          {fields?.map((field) => (
            <FieldDisplay
              key={field?.label}
              label={field?.label}
              value={field?.value}
              gridProps={{ xs: 12, sm: 6, md: 4 }}
            />
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Stack>
              <Typography variant="body3" color="text.secondary">
                Document Attachment
              </Typography>
              {preSignedUrl ? (
                <Link
                  href={preSignedUrl}
                  variant="body2"
                  underline="hover"
                  sx={{ '&&': { color: 'black', fontWeight: 400 } }}
                >
                  {fileName || '-'}
                </Link>
              ) : (
                <Typography variant="subtitle4" color="text.secondarydark">
                  {fileName || '-'}
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderApprovalStage = (stage) => {
    const { stageName, approverName, status, assessorFinding, assessorConclusion, remarks } = stage || {};

    const hasDetails = assessorFinding || assessorConclusion || remarks;

    return (
      <Box key={stage?.id} sx={styles.documentCard}>
        <Grid container spacing={2} alignItems="flex-start">
          <FieldDisplay
            label="Approver Team"
            value={getLabelByCode(masterData, 'dpwf_contribution_req_approval_stages_view', stageName)}
            gridProps={{ xs: 12, sm: 6, md: 4 }}
          />
          <FieldDisplay label="Approver Authority" value={approverName} gridProps={{ xs: 12, sm: 6, md: 4 }} />
          {status === 'APPROVED' && hasDetails && (
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="contained" color="primary" size="small" onClick={() => handleViewDetails(stage)}>
                View Details
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary.main" textTransform="uppercase">
              In Kind Contribution Approval Form
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
              Agreement Document
            </Typography>
          </Grid>
          <FieldDisplay
            label="Is any agreed doc implemented?"
            value={isAgreedDocImplemented ? 'Yes' : 'No'}
            gridProps={{ xs: 12 }}
          />
          <Grid item xs={12}>
            {agreementDocuments?.length > 0 ? (
              <Stack spacing={2}>{agreementDocuments?.map((doc) => renderAgreementDocument(doc))}</Stack>
            ) : (
              <Box sx={{ bgcolor: 'backgrounds.light', p: 4, width: '100%' }}>
                <Typography color="secondary.darker">No Agreement Documents</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
              Assessment Questions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" size="small" color="primary" onClick={() => setOpenAssessmentModal(true)}>
              View Assessment Questions
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
              Request Approvals
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {requestApprovalStages?.length > 0 ? (
              <Stack spacing={2}>{requestApprovalStages?.map((stage) => renderApprovalStage(stage))}</Stack>
            ) : (
              <Box sx={{ bgcolor: 'backgrounds.light', p: 4, width: '100%' }}>
                <Typography color="secondary.darker">No Request Approvals</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      <AssessmentQuestionsModal
        open={openAssessmentModal}
        onClose={() => setOpenAssessmentModal(false)}
        entityId={id}
      />
      {openViewDetails && (
        <InKindContributionViewDetailsModal
          open={openViewDetails}
          onClose={() => setOpenViewDetails(false)}
          viewDetailsData={viewDetailsData}
        />
      )}
    </>
  );
}
