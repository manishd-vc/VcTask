// Operators by data type
export const operatorsByDataType = {
  string: [
    { name: '=', label: 'Equals' },
    { name: '!=', label: 'Not Equals' },
    { name: 'contains', label: 'Contains' },
    { name: 'beginsWith', label: 'Begins With' },
    { name: 'endsWith', label: 'Ends With' },
    { name: 'doesNotContain', label: 'Does Not Contain' },
    { name: 'doesNotBeginWith', label: 'Does Not Begin With' },
    { name: 'doesNotEndWith', label: 'Does Not End With' },
    { name: 'null', label: 'Is Empty' },
    { name: 'notNull', label: 'Is Not Empty' },
    { name: 'in', label: 'In' },
    { name: 'notIn', label: 'Not In' }
  ],
  number: [
    { name: '=', label: 'Equals' },
    { name: '!=', label: 'Not Equals' },
    { name: '<', label: 'Less Than' },
    { name: '>', label: 'Greater Than' },
    { name: '<=', label: 'Less Than Equals to' },
    { name: '>=', label: 'Greater Than Equal to' },
    { name: 'between', label: 'Between' },
    { name: 'notBetween', label: 'Not Between' },
    { name: 'null', label: 'Is Empty' },
    { name: 'notNull', label: 'Is Not Empty' },
    { name: 'in', label: 'In' },
    { name: 'notIn', label: 'Not In' }
  ],
  date: [
    { name: '<', label: 'Before' },
    { name: '>', label: 'After' },
    { name: 'between', label: 'Between' },
    { name: 'notBetween', label: 'Not Between' },
    { name: 'null', label: 'Is Empty' },
    { name: 'notNull', label: 'Is Not Empty' }
  ],
  boolean: [
    { name: '=', label: 'Equals' },
    { name: '!=', label: 'Not Equals' },
    { name: 'null', label: 'Is Empty' },
    { name: 'notNull', label: 'Is Not Empty' }
  ]
};

// Default operators (fallback)
export const customOperators = [
  { name: '=', label: 'Equals' },
  { name: '!=', label: 'Not Equals' },
  { name: '<', label: 'Less Than' },
  { name: '>', label: 'Greater Than' },
  { name: '<=', label: 'Less Than Equals to' },
  { name: '>=', label: 'Greater Than Equals to' },
  { name: 'contains', label: 'Contains' },
  { name: 'beginsWith', label: 'Begins With' },
  { name: 'endsWith', label: 'Ends With' },
  { name: 'doesNotContain', label: 'Does Not Contain' },
  { name: 'doesNotBeginWith', label: 'Does Not Begin With' },
  { name: 'doesNotEndWith', label: 'Does Not End With' },
  { name: 'null', label: 'Is Empty' },
  { name: 'notNull', label: 'Is Not Empty' },
  { name: 'in', label: 'In' },
  { name: 'notIn', label: 'Not In' },
  { name: 'between', label: 'Between' },
  { name: 'notBetween', label: 'Not Between' }
];

// Function to get operators based on field data type
export const getOperatorsForField = (fieldName, moduleFields) => {
  const field = moduleFields.find((f) => f.backendColumn === fieldName);

  if (!field || (!field.dataType && !field.columnType)) {
    return customOperators;
  }

  const dataType = (field.dataType || field.columnType).toLowerCase();

  // Map common data types to our operator categories
  if (dataType.includes('string') || dataType.includes('varchar') || dataType.includes('text')) {
    return operatorsByDataType.string;
  }
  if (
    dataType.includes('numeric') ||
    dataType.includes('int') ||
    dataType.includes('number') ||
    dataType.includes('decimal') ||
    dataType.includes('float') ||
    dataType.includes('double')
  ) {
    return operatorsByDataType.number;
  }
  if (dataType.includes('date') || dataType.includes('time') || dataType.includes('timestamp')) {
    return operatorsByDataType.date;
  }
  if (dataType.includes('boolean')) {
    return operatorsByDataType.boolean;
  }

  return customOperators;
};

export const operatorMapping = {
  '=': 'equals',
  '!=': 'not equals',
  '<': 'less than',
  '>': 'greater than',
  '<=': 'less than equals to',
  '>=': 'greater than equals to',
  contains: 'contains',
  beginsWith: 'beginsWith',
  endsWith: 'endsWith',
  doesNotContain: 'doesNotContain',
  doesNotBeginWith: 'doesNotBeginWith',
  doesNotEndWith: 'doesNotEndWith',
  null: 'null',
  notNull: 'notNull',
  in: 'in',
  notIn: 'notin',
  between: 'between',
  notBetween: 'notBetween'
};
