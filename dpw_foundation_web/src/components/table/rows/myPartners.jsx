'use client';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// mui
import { Chip, IconButton, Skeleton, TableCell, TableRow, Tooltip } from '@mui/material';
import { useQuery } from 'react-query';
import { ReportIcon, SignDocumentIcon, ViewIcon } from 'src/components/icons';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { fDateM } from 'src/utils/formatTime';
import { partnerStatusColorSchema } from 'src/utils/util';
// component
import { useRouter } from 'next-nprogress-bar';
import * as api from 'src/services';
import { getPartnerStatus } from 'src/utils/getPartnerStatus';

PartnerRequests.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  handleClickOpen: PropTypes.func,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    donationPledgeId: PropTypes.string,
    createdOn: PropTypes.string,
    eventTitle: PropTypes.string,
    donationAmount: PropTypes.string,
    status: PropTypes.string
  }).isRequired
};

export default function PartnerRequests({ isLoading, row, refetch }) {
  const { masterData } = useSelector((state) => state?.common);
  const { data: country } = useQuery(['getCountry'], () => api.getCountry());
  const getCountryLabel = (code) => {
    const countries = country || [];
    const match = countries.find((c) => c.code === code);
    return match?.label || '-';
  };
  const router = useRouter();
  return (
    <>
      <TableRow hover key={row?.id}>
        <TableCell>{row?.partnershipUniqueId}</TableCell>
        <TableCell>{getCountryLabel(row?.country)}</TableCell>
        <TableCell>{row?.startDate ? fDateM(row?.startDate) : '-'}</TableCell>
        <TableCell>{row?.endDate ? fDateM(row?.endDate) : '-'}</TableCell>
        <TableCell>{row?.projects || '-'}</TableCell>
        <TableCell>{getLabelByCode(masterData, 'dpwf_partner_agreement_type', row?.agreementType) || '-'}</TableCell>
        <TableCell>{row?.reports || '-'}</TableCell>
        <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <>
              {(() => {
                const chip = (
                  <Chip
                    color={
                      row?.feedbackStatus === 'FEEDBACK_REQUESTED' ? 'info' : partnerStatusColorSchema[row?.status]
                    }
                    label={getPartnerStatus(masterData, row?.status, row?.feedbackStatus)}
                    size="small"
                  />
                );

                return chip;
              })()}
            </>
          )}
        </TableCell>

        <TableCell>
          <Tooltip title="View" arrow>
            <IconButton onClick={() => router.push(`/user/my-partnerships/${row?.id}/view`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>

          {row?.status === 'IN_PROGRESS_PARTNER' && (
            <Tooltip title="Sign the Document" arrow>
              <IconButton onClick={() => router.push(`/user/my-partnerships/${row?.id}/sign-document`)}>
                <SignDocumentIcon />
              </IconButton>
            </Tooltip>
          )}
          {(row?.status === 'APPROVED' || row?.status === 'ACTIVE') && (
            <Tooltip title="Partnership Reports" arrow>
              <IconButton onClick={() => router.push(`/user/my-partnerships/${row?.id}/reports`)}>
                <ReportIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
