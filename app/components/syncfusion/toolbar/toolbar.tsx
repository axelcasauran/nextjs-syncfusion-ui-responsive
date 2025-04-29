/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export interface ToolbarProps {
    showAddNew?: boolean;
    showOpen?: boolean;
    showSave?: boolean;
    showDelete?: boolean;
    showSearch?: boolean;
    showPager?: boolean;
    title?: string;
    onAddNew?: () => void;
    onOpen?: () => void;
    onSave?: () => void;
    onDelete?: () => void;
    onSearch?: (searchText: string) => void;
    currentPage?: number;
    totalRecords?: number;
    selectedRecords?: any[];
    onPageChange?: (page: number) => void;
    formRef?: React.RefObject<HTMLFormElement>;
    gridRef?: any;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    showAddNew,
    showOpen,
    showSave,
    showDelete,
    title,
    showPager,
    onAddNew,
    onOpen,
    onSave,
    onDelete,
    currentPage = 1,
    totalRecords = 0,
    onPageChange,
    formRef,
    gridRef
}) => {
    const handleSave = () => {
        if (formRef?.current) {
            formRef.current.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            );
        }
    };

    const getPageRange = (currentPage: number, totalRecords: number) => {
        if (totalRecords === 0) return '0/0';
        const start = (currentPage - 1) + 1;
        const end = Math.min(currentPage, totalRecords);
        return `${start}-${end}/${totalRecords}`;
    };

    return (
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
                {/* Title - hidden on mobile */}
                {title && (
                    <div className="hidden md:block">
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                )}

                <div className="flex-1" />

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {showAddNew && (
                        <>
                            <div className="block md:hidden">
                                <ButtonComponent
                                    iconCss="e-icons e-plus"
                                    onClick={onAddNew}
                                    cssClass="e-primary"
                                />
                            </div>
                            <div className="hidden md:block">
                                <ButtonComponent
                                    iconCss="e-icons e-plus"
                                    onClick={onAddNew}
                                    content="New"
                                    cssClass="e-primary"
                                />
                            </div>
                        </>
                    )}

                    {showSave && (
                        <>
                            <div className="block md:hidden">
                                <ButtonComponent
                                    iconCss="e-icons e-save"
                                    onClick={handleSave}
                                    cssClass="e-success"
                                />
                            </div>
                            <div className="hidden md:block">
                                <ButtonComponent
                                    iconCss="e-icons e-save"
                                    onClick={handleSave}
                                    content="Save"
                                    cssClass="e-success"
                                />
                            </div>
                        </>
                    )}
                    {showSave && (
                        <>
                            <div className="block md:hidden">
                                <ButtonComponent
                                    iconCss="e-icons e-undo"
                                    onClick={handleSave}
                                    cssClass="e-outline"
                                />
                            </div>
                            <div className="hidden md:block">
                                <ButtonComponent
                                    iconCss="e-icons e-undo"
                                    onClick={handleSave}
                                    content="Cancel"
                                    cssClass="e-outline"
                                />
                            </div>
                        </>
                    )}
                    {showSave && (
                        <>
                            <div className="block md:hidden">
                                <ButtonComponent
                                    iconCss="e-icons e-trash"
                                    onClick={handleSave}
                                    cssClass="e-warning"
                                />
                            </div>
                            <div className="hidden md:block">
                                <ButtonComponent
                                    iconCss="e-icons e-trash"
                                    onClick={handleSave}
                                    content="Delete"
                                    cssClass="e-outline e-warning"
                                />
                            </div>
                        </>
                    )}

                    {showPager && (
                        <div className="hidden md:flex items-center gap-2">
                            <ButtonComponent
                                iconCss="e-icons e-chevron-left"
                                cssClass={`e-primary ${currentPage <= 1 ? 'e-disabled' : ''}`}
                                onClick={() => onPageChange?.(currentPage - 1)}
                                disabled={currentPage <= 1}
                            />

                            <span className="text-sm text-gray-600 min-w-[80px] text-center">
                                {getPageRange(currentPage, totalRecords)}
                            </span>

                            <ButtonComponent
                                iconCss="e-icons e-chevron-right"
                                cssClass={`e-primary ${currentPage >= totalRecords ? 'e-disabled' : ''}`}
                                onClick={() => onPageChange?.(currentPage + 1)}
                                disabled={currentPage >= totalRecords}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};