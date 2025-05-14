/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { operators } from '@framework/api/operators';

export interface RequestParams {
  page: number;
  limit: number;
  operator: string;
  value: string;
  field: string;
  nestedField: string | null;
  search: string;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  skip: number;
  orderBy: Record<string, any>;
}

export function getRequestParams(request: NextRequest): RequestParams {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const operator = operators(searchParams.get('operator') || 'contains');
  const value = searchParams.get('value') || '';
  const rawField = searchParams.get('field') || 'id';
  const search = searchParams.get('search') || '';
  const sortField = searchParams.get('sort') || 'id';
  const sortDirection = searchParams.get('dir') === 'descending' ? 'desc' : 'asc';
  const skip = (page - 1) * limit;

  // Handle nested filtering
  const [field, nestedField] = rawField.includes('.') 
    ? rawField.split('.')
    : [rawField, null];

  // Parse nested sort field
  const orderBy = sortField.includes('.')
    ? {
        [sortField.split('.')[0]]: {
          [sortField.split('.')[1]]: sortDirection
        }
      }
    : { [sortField]: sortDirection };

  return {
    page,
    limit,
    operator,
    value,
    field,
    nestedField,
    search,
    sortField,
    sortDirection,
    orderBy,
    skip
  };
}