import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useReadProjectList,
  useDeleteProject,
} from '../api/index';

export function useProjectList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const offset = (page - 1) * limit;

  const dataQuery = useReadProjectList({
    skip: offset,
    limit: limit,
  }, {
      query: {
        retry: false
      }
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage), limit: String(limit) });
  };

  const deleteMutation = useDeleteProject();

  const handleDelete = async (id: string) => {
    if (!confirm('Delete project?')) return;
    const isLastOnCurrentPage = projects.length === 1;
    const isNotFirstPage = page > 1;
    await deleteMutation.mutateAsync({ id: String(id) });

    if (isLastOnCurrentPage && isNotFirstPage) {
      handlePageChange(page - 1);
    } else {
      await dataQuery.refetch();
    }
  };

  const { data, isLoading, error } = dataQuery;
  
  const isNotFound = error && (
    (error as any)?.status === 404 ||
    (error as any)?.response?.status === 404 ||
    (error as any)?.originalStatus === 404
  );

  const handleLimitChange = (newLimit: number) => {
    setSearchParams({ page: '1', limit: String(newLimit) });
  };

  const goToCreate = () => navigate('/projects/new');
  const goToDetails = (id: string) => navigate(`/projects/${id}`);
  const goToEdit = (id: string) => navigate(`/projects/${id}/edit`);

  const projects = isNotFound ? [] : (data?.data.data ?? []);
  const total = isNotFound ? 0 : (data?.data.count ?? 0);
  const finalError = isNotFound ? null : error;
  const totalPages = Math.ceil(total / limit);

  return {
    projects,
    totalPages,
    isLoading,
    error: finalError,
    isDeleting: deleteMutation.isPending,
    page,
    limit,
    handleDelete,
    handlePageChange,
    handleLimitChange,
    goToCreate,
    goToDetails,
    goToEdit,
  };
}