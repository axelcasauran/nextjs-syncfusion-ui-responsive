/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Card, CardContent } from '@reui/ui/card';
import { Skeleton } from '@reui/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDirective, ColumnsDirective, MultiColumnComboBoxComponent } from '@syncfusion/ej2-react-multicolumn-combobox';
import { FormRowProps, SyncfusionForm } from '@syncfusion/form/form';
import { SyncfusionGrid } from '@syncfusion/grid/grid';
import { saveChanges } from '@framework/components/save-changes';
import { gridAction } from '@framework/components/grid-actions';
import { ActionEventArgs, Action, PredicateModel, GridComponent } from '@syncfusion/ej2-react-grids';
import { API } from '@framework/helper/api';
import { FormSchema, FormSchemaData } from '../../forms/forms';
import { Toolbar } from '@syncfusion/toolbar/toolbar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    Service,
    ServiceDetailGridRow
} from '@/src/business-layer/church-management/models/prisma-types';

interface RecordPageProps {
    id: string;
    isLoading: boolean;
}

interface GridBatchChanges {
    addedRecords: ServiceDetailGridRow[];
    changedRecords: ServiceDetailGridRow[];
    deletedRecords: ServiceDetailGridRow[];
}

interface GridActionArgs extends Omit<ActionEventArgs, 'requestType'> {
    data?: ServiceDetailGridRow;
    rowData?: ServiceDetailGridRow;
    requestType?: Action;
    searchString?: string;
    currentFilterObject?: PredicateModel;
}

interface NewServiceDetailUser {
    firstName: string;
    lastName: string;
    id: string | null;
}

type NewServiceDetail = Omit<ServiceDetailGridRow, 'id' | 'serviceId' | 'user'> & {
    user?: NewServiceDetailUser;
};

interface GridRef extends GridComponent {
    getBatchChanges(): GridBatchChanges;
    selectedRowIndex: number;
    updateCell(rowIndex: number, field: string, value: unknown): void;
    saveCell(): void;
    hideSpinner(): void;
    addRecord(record: any): void;
}

interface ServiceResponse {
    result: Service;
    error?: string;
}

interface FormDetailPage {
    result: ServiceDetailGridRow[];
    count: number;
}

interface ErrorResponse {
    error: string;
}

interface UserComboBoxItem {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
}

interface ComboBoxChangeEvent {
    itemData: {
        value: string;
    };
    item: {
        firstName: string;
        lastName: string;
        id: string;
    };
}

interface ToolbarClickArgs {
    text?: string;
    item?: {
        text: string;
    };
    cancel?: boolean;
}

const LoadingComponent = () => (
    <Card>
        <CardContent>
            <dl className="grid grid-cols-[auto_1fr] text-muted-foreground gap-3 text-sm mb-5">
                <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                    <dt className="flex md:w-64">
                        <Skeleton className="h-6 w-24" />
                    </dt>
                    <dd>
                        <Skeleton className="h-5 w-36" />
                    </dd>
                </div>
                <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                    <dt>
                        <Skeleton className="h-5 w-36" />
                    </dt>
                    <dd>
                        <Skeleton className="h-5 w-48" />
                    </dd>
                </div>
                <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                    <dt>
                        <Skeleton className="h-5 w-20" />
                    </dt>
                    <dd>
                        <Skeleton className="h-5 w-24" />
                    </dd>
                </div>
                <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                    <dt>
                        <Skeleton className="h-5 w-24" />
                    </dt>
                    <dd>
                        <Skeleton className="h-5 w-20" />
                    </dd>
                </div>
                <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                    <dt>
                        <Skeleton className="h-5 w-36" />
                    </dt>
                    <dd>
                        <Skeleton className="h-5 w-24" />
                    </dd>
                </div>
                <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                    <dt>
                        <Skeleton className="h-5 w-24" />
                    </dt>
                    <dd>
                        <Skeleton className="h-5 w-36" />
                    </dd>
                </div>
            </dl>
            <Skeleton className="h-9 w-32" />
        </CardContent>
    </Card>
);

LoadingComponent.displayName = 'LoadingComponent';

const RecordPage = ({ id, isLoading }: RecordPageProps) => {
    const router = useRouter();
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [user, setUser] = useState<UserComboBoxItem[]>([]);
    const [formDetailPage, setFormDetailPage] = useState<FormDetailPage>({
        result: [],
        count: 0
    });

    // Form initialization
    const form = useForm<FormSchemaData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: (id === 'new') ? undefined : id,
            name: "",
            location: "",
            type: "",
            startDate: new Date(),
            endDate: undefined,
            description: "",
            isActive: undefined,
        },
    });

    // Refs
    const formRef = useRef<HTMLFormElement>(null!);
    const gridRef = useRef<GridRef>(null);

    // Dropdown configuration
    const fields = { text: 'fullName', value: 'id' };

    // Load users for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/church-management/admin/volunteers');
                const data = await response.json();
                setUser(data.result || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Process incoming data to the form and grid
    const processRecordData = useCallback((data: Service | null) => {
        if (!data || typeof data !== 'object') {
            console.error("Invalid data received", data);
            toast.error("Received invalid data from server");
            return;
        }

        try {
            // Reset form with the data
            form.reset({
                id: data.id,
                name: data.name || "",
                location: data.location || "",
                type: data.type || "",
                startDate: new Date(data.startDate || new Date()),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                description: data.description || "",
                isActive: data.isActive
            });

            // Process service details for the grid
            if (data.serviceDetail && Array.isArray(data.serviceDetail) && data.serviceDetail.length > 0) {
                try {
                    // Cast to any first to handle the potentially inconsistent API data
                    const processedDetails = (data.serviceDetail as any[]).map(detail => {
                        // Create a properly typed grid row by constructing it explicitly
                        const gridRow: ServiceDetailGridRow = {
                            id: detail.id || '',
                            serviceId: detail.serviceId || '',
                            userId: detail.userId || '',
                            role: detail.role || '',
                            description: detail.description || '',
                            notes: detail.notes || '',
                            isAccepted: detail.isAccepted || false,
                            isRequired: detail.isRequired || true,
                            minutes: detail.minutes || null,
                            startDate: detail.startDate || null,
                            // Add any other required fields from ServiceDetailGridRow
                            user: {
                                firstName: detail.user?.firstName || '',
                                lastName: detail.user?.lastName || '',
                                id: detail.user?.id || ''
                            },
                            // Add a reference to the parent service to satisfy the type
                            service: {
                                id: data.id,
                                name: data.name || '',
                            } as unknown as Service // Use type assertion to avoid property mismatch errors
                        };

                        return gridRow;
                    });

                    setFormDetailPage({
                        result: processedDetails,
                        count: processedDetails.length
                    });
                } catch (error) {
                    console.error("Error processing service details:", error);
                    setFormDetailPage({ result: [], count: 0 });
                }
            } else {
                setFormDetailPage({
                    result: [],
                    count: 0
                });
            }
        } catch (error) {
            console.error("Error processing data:", error);
            toast.error("Error initializing form data");
        }
    }, [form]);

    // Fetch a record by ID
    const fetchRecord = useCallback(async (recordId: string) => {
        try {
            const response = await fetch(`${API.service.get}/${recordId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch record: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data || !data.result) {
                console.error("Invalid data received from API", data);
                toast.error("Failed to load service data");
                return;
            }

            processRecordData(data.result);
        } catch (error) {
            console.error('Error fetching record:', error);
            toast.error(`Failed to load record: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [processRecordData]);

    // Load record by index from selected records
    const loadRecord = useCallback((index: number) => {
        if (selectedRecords && selectedRecords.length > index) {
            fetchRecord(selectedRecords[index]);
        }
    }, [selectedRecords, fetchRecord]);

    // Initialize record from URL ID
    useEffect(() => {
        if (id && id !== 'new') {
            try {
                const urlDecoded = decodeURIComponent(id);
                const base64Decoded = atob(urlDecoded);
                const ids = JSON.parse(base64Decoded) as string[];

                if (!Array.isArray(ids) || ids.length === 0) {
                    throw new Error('Invalid ID format');
                }

                setSelectedRecords(ids);
                // Using setTimeout to ensure this happens after state is updated
                setTimeout(() => {
                    if (ids.length > 0) {
                        fetchRecord(ids[0]);
                    }
                }, 0);
            } catch (error) {
                console.error('Error decoding IDs:', error);
                toast.error('Error loading record: Invalid ID format');
            }
        }
    }, [id, fetchRecord]);

    // GRID & UI CALLBACKS

    // Update grid records
    const updateRecords = useCallback(async () => {
        if (gridRef.current) {
            await saveChanges<ServiceDetailGridRow, FormDetailPage>({
                gridRef: gridRef as React.RefObject<GridRef>,
                setFormPage: setFormDetailPage,
                apiGet: API.service.get,
                apiUpdate: API.service.post,
                Entity: API.service.title
            });
        }
    }, []);

    // Save the record
    const onSave = useCallback(async () => {
        try {
            const gridChanges = gridRef.current?.getBatchChanges() || {
                addedRecords: [],
                changedRecords: [],
                deletedRecords: []
            };

            const typedGridChanges = gridChanges as GridBatchChanges;
            const isValid = await form.trigger();

            if (!isValid) {
                toast.error('Please fix form errors before saving');
                return;
            }

            const formData = form.getValues();
            const isNewRecord = id === 'new' || formData.id == null;

            const masterData = isNewRecord
                ? { addedRecords: [{ ...formData, id: undefined }] }
                : { changedRecords: [formData] };

            const cleanedGridChanges = {
                ...typedGridChanges,
                addedRecords: typedGridChanges.addedRecords.map(({
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    id: removedId,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    serviceId: removedServiceId,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    user: removedUser,
                    ...cleanItem
                }) => cleanItem as NewServiceDetail),
                changedRecords: typedGridChanges.changedRecords.map(({
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    user: removedUser,
                    ...cleanItem
                }) => cleanItem)
            };

            const saveData = {
                ...masterData,
                details: cleanedGridChanges
            };

            const response = await fetch(`${API.service.post}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData)
            });

            if (!response.ok) {
                const errorData = await response.json() as ErrorResponse;
                throw new Error(`Failed to save data: ${errorData.error || response.statusText}`);
            }

            const responseData = await response.json() as ServiceResponse;

            if (!responseData || !responseData.result) {
                throw new Error("Server returned invalid data");
            }

            if (isNewRecord && responseData.result?.id) {
                const encodedIds = btoa(JSON.stringify([responseData.result.id]));
                const urlSafeIds = encodeURIComponent(encodedIds);
                window.history.replaceState(null, '', urlSafeIds);
            }

            processRecordData(responseData.result);
            toast.success('Record saved successfully');

        } catch (error) {
            console.error('Save failed:', error);
            toast.error(`Failed to save record: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [form, id, processRecordData]);

    // Grid action handlers
    const actionBegin = useCallback(async (args: GridActionArgs) => {
        await gridAction<FormDetailPage>({
            args,
            apiEndpoint: API.service.get,
            gridRef: gridRef as any,
            setData: setFormDetailPage
        });
    }, []);

    const toolbarClick = useCallback(async (args: ToolbarClickArgs) => {
        if (args?.text === 'Add' || args?.item?.text === 'Add') {
            args.cancel = true;
            const newRecord = {
                role: '',
                description: '',
                notes: '',
                minutes: null,
                userId: null,
                isAccepted: false,
                isRequired: true,
                user: {
                    firstName: '',
                    lastName: '',
                    id: null
                }
            };
            if (gridRef.current) {
                gridRef.current.addRecord(newRecord);
            }
        }
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        if (selectedRecords.length > newPage - 1) {
            loadRecord(newPage - 1);
            setPage(newPage);
        } else {
            console.error('Invalid page number:', newPage);
        }
    }, [selectedRecords, loadRecord]);

    // Component UI callbacks
    const userSelection = useCallback((data: ServiceDetailGridRow) => {
        return (
            <MultiColumnComboBoxComponent
                dataSource={user}
                value={data.userId}
                popupWidth={400}
                popupHeight={200}
                fields={fields}
                allowFiltering={true}
                filterType={'Contains'}
                change={(e: ComboBoxChangeEvent) => {
                    if (e.itemData && gridRef.current) {
                        try {
                            setTimeout(() => {
                                if (!gridRef.current) return;

                                const rowIndex = gridRef.current.selectedRowIndex;
                                data.user.firstName = e.item.firstName;
                                data.user.lastName = e.item.lastName;
                                data.user.id = e.itemData.value;

                                gridRef.current.updateCell(rowIndex, 'user.firstName', e.item.firstName);
                                gridRef.current.updateCell(rowIndex, 'user.lastName', e.item.lastName);
                                gridRef.current.updateCell(rowIndex, 'user.id', e.item.id);
                                gridRef.current.updateCell(rowIndex, 'userId', e.itemData.value);
                                gridRef.current.saveCell();
                            }, 0);
                        } catch (error) {
                            console.error('Error updating grid row:', error);
                        }
                    }
                }}>
                <ColumnsDirective>
                    <ColumnDirective field='firstName' header='First Name' width={120}></ColumnDirective>
                    <ColumnDirective field='lastName' header='Last Name' width={140}></ColumnDirective>
                </ColumnsDirective>
            </MultiColumnComboBoxComponent>
        );
    }, [user, fields]);

    const firstNameLastName = useCallback((data: ServiceDetailGridRow) => {
        if (data?.user == null) return <span></span>;
        return (
            <span>{data.user.firstName} {data.user.lastName}</span>
        );
    }, []);

    const roles = useMemo(() => [
        { role: 'Preacher' },
        { role: 'Host' },
        { role: 'Tech' },
        { role: 'Registration' },
        { role: 'Door keeper' },
        { role: 'Volunteer' }
    ], []);

    // FORM CONTENT
    const formRows: FormRowProps<FormSchemaData>[] = useMemo(() => [
        {
            columns: { xs: 1, sm: 2, md: 3, lg: 5 },
            fields: [
                {
                    name: 'id',
                    hidden: true
                } as const,
                {
                    name: 'name',
                    label: 'Name',
                    type: "text" as const,
                    required: true,
                    placeholder: 'Enter a name',
                    control: form.control,
                    colSpan: { xs: 1, sm: 2, md: 2, lg: 1 }
                } as const,
                {
                    name: 'description',
                    label: 'Description',
                    type: "text" as const,
                    placeholder: 'Provide a brief overview of the service/events',
                    control: form.control,
                    colSpan: { xs: 1, sm: 2, md: 2, lg: 3 }
                } as const,
                {
                    name: 'isActive',
                    label: 'Active Status',
                    type: "checkbox" as const,
                    control: form.control,
                    colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
                } as const
            ]
        },
        {
            columns: { xs: 1, sm: 2, md: 3, lg: 5 },
            fields: [
                {
                    name: 'type',
                    label: 'Type',
                    type: "combo" as const,
                    required: true,
                    options: ['Events', 'Services'],
                    control: form.control,
                    colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
                } as const,
                {
                    name: 'location',
                    label: 'Location',
                    type: 'text' as const,
                    required: true,
                    placeholder: 'Enter location',
                    control: form.control,
                    colSpan: { xs: 1, sm: 2, md: 2, lg: 2 }
                } as const,
                {
                    name: 'startDate',
                    label: 'Start Date',
                    type: "datetime" as const,
                    required: true,
                    control: form.control,
                    colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
                } as const,
                {
                    name: 'endDate',
                    label: 'End Date',
                    type: 'datetime' as const,
                    control: form.control,
                    colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
                } as const
            ]
        }
    ], [form.control]);

    // GRID CONTENT
    const detailGridColumns = useMemo(() => [
        { type: 'checkbox', width: 10, allowResizing: false, textAlign: 'Center' },
        { field: 'id', isPrimaryKey: true, visible: false },
        { field: 'serviceId', visible: false },
        { field: 'userId', visible: false },
        {
            field: 'user',
            template: firstNameLastName,
            headerText: 'Name',
            width: 55,
            editType: 'dropdownedit',
            editTemplate: userSelection
        },
        {
            field: 'role',
            headerText: 'Role',
            width: 40,
            editType: 'dropdownedit',
            edit: {
                params: {
                    dataSource: roles,
                    fields: { text: 'role', value: 'role' },
                    allowFiltering: true,
                    filterType: 'Contains'
                }
            },
            template: (args: any) => {
                if (args == null) return <span></span>;
                if (args?.role?.length == null) return <span></span>;
                return <div>{args?.role}</div>;
            }
        },
        { field: 'description', headerText: 'Description', width: 50, hideAtMedia: true },
        { field: 'notes', headerText: 'Notes', width: 50, hideAtMedia: true },
        { field: 'minutes', headerText: 'Minutes', width: 25, type: 'number', hideAtMedia: true },
        { field: 'isAccepted', headerText: 'Accepted', width: 25, type: 'boolean', displayAsCheckBox: true, editType: 'booleanedit', textAlign: 'Center', hideAtMedia: true },
        { field: 'isRequired', headerText: 'Required', width: 25, type: 'boolean', displayAsCheckBox: true, editType: 'booleanedit', textAlign: 'Center', hideAtMedia: true },
    ], [firstNameLastName, roles, userSelection]);

    // Grid toolbar options
    const toolbarOptionsDetails = ['Add', 'Delete', 'Cancel', 'Search'];

    // RENDER COMPONENT
    const Content = useCallback(() => {
        return (
            <div className="flex flex-col h-full">
                <Toolbar
                    showSave
                    showAddNew
                    showPager
                    title='Service and Events'
                    totalRecords={selectedRecords.length || 1}
                    currentPage={page}
                    selectedRecords={selectedRecords}
                    onPageChange={handlePageChange}
                    formRef={formRef}
                    onSave={onSave}
                    onAddNew={() => {
                        router.push('/admin/service-and-events/new');
                    }}
                />
                <div className="flex-1 overflow-auto">
                    <TabComponent>
                        <TabItemsDirective>
                            <TabItemDirective header={{ text: 'Details' }}
                                content={() => (
                                    <div className="pt-5">
                                        <form id="serviceForm" ref={formRef}>
                                            <SyncfusionForm
                                                rows={formRows}
                                                control={form.control}
                                                errors={form.formState.errors}
                                            />
                                            <br />
                                            <SyncfusionGrid
                                                columns={detailGridColumns}
                                                dataSource={formDetailPage}
                                                allowPaging={false}
                                                height={200}
                                                gridRef={gridRef as any}
                                                allowEdit={true}
                                                toolbarItems={toolbarOptionsDetails}
                                                onBatchSave={updateRecords}
                                                onActionBegin={actionBegin}
                                                onToolbarClick={toolbarClick}
                                            />
                                        </form>
                                    </div>
                                )}
                            ></TabItemDirective>
                            <TabItemDirective header={{ text: 'History' }}
                                content={() => (<></>)}
                            ></TabItemDirective>
                        </TabItemsDirective>
                    </TabComponent>
                </div>
            </div>
        );
    }, [actionBegin, detailGridColumns, formRows, handlePageChange, page, onSave, router, selectedRecords, updateRecords, toolbarClick, toolbarOptionsDetails, formDetailPage, form.control, form.formState.errors]);

    return (
        <>
            {isLoading || !id ? <LoadingComponent /> : <Content />}
        </>
    );
};

export default RecordPage;
