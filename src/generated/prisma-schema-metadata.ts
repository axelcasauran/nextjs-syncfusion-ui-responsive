// This file is auto-generated from the Prisma schema
// Do not edit directly

export interface PrismaFieldMetadata {
  name: string;
  type: string;
  isRequired: boolean;
  isId: boolean;
  isUnique: boolean;
  hasDefaultValue: boolean;
  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
  isGenerated: boolean;
  isUpdatedAt: boolean;
}

export interface PrismaModelMetadata {
  name: string;
  fields: PrismaFieldMetadata[];
}

// This is a placeholder - will be replaced by the generator
export const PRISMA_SCHEMA_METADATA: Record<string, PrismaModelMetadata> = {
  "Service": {
    "name": "Service",
    "fields": [
      {
        "name": "id",
        "type": "String",
        "isRequired": true,
        "isId": true,
        "isUnique": false,
        "hasDefaultValue": true,
        "relationName": undefined,
        "isGenerated": false,
        "isUpdatedAt": false
      },
      {
        "name": "type",
        "type": "String",
        "isRequired": true,
        "isId": false,
        "isUnique": false,
        "hasDefaultValue": false,
        "relationName": undefined,
        "isGenerated": false,
        "isUpdatedAt": false
      },
      {
        "name": "name",
        "type": "String",
        "isRequired": true,
        "isId": false,
        "isUnique": false,
        "hasDefaultValue": false,
        "relationName": undefined,
        "isGenerated": false,
        "isUpdatedAt": false
      },
      {
        "name": "description",
        "type": "String",
        "isRequired": false,
        "isId": false,
        "isUnique": false,
        "hasDefaultValue": false,
        "relationName": undefined,
        "isGenerated": false,
        "isUpdatedAt": false
      },
      {
        "name": "location",
        "type": "String",
        "isRequired": false,
        "isId": false,
        "isUnique": false,
        "hasDefaultValue": false,
        "relationName": undefined,
        "isGenerated": false,
        "isUpdatedAt": false
      },
      {
        "name": "startDate",
        "type": "DateTime",
        "isRequired": false,
        "isId": false,
        "isUnique": false,
        "hasDefaultValue": true,
        "relationName": undefined,
        "isGenerated": false,
        "isUpdatedAt": false
      },
      {
        "name": "endDate",
        "type": "DateTime",
        "isRequired": false,
        "isId": false,
        "isUnique": false,
        "hasDefaultValue": true,
        "relationName": undefined,
        "isGenerated": false,
        "isUpdatedAt": false
      },
      {
        "name": "isActive",
        "type": "Boolean",
        "isRequired": true,
        "isId": false,
        "isUnique": false,
        "hasDefaultValue": true,
        "relationName": undefined,
        "isGenerated": false,
        "isUpdatedAt": false
      },
      {
        "name": "serviceDetail",
        "type": "ServiceDetail",
        "isRequired": false,
        "isId": false,
        "isUnique": false,
        "hasDefaultValue": false,
        "relationName": "ServiceToServiceDetail",
        "isGenerated": false,
        "isUpdatedAt": false
      }
    ]
  }
}; 