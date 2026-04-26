import { useDeleteProject } from '../api';

interface UseProjectDeletePaginationProps {
    currentPage: number;
    currentLimit: number;
    totalProjectsBeforeDelete: number;
    onPageChange: (newPage: number) => void;
    listRefetch: () => void;
}

export function useProjectDeleteWithPagination({
    currentPage,
    totalProjectsBeforeDelete,
    onPageChange,
    listRefetch,
}: UseProjectDeletePaginationProps) {
    const deleteMutation = useDeleteProject();

    const handleDelete = async (id: string) => {
        if (!confirm('Delete project?')) return;

        const isLastOnCurrentPage = totalProjectsBeforeDelete === 1;
        const isNotFirstPage = currentPage > 1;

        await deleteMutation.mutateAsync({ id: String(id) });
    
        await listRefetch();

        if (isLastOnCurrentPage && isNotFirstPage) {
        onPageChange(currentPage - 1);
        }
    };

    return {
        deleteProject: handleDelete,
        isDeleting: deleteMutation.isPending,
    };
}