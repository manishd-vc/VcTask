import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as partnerApi from 'src/services/partner';
import { getLabelByCode } from 'src/utils/extractLabelByCode';
import { CloseIcon } from '../icons';
import ModalStyle from './dialog.style';

export default function AssociateProjectsView({ open, onClose }) {
  const theme = useTheme();
  const style = ModalStyle(theme);
  const { id } = useParams();
  const { masterData } = useSelector((state) => state.common);

  const { data: associatedCampaigns } = useQuery(
    'getAssociatedCampaigns',
    () => partnerApi.getAssociatedCampaigns(id),
    {
      enabled: !!id
    }
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ textTransform: 'uppercase' }} variant="h5" color="primary.main" mb={0}>
        Associated Projects
      </DialogTitle>
      <IconButton aria-label="close" onClick={onClose} sx={style.closeModal}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project ID</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Project Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {associatedCampaigns?.map((campaign) => (
                <TableRow key={campaign?.id}>
                  <TableCell>{campaign?.campaignNumericId}</TableCell>
                  <TableCell>{campaign?.campaignTitle}</TableCell>
                  <TableCell>
                    {getLabelByCode(masterData, 'dpw_foundation_campaign_status', campaign.status) ? (
                      <Chip
                        label={getLabelByCode(masterData, 'dpw_foundation_campaign_status', campaign.status)}
                        color="success"
                        size="small"
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
