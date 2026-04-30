'use client';
import { Autocomplete, Box, Button, Grid, IconButton, Paper, TextField } from '@mui/material';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import QueryBuilder from 'react-querybuilder';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { BackArrow, DeleteIconRed } from 'src/components/icons';
import ReportTable from 'src/components/table/ReportTable';
import { useDispatch, useSelector } from 'src/redux';
import { setToastMessage } from 'src/redux/slices/common';
import { helperLogicalOperator, isCommaSeparated, parseCommaSeparatedValues } from 'src/utils/dataTypeValueHelpers';
import { getOperatorsForField, operatorMapping } from 'src/utils/reportUtils';
import * as Yup from 'yup';
import {
  executeQuery,
  exportReportData,
  getModuleColumns,
  getModules,
  getReportById,
  saveReportQuery,
  updateReportQuery
} from '../../../services/moduleService';
import DataTypeValueEditor from './DataTypeValueEditor';
import ReportActions from './ReportActions';

import SelectField from './SelectField';

const initialQuery = {
  combinator: 'and',
  rules: []
};

export default function QueryManagement({ edit = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const [query, setQuery] = useState(initialQuery);
  const [filteredData, setFilteredData] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedResultFields, setSelectedResultFields] = useState([]);
  const [appliedResultFields, setAppliedResultFields] = useState([]);
  const [moduleFields, setModuleFields] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [reportName, setReportName] = useState('');
  const [isLoadingReportData, setIsLoadingReportData] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    reportName: '',
    selectedModule: '',
    selectedResultFields: [],
    query: initialQuery
  });

  const header = edit ? 'Edit & Run Report' : 'Create New Report';
  const reportId = edit ? id : null;

  // Formik validation schema
  const validationSchema = Yup.object().shape({
    reportName: Yup.string().required('Report Name is required.'),
    selectedModule: Yup.string().required('Module selection is required.'),
    selectedResultFields: Yup.array().min(1, 'Please select at least one field.')
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      reportName: '',
      selectedModule: '',
      selectedResultFields: []
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleSaveConfiguration();
    }
  });

  const { handleSubmit, values, errors, touched, setFieldValue, setFieldTouched } = formik;

  const { data: modules = [], isLoading: loading } = useQuery('modules', getModules, {
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error?.response?.data?.message || error?.message || 'Failed to load modules',
          variant: 'error'
        })
      );
    }
  });

  // Fetch report data when editing
  useQuery(['reportData', reportId], () => getReportById(reportId), {
    enabled: !!reportId && edit,
    onSuccess: (data) => {
      if (data) {
        setIsLoadingReportData(true);
        const reportNameValue = data.reportName || '';
        setReportName(reportNameValue);

        let moduleIdValue = '';
        let selectedFieldsValue = [];
        let queryValue = initialQuery;

        // Parse queryJson to extract moduleId and other data
        if (data.queryJson) {
          const parsedQuery = JSON.parse(data.queryJson);
          moduleIdValue = parsedQuery.moduleId || '';
          setSelectedModule(moduleIdValue);

          // Set selected result fields from select array
          if (parsedQuery.queryRequest?.select) {
            selectedFieldsValue = parsedQuery.queryRequest.select;
            setSelectedResultFields(selectedFieldsValue);
          }

          // Reconstruct query builder rules from where clause
          if (parsedQuery.queryRequest?.where) {
            queryValue = reconstructQueryFromAPI(parsedQuery.queryRequest.where);
            setQuery(queryValue);
          }
        }

        // Store original values for reset functionality
        setOriginalValues({
          reportName: reportNameValue,
          selectedModule: moduleIdValue,
          selectedResultFields: selectedFieldsValue,
          query: queryValue
        });

        // Update Formik values
        setFieldValue('reportName', reportNameValue);
        setFieldValue('selectedModule', moduleIdValue);
        setFieldValue('selectedResultFields', selectedFieldsValue);

        // Auto-execute report for edit mode to show data in table
        if (moduleIdValue) {
          setHasAppliedFilter(true);
          setAppliedResultFields(selectedFieldsValue);
        }

        setIsLoadingReportData(false);
      }
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error?.response?.data?.message || error?.message || 'Failed to load report data',
          variant: 'error'
        })
      );
    }
  });

  useQuery(['moduleColumns', selectedModule], () => getModuleColumns(selectedModule), {
    enabled: !!selectedModule,
    onSuccess: (data) => {
      setModuleFields(data);
      // Only reset selected fields if not loading report data (i.e., for new reports)
      if (!isLoadingReportData && !reportId) {
        setSelectedResultFields([]);
      }
      // Auto-execute report for edit mode when module fields are loaded
      if (reportId && hasAppliedFilter && selectedModule) {
        const payload = buildPayload(true, currentPage, pageSize);
        queryMutation.mutate({ entityType: selectedModule, payload });
      }
    },
    onError: (error) => {
      dispatch(
        setToastMessage({
          message: error?.response?.data?.message || error?.message || 'Failed to load module columns',
          variant: 'error'
        })
      );
    }
  });

  const queryMutation = useMutation(({ entityType, payload }) => executeQuery(entityType, payload), {
    onSuccess: (data) => {
      const { data: filteredData, totalElements, page, size } = data;
      setFilteredData(filteredData);
      setPaginationData({
        totalElements,
        page,
        size
      });
      const currentSelectedFields = values.selectedResultFields || selectedResultFields;
      setAppliedResultFields(currentSelectedFields);
    },
    onError: (error) => {
      console.error('Query execution failed:', error);
      dispatch(
        setToastMessage({
          message: error?.response?.data?.message || error?.message || 'Query execution failed',
          variant: 'error'
        })
      );
      setFilteredData([]);
      setPaginationData(null);
    }
  });

  const saveConfigMutation = useMutation(
    ({ reportName, moduleId, userId, payload, reportId, isUpdate }) =>
      isUpdate ? updateReportQuery(reportId, payload) : saveReportQuery(reportName, moduleId, userId, payload),
    {
      onSuccess: (data) => {
        if (data?.status === 500) {
          return dispatch(
            setToastMessage({
              message: data?.message,
              variant: 'error'
            })
          );
        }
        dispatch(
          setToastMessage({
            message: data?.message,
            variant: 'success'
          })
        );
        router.push('/admin/report-management/');
      },
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || err?.message || 'Failed to save report configuration',
            variant: 'error'
          })
        );
      }
    }
  );

  const exportMutation = useMutation(
    ({ moduleId, reportName, payload, page, size }) => exportReportData(moduleId, reportName, payload, page, size),
    {
      onSuccess: (data) => {
        dispatch(
          setToastMessage({
            message: data?.message || 'Export completed successfully',
            variant: 'success'
          })
        );
      },
      onError: (err) => {
        dispatch(
          setToastMessage({
            message: err?.response?.data?.message || 'Export failed',
            variant: 'error'
          })
        );
      }
    }
  );

  // Build common payload for queries
  const buildPayload = (includePagination = false, page = 0, size = 10) => {
    const currentSelectedFields = values.selectedResultFields || selectedResultFields;
    const selectFields =
      currentSelectedFields.length > 0
        ? currentSelectedFields.map((field) => `${field}`)
        : moduleFields.map((field) => `${field.code}`);

    const whereClause = convertRulesToAPIFormat(query?.rules || [], query?.combinator);

    const payload = {
      select: selectFields,
      ...(whereClause && { where: whereClause })
    };

    if (includePagination) {
      payload.page = page;
      payload.size = size;
    }

    return payload;
  };

  // Reconstruct QueryBuilder format from API response
  const reconstructQueryFromAPI = (whereClause) => {
    if (!whereClause || !whereClause.rules) {
      return initialQuery;
    }

    const reconstructRules = (apiRules) => {
      return apiRules.map((rule) => {
        if (rule.rules) {
          return {
            combinator: rule.op?.toLowerCase() || 'and',
            rules: reconstructRules(rule.rules)
          };
        }

        // Find the original operator from operatorMapping
        const originalOperator =
          Object.keys(operatorMapping).find((key) => operatorMapping[key] === rule.op) || rule.op;

        return {
          field: rule.field,
          operator: originalOperator,
          value: rule.value
        };
      });
    };

    return {
      combinator: whereClause.op?.toLowerCase() || 'and',
      rules: reconstructRules(whereClause.rules || [])
    };
  };

  // Convert QueryBuilder rules to API format
  const convertRulesToAPIFormat = (rules, combinator) => {
    if (!Array.isArray(rules) || rules.length === 0) return null;

    const apiRules = rules.map((rule) => {
      // Handle nested rule groups
      if (rule.rules) {
        return convertRulesToAPIFormat(rule.rules, rule.combinator);
      }

      // Handle individual rules
      let value = rule.value;

      // Handle between operator values
      if (['between', 'notBetween'].includes(rule.operator) && isCommaSeparated(value)) {
        value = parseCommaSeparatedValues(value);
      }

      // Handle in and notin operator values - convert to array
      if (['in', 'notIn'].includes(rule.operator) && isCommaSeparated(value)) {
        value = parseCommaSeparatedValues(value);
      }

      return {
        field: rule.field,
        op: operatorMapping[rule.operator] || rule.operator || 'contains',
        value
      };
    });

    return {
      op: helperLogicalOperator(combinator),
      rules: apiRules
    };
  };

  // Helper functions for rule validation
  const isEmptyValue = (value) => value === undefined || value === null || value === '';
  const requiresValue = (operator) => !['null', 'notNull'].includes(operator);

  const validateSingleRule = (rule) => {
    if (!rule.field) return { isValid: false, message: 'Please select a field for all query conditions' };
    if (!rule.operator) return { isValid: false, message: 'Please select an operator for all query conditions' };
    if (requiresValue(rule.operator) && isEmptyValue(rule.value)) {
      return { isValid: false, message: 'Please provide a value for all query conditions' };
    }
    return { isValid: true };
  };

  // Validate query builder rules
  const validateQueryRules = (rules) => {
    if (!rules?.length) return { isValid: true };

    for (const rule of rules) {
      const validation = rule.rules ? validateQueryRules(rule.rules) : validateSingleRule(rule);
      if (!validation.isValid) return validation;
    }
    return { isValid: true };
  };

  // Save report configuration
  const handleSaveConfiguration = () => {
    if (!reportName.trim()) {
      dispatch(
        setToastMessage({
          message: 'Please enter a report name',
          variant: 'error'
        })
      );
      return;
    }

    if (!selectedModule) {
      dispatch(
        setToastMessage({
          message: 'Please select a module',
          variant: 'error'
        })
      );
      return;
    }

    const currentSelectedFields = values.selectedResultFields || selectedResultFields;
    if (!currentSelectedFields || currentSelectedFields.length === 0) {
      dispatch(
        setToastMessage({
          message: 'Please select at least one field',
          variant: 'error'
        })
      );
      return;
    }

    // Validate query builder rules
    const validation = validateQueryRules(query.rules);
    if (!validation.isValid) {
      dispatch(
        setToastMessage({
          message: validation.message,
          variant: 'error'
        })
      );
      return;
    }

    const payload = {
      ...buildPayload(),
      where: buildPayload().where || {}
    };

    const isUpdate = !!reportId;

    saveConfigMutation.mutate({
      moduleId: selectedModule,
      userId: user.userId,
      reportName: reportName.trim(),
      payload,
      reportId,
      isUpdate
    });
  };

  // Execute API query
  const executeReport = (page = currentPage, size = pageSize) => {
    if (!selectedModule) {
      dispatch(
        setToastMessage({
          message: 'Please select a module first',
          variant: 'error'
        })
      );
      return;
    }

    const payload = buildPayload(true, page, size);
    queryMutation.mutate({ entityType: selectedModule, payload });
  };

  // Execute API query when clicking "Apply"
  const handleApplyFilter = () => {
    // Sync local state with Formik values before executing
    const currentSelectedFields = values.selectedResultFields || selectedResultFields;

    // Validate that at least one field is selected
    if (!currentSelectedFields || currentSelectedFields.length === 0) {
      dispatch(
        setToastMessage({
          message: 'Please select at least one field to run the report',
          variant: 'error'
        })
      );
      return;
    }

    // Validate query builder rules
    const validation = validateQueryRules(query.rules);
    if (!validation.isValid) {
      dispatch(
        setToastMessage({
          message: validation.message,
          variant: 'error'
        })
      );
      return;
    }

    setSelectedResultFields(currentSelectedFields);
    setAppliedResultFields(currentSelectedFields);
    setCurrentPage(0);
    setHasAppliedFilter(true);
    executeReport(0, pageSize);
  };

  // Reset all fields and query builder
  const handleReset = () => {
    if (reportId) {
      // For edit mode, restore to original values
      setReportName(originalValues.reportName);
      setSelectedModule(originalValues.selectedModule);
      setSelectedResultFields(originalValues.selectedResultFields);
      setQuery(originalValues.query);
      setAppliedResultFields(originalValues.selectedResultFields);
      setHasAppliedFilter(true);

      // Update Formik values
      setFieldValue('reportName', originalValues.reportName);
      setFieldValue('selectedModule', originalValues.selectedModule);
      setFieldValue('selectedResultFields', originalValues.selectedResultFields);

      // Build payload with original values
      const selectFields =
        originalValues.selectedResultFields.length > 0
          ? originalValues.selectedResultFields.map((field) => `${field}`)
          : moduleFields.map((field) => `${field.code}`);
      const whereClause = convertRulesToAPIFormat(originalValues.query?.rules || [], originalValues.query?.combinator);
      const payload = {
        select: selectFields,
        ...(whereClause && { where: whereClause }),
        page: 0,
        size: pageSize
      };
      queryMutation.mutate({ entityType: originalValues.selectedModule, payload });
    } else {
      // For create mode, clear all fields
      setSelectedModule('');
      setSelectedResultFields([]);
      setModuleFields([]);
      setQuery(initialQuery);
      setReportName('');
      setAppliedResultFields([]);
      setFilteredData([]);
      setPaginationData(null);
      setHasAppliedFilter(false);

      // Reset Formik values
      setFieldValue('reportName', '');
      setFieldValue('selectedModule', '');
      setFieldValue('selectedResultFields', []);

      // Reset URL parameters when resetting in create mode
      router.push('/admin/report-management/add', { scroll: false });
    }
  };

  // Handle export functionality
  const handleExport = () => {
    const payload = buildPayload();

    exportMutation.mutate({
      moduleId: selectedModule,
      reportName: reportName.trim(),
      payload,
      page: currentPage,
      size: pageSize
    });
  };

  // Listen for URL parameter changes and update API call
  useEffect(() => {
    if (hasAppliedFilter && selectedModule) {
      const urlPage = parseInt(searchParams.get('page') || '1', 10) - 1;
      const urlRowsPerPage = parseInt(searchParams.get('rowsPerPage') || '10', 10);

      if (urlPage !== currentPage || urlRowsPerPage !== pageSize) {
        setCurrentPage(urlPage);
        setPageSize(urlRowsPerPage);
        executeReport(urlPage, urlRowsPerPage);
      }
    }
  }, [searchParams, hasAppliedFilter, selectedModule, currentPage, pageSize]);

  // Remove title attributes from QueryBuilder elements to prevent hover tooltips
  useEffect(() => {
    const removeTooltips = () => {
      const elementsWithTitle = document.querySelectorAll('[title]');
      elementsWithTitle.forEach((element) => {
        if (element.closest('.queryBuilder')) {
          element.removeAttribute('title');
        }
      });
    };

    // Remove tooltips after component renders
    const timer = setTimeout(removeTooltips, 100);

    // Also remove on any DOM changes
    const observer = new MutationObserver(removeTooltips);
    const queryBuilderElement = document.querySelector('.queryBuilder');
    if (queryBuilderElement) {
      observer.observe(queryBuilderElement, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [query, selectedModule]);

  const valueEditor = useCallback(
    (props) => {
      // Hide value editor for isEmpty and isNotEmpty operators
      if (['null', 'notNull'].includes(props.operator)) {
        return null;
      }
      return <DataTypeValueEditor props={props} moduleFields={moduleFields} />;
    },
    [moduleFields]
  );

  const fieldSelector = useCallback((props) => {
    const options = props.options.map((opt) => ({
      value: opt.name,
      label: opt.label,
      key: opt.id
    }));
    return (
      <Autocomplete
        size="small"
        options={options}
        value={options.find((opt) => opt.value === props.value) || null}
        onChange={(event, newValue) => props.handleOnChange(newValue?.value || '')}
        getOptionLabel={(option) => option.label || ''}
        getOptionKey={(option) => option.key}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Field"
            placeholder="Search field"
            variant="standard"
            sx={{
              padding: '8px 4px 8px 0px',
              '& .MuiInputBase-input': {
                paddingRight: '32px !important'
              }
            }}
          />
        )}
      />
    );
  }, []);

  const operatorSelector = useCallback(
    (props) => {
      const fieldOperators = getOperatorsForField(props.field, moduleFields);
      const options = fieldOperators.map((opt) => ({ value: opt.name, label: opt.label }));
      return (
        <Autocomplete
          size="small"
          options={options}
          value={options.find((opt) => opt.value === props.value) || null}
          onChange={(event, newValue) => props.handleOnChange(newValue?.value || '')}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => option.value === value?.value}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Operator"
              placeholder="Search operator"
              variant="standard"
              sx={{ padding: '8px 4px 8px 0px' }}
            />
          )}
        />
      );
    },
    [moduleFields]
  );

  const removeRuleAction = useCallback(
    (props) => (
      <IconButton aria-label="delete" onClick={props.handleOnClick}>
        <DeleteIconRed />
      </IconButton>
    ),
    []
  );

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item xs={4} sm={2} md={2}>
          <Button
            variant="text"
            color="primary"
            startIcon={<BackArrow />}
            sx={{
              mb: { xs: 3 },
              '&:hover': { textDecoration: 'none' }
            }}
            onClick={() => router.push('/admin/report-management/')}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <HeaderBreadcrumbs admin heading={header} />

      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <QueryBuilderMaterial>
            {/* Module and Field Selection */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    id="reportName"
                    variant="standard"
                    label="Enter Report Name "
                    fullWidth
                    value={reportName}
                    onChange={(e) => {
                      setReportName(e.target.value);
                      setFieldValue('reportName', e.target.value);
                    }}
                    disabled={!!reportId}
                    required
                    error={Boolean(touched.reportName && errors.reportName)}
                    helperText={touched.reportName && errors.reportName}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Autocomplete
                    options={modules.map((module) => ({ value: module.id, label: module.label }))}
                    value={
                      modules
                        .map((module) => ({ value: module.id, label: module.label }))
                        .find((option) => option.value === selectedModule) || null
                    }
                    onChange={(event, newValue) => {
                      const value = newValue?.value || '';
                      const previousModule = selectedModule;

                      setSelectedModule(value);
                      setFieldValue('selectedModule', value);

                      // Reset table and dependent fields when module changes
                      setSelectedResultFields([]);
                      setFieldValue('selectedResultFields', []);
                      setQuery(initialQuery);
                      setFilteredData([]);
                      setPaginationData(null);
                      setHasAppliedFilter(false);
                      setAppliedResultFields([]);
                      setCurrentPage(0);
                      setPageSize(10);

                      // Only reset URL parameters if there was a previous module selected
                      if (previousModule && previousModule !== value) {
                        router.push('/admin/report-management/add', { scroll: false });
                      }

                      if (!newValue) {
                        setModuleFields([]);
                      }
                    }}
                    onBlur={() => setFieldTouched('selectedModule', true)}
                    getOptionLabel={(option) => option.label || ''}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    disabled={loading || !!reportId}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Module"
                        variant="standard"
                        required
                        sx={{ padding: '7px 4px 7px 0px' }}
                        error={Boolean(touched.selectedModule && errors.selectedModule)}
                        helperText={touched.selectedModule && errors.selectedModule}
                      />
                    )}
                  />
                </Grid>
                {selectedModule && <SelectField moduleFields={moduleFields} />}
              </Grid>
              {selectedModule && (
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={12} md={10}>
                    <Box
                      sx={{
                        '& .ruleGroup-combinators': {
                          minWidth: 90
                        },
                        '& .ruleGroup-addRule, & .ruleGroup-addGroup': {
                          marginTop: 0
                        },
                        '& .ruleGroup-addGroup': {
                          display: 'none'
                        },
                        '& .rule': {
                          marginBottom: 1,
                          marginTop: 1.5,
                          display: 'flex',
                          gap: 3,
                          '& > *:not(:last-child)': {
                            flex: '1 1 0'
                          }
                        },
                        '& *[title]': {
                          '&:hover': {
                            '&::after': {
                              display: 'none !important'
                            }
                          }
                        },
                        '& *': {
                          '&[title]:hover': {
                            cursor: 'default'
                          }
                        }
                      }}
                    >
                      <div className="queryBuilder">
                        <QueryBuilder
                          fields={moduleFields.map((field) => ({
                            id: field.id,
                            name: field.backendColumn,
                            label: field.displayLabel
                          }))}
                          query={query}
                          onQueryChange={setQuery}
                          showCombinatorsBetweenRules
                          useDateTimePackage
                          getOperators={(field) => getOperatorsForField(field, moduleFields)}
                          controlElements={{
                            fieldSelector,
                            operatorSelector,
                            valueEditor,
                            removeRuleAction
                          }}
                        />
                      </div>
                    </Box>
                  </Grid>
                </Grid>
              )}
              {selectedModule && (
                <ReportActions
                  edit={edit}
                  handleReset={handleReset}
                  handleApplyFilter={handleApplyFilter}
                  selectedModule={selectedModule}
                  saveConfigMutation={saveConfigMutation}
                  handleSaveConfiguration={handleSaveConfiguration}
                  queryMutation={queryMutation}
                />
              )}
            </Paper>
            {selectedModule &&
              (appliedResultFields.length > 0 || filteredData.length > 0 ? (
                <ReportTable
                  headers={
                    appliedResultFields.length > 0
                      ? appliedResultFields.map((field) => {
                          const moduleField = moduleFields.find((mf) => mf.backendColumn === field);
                          return {
                            code: field,
                            label: moduleField?.displayLabel || field
                          };
                        })
                      : moduleFields.map((field) => ({
                          code: field.backendColumn || field.code,
                          label: field.displayLabel || field.label
                        }))
                  }
                  data={filteredData}
                  paginationData={paginationData}
                  maxHeight={400}
                  stickyHeader={true}
                  showPagination={!!paginationData}
                  title="Report Results"
                  totalCount={paginationData?.totalElements || filteredData.length}
                  onExport={handleExport}
                  isExporting={exportMutation.isLoading}
                />
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  No data to show. Please select a module and run the report.
                </Paper>
              ))}
          </QueryBuilderMaterial>
        </Form>
      </FormikProvider>
    </>
  );
}
