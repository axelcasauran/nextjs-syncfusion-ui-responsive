export const getColSpanClass = (colSpan: number | undefined, totalColumns: number) => {
    if (!colSpan) return 'col-span-1';
    
    const validColSpans: Record<number, string> = {
        1: 'col-span-1',
        2: 'col-span-2',
        3: 'col-span-3',
        4: 'col-span-4',
        5: 'col-span-5',
        6: 'col-span-6'
    };

    return validColSpans[Math.min(colSpan, totalColumns)] || 'col-span-1';
};

export const getGridColsClass = (columns: number) => {
    const validColumns: Record<number, string> = {
        3: 'grid-cols-1 md:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-6'
    };

    return validColumns[columns] || 'grid-cols-1 md:grid-cols-3';
};