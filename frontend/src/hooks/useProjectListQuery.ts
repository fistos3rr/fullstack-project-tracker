import { useReadProjectList } from "../api/index";

interface UseProjectListQueryProps {
    skip: number;
    limit: number;
}

export function useProjectListQuery({ skip, limit }: UseProjectListQueryProps ) {
    const query = useReadProjectList (
        { skip, limit }
    );

    const projects = query.data?.data.data ?? [];
    const total = query.data?.data.count ?? 0;
    const error = query.error;

    return {
        projects,
        total,
        isLoading: query.isLoading,
        error,
        refetch: query.refetch
    };
}