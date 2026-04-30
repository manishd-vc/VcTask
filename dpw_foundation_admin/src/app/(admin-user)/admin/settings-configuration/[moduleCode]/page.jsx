'use client';

import { Box, Button, Card, CardContent, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import { BackArrow, ViewIcon } from 'src/components/icons';
import { setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services';
import { getLabelObject } from 'src/utils/extractLabelValues';

export default function ModuleDetailPage() {
  const { moduleCode } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { masterData } = useSelector((state) => state?.common);
  const moduleLabel = getLabelObject(masterData, 'dpw_foundation_module_label');
  const matchedLabel =
    moduleLabel?.values?.find((val) => val.code === moduleCode)?.label ?? moduleCode?.replace(/_/g, ' '); // Query for dropdown list

  const { data: dropdownData = [], isLoading: loadingDropdown } = useQuery(
    ['module-label-types', moduleCode],
    () => api.getModuleLabelTypes(moduleCode),
    {
      enabled: !!moduleCode && moduleCode !== 'report_analytics',
      select: (res) => res?.data || [],
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Failed to load',
            variant: 'error'
          })
        );
      }
    }
  );

  // Query for content list (only if moduleCode === 'donor_manage')
  const { data: contentData = [], isLoading: loadingContent } = useQuery(
    ['donor-content-list'],
    () => api.getDonorContentList(moduleCode),
    {
      enabled:
        moduleCode === 'donor_manage' ||
        moduleCode === 'grant_manage' ||
        moduleCode === 'partner_manage' ||
        moduleCode === 'volunteer_manage',
      select: (res) => res?.data?.content || [],
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Failed to load content',
            variant: 'error'
          })
        );
      }
    }
  );

  const handleViewClick = (typeLabel) => {
    router.push(`/admin/settings-configuration/${moduleCode}/${typeLabel}`);
  };

  return (
    <Box>
      <Button variant="text" startIcon={<BackArrow />} onClick={() => router.back()} sx={{ mb: 2 }}>
        Back
      </Button>

      <Typography variant="h5" color="primary.main" sx={{ mb: 3 }} textTransform={'uppercase'}>
        SETTINGS / CONFIGURATION
      </Typography>

      <Typography variant="h6" component={'p'} mb={3} textTransform="uppercase" color="primary.main">
        {matchedLabel} Dropdown List
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subHeader" component="h6" color="primary.main">
          {matchedLabel} Dropdown List
        </Typography>
      </Paper>
      <Card>
        <CardContent>
          <Stack
            flexDirection={'row'}
            justifyContent={'space-between'}
            p={2}
            borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
          >
            <Typography variant="subtitle4" color={'text.secondarydark'}>
              Dropdown Name
            </Typography>
            <Typography variant="subtitle4" color={'text.secondarydark'}>
              Action
            </Typography>
          </Stack>
          {loadingDropdown ? (
            <Typography>Loading...</Typography>
          ) : (
            moduleCode !== 'report_analytics' &&
            dropdownData.map((item) => (
              <Stack
                key={item?.id}
                flexDirection={'row'}
                justifyContent={'space-between'}
                p={2}
                borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
              >
                <Typography variant="body1" color={'text.secondarydark'}>
                  {item.fieldName}
                </Typography>
                <HtmlTooltip title="View" arrow>
                  <IconButton onClick={() => handleViewClick(item.typeLabel)}>
                    <ViewIcon />
                  </IconButton>
                </HtmlTooltip>
              </Stack>
            ))
          )}

          {loadingDropdown ? (
            <Typography>Loading...</Typography>
          ) : (
            moduleCode === 'report_analytics' && (
              <Stack
                key={'report_analytics'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                p={2}
                borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
              >
                <Typography variant="body1" color={'text.secondarydark'}>
                  Module
                </Typography>
                <HtmlTooltip title="View" arrow>
                  <IconButton onClick={() => handleViewClick('module')}>
                    <ViewIcon />
                  </IconButton>
                </HtmlTooltip>
              </Stack>
            )
          )}
        </CardContent>
      </Card>

      {/* Content Management Section */}
      {(moduleCode === 'donor_manage' ||
        moduleCode === 'grant_manage' ||
        moduleCode === 'partner_manage' ||
        moduleCode === 'volunteer_manage') && (
        <>
          <Typography variant="h6" mt={4} mb={2} textTransform="uppercase" color="primary.main">
            CONTENT MANAGEMENT
          </Typography>

          <Card>
            <CardContent>
              <Stack
                flexDirection={'row'}
                justifyContent={'space-between'}
                p={2}
                borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
              >
                <Typography variant="subtitle4" color={'text.secondarydark'}>
                  Content List
                </Typography>
                <Typography variant="subtitle4" color={'text.secondarydark'}>
                  Action
                </Typography>
              </Stack>
              {loadingContent ? (
                <Typography>Loading content...</Typography>
              ) : (
                contentData.map((item) => (
                  <Stack
                    key={item?.id}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    p={2}
                    borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
                  >
                    <Typography variant="body1" color={'text.secondarydark'}>
                      {item.title}
                    </Typography>
                    <HtmlTooltip title="View" arrow>
                      <IconButton
                        onClick={() =>
                          router.push(`/admin/settings-configuration/${moduleCode}/donor/${item?.templateCode}`)
                        }
                      >
                        <ViewIcon />
                      </IconButton>
                    </HtmlTooltip>
                  </Stack>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
