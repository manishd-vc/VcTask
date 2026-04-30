'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import CryptoJS from 'crypto-js';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { HtmlTooltip } from 'src/components/customTooltip/customTooltip';
import { BackArrow, DeleteIconRed, EditIcon, TickIcon } from 'src/components/icons';
import { setMasterData, setToastMessage } from 'src/redux/slices/common';
import * as api from 'src/services'; // Ensure addDropdownValue is defined here
import { getLabelObject } from 'src/utils/extractLabelValues';
import { checkPermissions } from 'src/utils/permissions';

const generateId = () => CryptoJS.lib.WordArray.random(16).toString();

export default function DropdownOptionsPage() {
  const { moduleCode, typeLabel } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { masterData } = useSelector((state) => state?.common);
  const [editCode, setEditCode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newOptions, setNewOptions] = useState([]);
  const rolesAssign = useSelector((state) => state?.roles?.assignedRoles);
  const hasEditAccess = checkPermissions(rolesAssign, ['setting_configuration_admin_manage']);
  const typeId = getLabelObject(masterData, typeLabel);
  const Options = getLabelObject(masterData, typeLabel);

  const {
    data = [],
    isLoading,
    refetch
  } = useQuery(
    ['dropdown-options', typeLabel],
    () => (moduleCode === 'report_analytics' ? api.getReportModuleList() : api.fetchDropdownOptions(typeLabel)),
    {
      enabled: !!typeLabel,
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Failed to load dropdown values',
            variant: 'error'
          })
        );
      },
      select: (res) => {
        if (moduleCode === 'report_analytics') {
          return (
            res?.map((item) => ({
              ...item,
              code: item.id
            })) || []
          );
        }
        return res?.data?.values || [];
      }
    }
  );

  const updateMutation = useMutation(
    moduleCode === 'report_analytics' ? api.updateReportModule : api.updateDropdownValue,
    {
      onMutate: async (payload) => {
        const queryKey = ['dropdown-options', typeLabel];
        await queryClient.cancelQueries(queryKey);
        const previousData = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (old) => {
          if (!Array.isArray(old)) return old;
          return old.map((item) => (item.id === payload.id ? { ...item, label: payload.label } : item));
        });

        return { previousData };
      },
      onSuccess: async () => {
        dispatch(setToastMessage({ message: 'Updated successfully', variant: 'success' }));
        setEditCode(null);
        setEditValue('');
        if (moduleCode !== 'report_analytics') {
          const masterDataResponse = await api.masterDataFetch({ types: [typeLabel] });
          dispatch(setMasterData(masterDataResponse));
        }
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(['dropdown-options', typeLabel], context.previousData);
        }
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Update failed',
            variant: 'error'
          })
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(['dropdown-options', typeLabel]);
      }
    }
  );

  const addMutation = useMutation(moduleCode === 'report_analytics' ? api.addReportModule : api.addDropdownValue, {
    onSuccess: async () => {
      dispatch(setToastMessage({ message: 'Added successfully', variant: 'success' }));
      setNewOptions([]);
      if (moduleCode !== 'report_analytics') {
        const masterDataResponse = await api.masterDataFetch({ types: [typeLabel] });
        dispatch(setMasterData(masterDataResponse));
      }
      refetch();
    },
    onError: (err) => {
      dispatch(
        setToastMessage({
          message: err?.response?.data?.message || 'Add failed',
          variant: 'error'
        })
      );
    }
  });

  const statusMutation = useMutation(api.updateReportModuleStatus, {
    onMutate: async ({ id, status }) => {
      const queryKey = ['dropdown-options', typeLabel];
      await queryClient.cancelQueries(queryKey);
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((item) => (item.id === id ? { ...item, status } : item));
      });

      return { previousData };
    },
    onSuccess: () => {
      dispatch(setToastMessage({ message: 'Status updated successfully', variant: 'success' }));
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['dropdown-options', typeLabel], context.previousData);
      }
      dispatch(
        setToastMessage({
          message: err?.response?.data?.message || 'Status update failed',
          variant: 'error'
        })
      );
    }
  });

  const handleEdit = (code, label) => {
    setEditCode(code);
    setEditValue(label);
  };

  const handleSave = (item) => {
    const payload =
      moduleCode === 'report_analytics'
        ? {
            id: item?.id,
            label: editValue
          }
        : {
            label: editValue,
            typeId: typeId.id,
            id: item?.id,
            status: item?.status
          };
    updateMutation.mutate(payload);
  };

  const handleSaveNew = (localId) => {
    const item = newOptions.find((opt) => opt.localId === localId);
    if (!item?.label.trim()) return;

    const payload =
      moduleCode === 'report_analytics'
        ? {
            name: item.label.trim()
          }
        : {
            typeLabel: typeLabel,
            valueLabel: item.label.trim()
          };
    addMutation.mutate(payload);
  };

  const handleDeleteNew = (localId) => {
    const updated = newOptions.filter((opt) => opt.localId !== localId);
    setNewOptions(updated);
  };

  const handleAddMore = () => {
    setNewOptions((prev) => [...prev, { label: '', localId: generateId() }]);
  };

  const handleStatusChange = (item, checked) => {
    const newStatus = checked ? 'Active' : 'InActive';
    statusMutation.mutate({ id: item.id, status: newStatus });
  };

  const fullData = [
    ...data.map((item) => ({ ...item, isNew: false })),
    ...newOptions.map((item) => ({
      ...item,
      isNew: true,
      code: item.localId.toString()
    }))
  ];

  const groupedData = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < fullData.length; i += 2) {
      pairs.push([fullData[i], fullData[i + 1]]);
    }
    return pairs;
  }, [fullData]);

  const handleInputChange = (e, item, field = 'label') => {
    const isNewItem = item.isNew;
    const newValue = e.target.value;
    if (isNewItem) {
      const updated = newOptions.map((opt) => (opt.localId === item.localId ? { ...opt, [field]: newValue } : opt));
      setNewOptions(updated);
    } else {
      if (field === 'label') {
        setEditValue(newValue);
      }
    }
  };

  const renderEditingContent = (item, inputValue) => (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Input
        value={inputValue}
        onChange={(e) => handleInputChange(e, item, 'label')}
        variant="standard"
        fullWidth
        sx={{ pl: 1, '& input::placeholder': { color: 'text.secondarydark' } }}
        placeholder={moduleCode === 'report_analytics' ? 'Enter Module Name' : 'Enter Dropdown Value'}
      />
    </Stack>
  );

  const renderDisplayContent = (item) => (
    <Stack>
      <Typography variant="body2">{item.label}</Typography>
    </Stack>
  );

  const renderGridItem = (item) => {
    if (!item) {
      return <Grid item xs={12} sm={6} key={generateId()} />;
    }

    const isEditing = editCode === item.code || item.isNew;
    const inputValue = item.isNew ? item.label : editValue;

    return (
      <Grid item xs={12} sm={6} key={item.code}>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sm={1}
          borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
          bgcolor={isEditing ? 'grey.100' : 'transparent'}
        >
          {isEditing ? renderEditingContent(item, inputValue) : renderDisplayContent(item)}
          {renderIconActions(item)}
        </Stack>
      </Grid>
    );
  };

  const renderIconActions = (item) => {
    const isEdit = editCode === item.code;
    const isOtherItemBeingEdited = editCode !== null && !editCode;

    if (hasEditAccess && item.isNew) {
      return (
        <Stack flexDirection={'row'} alignItems={'center'}>
          <HtmlTooltip title="Save" arrow>
            <IconButton onClick={() => handleSaveNew(item.localId)}>
              <TickIcon />
            </IconButton>
          </HtmlTooltip>
          <HtmlTooltip title="Delete" arrow>
            <IconButton onClick={() => handleDeleteNew(item.localId)}>
              <DeleteIconRed />
            </IconButton>
          </HtmlTooltip>
        </Stack>
      );
    }

    const tooltipTitle = isEdit ? 'Save' : 'Edit';
    const handleClick = () => (isEdit ? handleSave(item) : handleEdit(item.code, item.label));
    const Icon = isEdit ? <TickIcon /> : <EditIcon />;

    return (
      <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
        {moduleCode === 'report_analytics' && !isEdit && (
          <FormControlLabel
            control={
              <Switch
                checked={item.status === 'Active'}
                onChange={(event) => handleStatusChange(item, event.target.checked)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={item.status === 'Active' ? 'Active' : 'Inactive'}
            sx={{
              '& .MuiFormControlLabel-label': {
                color: item.status === 'Active' ? 'success.main' : 'error.main'
              }
            }}
          />
        )}
        <HtmlTooltip title={tooltipTitle} arrow>
          <IconButton
            onClick={handleClick}
            disabled={isOtherItemBeingEdited || (isEdit && (!editValue || !editValue.trim()))}
          >
            {Icon}
          </IconButton>
        </HtmlTooltip>
      </Stack>
    );
  };

  return (
    <Box>
      <Button variant="text" startIcon={<BackArrow />} onClick={() => router.back()} sx={{ mb: 2 }}>
        Back
      </Button>

      <Stack flexDirection={'row'} justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" textTransform="uppercase" color="primary.main">
          Update Dropdown Value
        </Typography>
        {moduleCode !== 'report_analytics' && (
          <Button variant="contained" onClick={handleAddMore}>
            Add More Option
          </Button>
        )}
      </Stack>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {isLoading && <Typography>Loading...</Typography>}

            {!isLoading && fullData.length === 0 && (
              <Typography color="textSecondary">No dropdown values found.</Typography>
            )}
            <Grid item xs={12} sm={6}>
              <Stack
                flexDirection={'row'}
                justifyContent={'space-between'}
                pb={2}
                borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
              >
                <Typography variant="subtitle4" color={'text.secondarydark'}>
                  {moduleCode === 'report_analytics' ? 'Report Modules' : Options?.description + ' Options'}
                </Typography>
                <Typography variant="subtitle4" color={'text.secondarydark'}>
                  Action
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Stack
                flexDirection={'row'}
                justifyContent={'space-between'}
                pb={2}
                borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
              >
                <Typography variant="subtitle4" color={'text.secondarydark'}>
                  {moduleCode === 'report_analytics' ? 'Report Modules' : Options?.description + ' Options'}
                </Typography>
                <Typography variant="subtitle4" color={'text.secondarydark'}>
                  Action
                </Typography>
              </Stack>
            </Grid>
            {!isLoading &&
              fullData.length > 0 &&
              groupedData.map((pair) => (
                <Grid container item spacing={2} key={pair.map((p) => p?.code || p?.localId || 'empty').join('-')}>
                  {pair.map(renderGridItem)}
                </Grid>
              ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
