/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { TextAreaComponent } from '@syncfusion/ej2-react-inputs';
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';

interface ResponsiveValue {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
}

interface FormFieldProps<T extends FieldValues> {
    name: keyof T;
    label?: string;
    type?: 'text' | 'combo' | 'datetime' | 'checkbox' | 'textarea';
    textareaRow?: 1 | 2 | 3;
    required?: boolean;
    placeholder?: string;
    options?: any[];
    control?: Control<T>;
    error?: any;
    colSpan?: ResponsiveValue;
    cssClass?: string;
    hidden?: boolean;
}

export interface FormRowProps<T extends FieldValues> {
    fields: FormFieldProps<T>[];
    columns?: ResponsiveValue;
}

const getResponsiveClass = (value: ResponsiveValue | undefined, prefix: string) => {
    if (!value) return '';
    return Object.entries(value)
        .map(([breakpoint, cols]) => {
            switch (breakpoint) {
                case 'xs': return `${prefix}-${cols}`;
                case 'sm': return `sm:${prefix}-${cols}`;
                case 'md': return `md:${prefix}-${cols}`;
                case 'lg': return `lg:${prefix}-${cols}`;
                default: return '';
            }
        })
        .join(' ');
};

const FormField = <T extends FieldValues>({ field, control }: { field: FormFieldProps<T>; control: Control<T>; error: any }) => {
    switch (field.type) {
        case 'text':
            return (
                <Controller
                    name={field.name as Path<T>}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextBoxComponent
                            value={value}
                            change={(e) => onChange(e.value)}
                            type="text"
                            placeholder={field.placeholder}
                        />
                    )}
                />
            );

        case 'combo':
            return (
                <Controller
                    name={field.name as Path<T>}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <ComboBoxComponent
                            value={value}
                            change={(e) => onChange(e.value)}
                            dataSource={field.options}
                            allowFiltering={true}
                            filterType="Contains"
                        />
                    )}
                />
            );

        case 'datetime':
            return (
                <Controller
                    name={field.name as Path<T>}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <DateTimePickerComponent
                            value={value}
                            change={(e) => onChange(e.value)}
                            placeholder={field.placeholder || "MM/DD/YYYY hh:mm"}
                        />
                    )}
                />
            );

        case 'checkbox':
            return (
                <Controller
                    name={field.name as Path<T>}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <div className="flex items-center h-full pt-2">
                            <CheckBoxComponent
                                checked={value}
                                change={(e) => onChange(e.checked)}
                                label={field.label}
                            />
                        </div>
                    )}
                />
            );

        case 'textarea':
            return (
                <Controller
                    name={field.name as Path<T>}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextAreaComponent
                            value={value}
                            change={(e) => onChange(e.value)}
                            rows={field.textareaRow}
                            resizeMode="None"
                            placeholder={field.placeholder}
                            cssClass="w-full"
                        />
                    )}
                />
            );

        default:
            return null;
    }
};

const FormRow = <T extends FieldValues>({ fields, columns }: FormRowProps<T>) => {
    const gridClass = getResponsiveClass(columns, 'grid-cols');

    return (
        <div className={`grid gap-4 ${gridClass}`}>
            {fields.map((field) => {
                if(field.hidden) return null;
                const colSpanClass = getResponsiveClass(field.colSpan, 'col-span');

                return (
                    <div
                        key={field.name as string}
                        className={`flex flex-col gap-1 ${colSpanClass}`}
                    >
                        <label>
                            {field.label}
                            {field.required && (
                                <span className="text-red-600 dark:text-red-400 font-normal">*</span>
                            )}
                        </label>
                        {field.control && (
                            <FormField field={field} control={field.control} error={field.error} />
                        )}
                        {field.error && (
                            <p className="text-red-500 text-xs">{field.error.message}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export interface SyncfusionFormProps<T extends FieldValues> {
    rows: (FormRowProps<T> & {
        columns?: ResponsiveValue; spacing?: {
            x?: number;
            y?: number;
        };
        className?: string;
    })[];
    control: Control<T>;
    errors?: FieldErrors<T>;
    className?: string;
}

export const SyncfusionForm = <T extends FieldValues>({
    rows,
    control,
    errors,
    className
}: SyncfusionFormProps<T>) => {

    return (
        <div className={`space-y-4 text-xs font-medium leading-normal text-gray-700 dark:text-gray-200 ${className || ''}`}>
            {rows.map((row, index) => (
                <FormRow<T>
                    key={index}
                    columns={row.columns}
                    fields={row.fields.map(field => ({
                        ...field,
                        control,
                        error: errors?.[field.name as keyof T]
                    }))}
                />
            ))}
        </div>
    );
};