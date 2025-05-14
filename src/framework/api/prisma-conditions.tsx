import { Prisma } from '@prisma/client';

export function buildWhereCondition(
  field: string,
  nestedField: string | null,
  value: string | null,
  operator: string,
  search: string | null,
  searchableFields: string[] = []
) {
  return {
    AND: [
      // Handle nested field filtering
      field && value ? (
        nestedField 
          ? {
              [field]: {
                [nestedField]: {
                  [operator]: value,
                  mode: 'insensitive',
                }
              }
            }
          : {
              [field]: {
                [operator]: value,
                mode: 'insensitive',
              }
            }
      ) : {},
      
      // Handle global search
      search ? {
        OR: searchableFields.map(searchField => 
          searchField.includes('.') 
            ? {
                [searchField.split('.')[0]]: {
                  [searchField.split('.')[1]]: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive
                  }
                }
              }
            : {
                [searchField]: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive
                }
              }
        )
      } : {}
    ]
  };
}