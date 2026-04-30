import { Box, Grid, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import * as finance from 'src/services/finance';
import { fDateWithLocale } from 'src/utils/formatTime';

export default function SupportDocuments() {
  const { id } = useParams();

  const { data: supportDocuments = [] } = useQuery(
    ['inKindSupportDocuments', id],
    () => finance.getInKindDocumentsByType({ entityId: id, type: 'SUPPORT' }),
    {
      enabled: !!id
    }
  );

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle6" component="h4" textTransform={'uppercase'} color="primary.main">
          Document Upload in Support of Request
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {supportDocuments?.length > 0 ? (
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell>Uploaded By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supportDocuments?.map((doc) => (
                  <TableRow key={doc?.id}>
                    <TableCell>{doc?.documentName || '-'}</TableCell>
                    <TableCell>{doc?.documentPurpose || '-'}</TableCell>
                    <TableCell>
                      {doc?.preSignedUrl ? (
                        <Link href={doc?.preSignedUrl} underline="hover">
                          {doc?.type || '-'}
                        </Link>
                      ) : (
                        doc?.type || '-'
                      )}
                    </TableCell>
                    <TableCell>{doc?.createdAt ? fDateWithLocale(doc?.createdAt) : '-'}</TableCell>
                    <TableCell>{doc?.createdByName || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography color="secondary.darker">No Support Documents</Typography>
        )}
      </Grid>
    </>
  );
}
