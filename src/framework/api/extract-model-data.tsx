/* eslint-disable @typescript-eslint/no-explicit-any */
import { modelFields } from "../model/fields";

export const extractModelData = (data: any, model: keyof typeof modelFields) => {
  const fields = modelFields[model];
  if (!data) {
    throw new Error('No data provided');
  }
  // Handle both direct data and nested data.body.value structure
  const dataToExtract = data.body?.value || data.data;

  // Create object with only the fields we want
  return Object.fromEntries(
    fields
      .filter(field => field in dataToExtract)
      .map(field => [field, dataToExtract[field]])
  );
}