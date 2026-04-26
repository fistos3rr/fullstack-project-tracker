import { useSearchParams } from  "react-router-dom";

export function usePaginationFromUrl(defaultLimit=10) {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || defaultLimit);
    const offset = (page - 1) * limit;

    const setPage = (newPage: number) => {
        setSearchParams({ page: String(newPage), limit: String(limit) });
    };

    const setLimit = (newLimit: number) => {
        setSearchParams({ page: '1', limit: String(newLimit) });
    };

    return {
        page,
        limit,
        offset,
        setPage,
        setLimit,
    };
}