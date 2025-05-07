export const operators = (syncfusionOperator: string): string => {
    const operatorMap: { [key: string]: string } = {
      startswith: 'startsWith',
      endswith: 'endsWith',
      contains: 'contains',
      equal: 'equals',
      notEqual: 'not',
      greaterThan: 'gt',
      greaterThanOrEqual: 'gte',
      lessThan: 'lt',
      lessThanOrEqual: 'lte'
    };
  
    return operatorMap[syncfusionOperator] || 'contains'; // Default to contains
  };