/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormRowProps, SyncfusionForm } from '@syncfusion/form/form';
import { useCallback, useMemo, useImperativeHandle, forwardRef, JSX } from 'react';
import { z } from 'zod';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'datetime' | 'checkbox' | 'combo' | 'textarea';
  required?: boolean;
  hidden?: boolean;
  placeholder?: string;
  options?: string[] | { [key: string]: string }[];
  colSpan?: { xs: number; sm: number; md: number; lg: number };
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface FormLayout {
  columns: { xs: number; sm: number; md: number; lg: number };
  fields: FormField[];
}

export interface GenericFormProps<T> {
  id?: string;
  initialData?: T | null;
  formRef?: React.RefObject<HTMLFormElement>;
  schema: z.ZodType<any>;
  layouts: FormLayout[];
  onDataProcessed?: (data: T) => void;
  onFormReady?: (methods: GenericFormMethods<T>) => void;
}

export interface GenericFormMethods<T> {
  getValues: () => T;
  trigger: () => Promise<boolean>;
  reset: (data: T) => void;
  setValue: (name: string, value: any) => void;
}

function GenericRecordFormInner<T extends Record<string, any>>(
  { id = 'new', initialData, formRef, schema, layouts, onDataProcessed, onFormReady }: GenericFormProps<T>,
  ref: React.ForwardedRef<GenericFormMethods<T>>
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: initialData as any || {},
  });

  // Map our field types to SyncfusionForm supported types
  const mapFieldType = (type: string): 'text' | 'datetime' | 'checkbox' | 'combo' | 'textarea' => {
    switch (type) {
      case 'number':
      case 'date':
        return 'text';
      case 'datetime':
      case 'checkbox':
      case 'combo':
      case 'textarea':
        return type;
      default:
        return 'text';
    }
  };

  // Generate form rows from layouts
  const formRows = useMemo(() => {
    return layouts.map(layout => {
      return {
        columns: layout.columns,
        fields: layout.fields.map(field => {
          // Create a base field with common properties
          const baseField: any = {
            name: field.name as any,
            label: field.label,
            type: mapFieldType(field.type),
            required: field.required,
            hidden: field.hidden,
            placeholder: field.placeholder,
            colSpan: field.colSpan,
            control: form.control,
          };

          // Add additional properties based on field type
          if (field.min !== undefined) baseField.min = field.min;
          if (field.max !== undefined) baseField.max = field.max;
          if (field.minLength !== undefined) baseField.minLength = field.minLength;
          if (field.maxLength !== undefined) baseField.maxLength = field.maxLength;

          if (field.type === 'combo' && field.options) {
            return {
              ...baseField,
              options: field.options,
            };
          }

          return baseField;
        }),
      };
    }) as FormRowProps<T>[];
  }, [layouts, form.control]);

  // Reset form with new data
  const resetForm = useCallback((data: T) => {
    form.reset(data);
    
    if (onDataProcessed) {
      onDataProcessed(form.getValues() as T);
    }
  }, [form, onDataProcessed]);

  // Set a specific form value
  const setValue = useCallback((name: string, value: any) => {
    form.setValue(name as any, value);
  }, [form]);

  // Expose form methods via ref
  const methods = useMemo<GenericFormMethods<T>>(() => ({
    getValues: () => form.getValues() as T,
    trigger: form.trigger,
    reset: resetForm,
    setValue: setValue
  }), [form, resetForm, setValue]);

  // Expose form methods via ref
  useImperativeHandle(ref, () => methods, [methods]);

  // Expose form methods via callback
  useEffect(() => {
    if (onFormReady) {
      onFormReady(methods);
    }
  }, [methods, onFormReady]);

  // Set initial values when data changes
  useEffect(() => {
    if (initialData) {
      resetForm(initialData);
    }
  }, [initialData, resetForm]);

  return (
    <form id={`${id}-form`} ref={formRef}>
      <SyncfusionForm
        rows={formRows}
        control={form.control}
        errors={form.formState.errors}
      />
    </form>
  );
}

// Add the useEffect import
import { useEffect } from 'react';

export const GenericRecordForm = forwardRef(GenericRecordFormInner) as <T extends Record<string, any>>(
  props: GenericFormProps<T> & { ref?: React.ForwardedRef<GenericFormMethods<T>> }
) => JSX.Element; 