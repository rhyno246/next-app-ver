import { useState } from "react";
import { useDebounce } from "use-debounce";
type Props = {
    defaultPage?: number;
    defaultPageSize?: number;
};

export const usePagination = ({ defaultPage = 1, defaultPageSize = 10 }: Props = {}) => {
    const [page, setPage] = useState(defaultPage);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1); // ✅ reset page khi search
    };

    const handlePageChange = (newPage: number) => setPage(newPage);
    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    return {
        page,
        pageSize,
        search,
        debouncedSearch,
        handleSearch,
        handlePageChange,
        handlePageSizeChange,
    };
};