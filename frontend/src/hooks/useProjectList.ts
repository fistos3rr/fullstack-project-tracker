import { usePaginationFromUrl } from "./usePaginationFromUrl";
import { useProjectListQuery } from "./useProjectListQuery";
import { useProjectDeleteWithPagination } from "./useProjectDeletePagination";
import { useProjectNavigation } from "./useProjectNavigation";

export function useProjectList() {
    const { page, limit, offset, setPage, setLimit } = usePaginationFromUrl();
    const { projects, total, isLoading, error, refetch } = useProjectListQuery(
        { skip: offset, limit }
    );
    const {goToCreate, goToDetailsId, goToEditId} = useProjectNavigation();

    const { deleteProject: handleDelete, isDeleting } = useProjectDeleteWithPagination({
        currentPage: page,
        currentLimit: limit,
        totalProjectsBeforeDelete: projects.length,
        onPageChange: setPage,
        listRefetch: refetch,
    });

    const totalPages = Math.ceil(total / limit);

    return {
        projects,
        totalPages,
        isLoading,
        error,
        isDeleting,
        page,
        limit,
        handleDelete,
        handlePageChange: setPage,
        handleLimitChange: setLimit,
        goToCreate,
        goToDetails: goToDetailsId,
        goToEdit: goToEditId,

    }
}