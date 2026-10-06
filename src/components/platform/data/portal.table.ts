import {
    columnFilteringFeature, columnVisibilityFeature, globalFilteringFeature,
    rowPaginationFeature, rowSortingFeature, rowSelectionFeature, createFilteredRowModel,
    createPaginatedRowModel, createSortedRowModel, tableFeatures,
    filterFn_includesString, filterFn_inNumberRange, filterFn_equals,
    filterFn_arrIncludes, filterFn_weakEquals, filterFn_inDateRange,
    sortFn_alphanumeric, sortFn_basic, sortFn_datetime, sortFn_text,
} from "@tanstack/react-table";

export const portalTablePageSizes = [5, 10, 20, 50, 100];

export const portalTableFeatures = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    rowSelectionFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: {
        includesString: filterFn_includesString,
        inNumberRange: filterFn_inNumberRange,
        equals: filterFn_equals,
        arrIncludes: filterFn_arrIncludes,
        weakEquals: filterFn_weakEquals,
        inDateRange: filterFn_inDateRange,
    },
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        basic: sortFn_basic,
        datetime: sortFn_datetime,
        text: sortFn_text,
    },
    columnMeta: {} as {label?: string},
});
