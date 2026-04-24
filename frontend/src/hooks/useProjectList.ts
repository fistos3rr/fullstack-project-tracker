// hooks/useProjectList.ts
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useReadProjectsApiV1ProjectsGet as useReadProjects,
  useDeleteProjectApiV1ProjectsIdDelete as useDeleteProject,
} from '../api/index';

export function useProjectList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Чтение параметров пагинации из URL
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const offset = (page - 1) * limit;

  // API запросы
  const { data, isLoading, error } = useReadProjects({
    skip: offset,
    limit: limit,
  });
  const deleteMutation = useDeleteProject();

  // Обработчики
  const handleDelete = async (id: string) => {
    if (!confirm('Удалить проект?')) return;
    await deleteMutation.mutateAsync({ id: String(id) });
    queryClient.invalidateQueries({ queryKey: ['/api/v1/projects'] });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage), limit: String(limit) });
  };

  const handleLimitChange = (newLimit: number) => {
    setSearchParams({ page: '1', limit: String(newLimit) });
  };

  const goToCreate = () => navigate('/projects/new');
  const goToDetails = (id: string) => navigate(`/projects/${id}`);
  const goToEdit = (id: string) => navigate(`/projects/${id}/edit`);

  // Вычисляемые данные для представления
  const projects = data?.data.data ?? [];
  const total = data?.data.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    // Данные
    projects,
    total,
    totalPages,
    // Состояния
    isLoading,
    error,
    isDeleting: deleteMutation.isPending,
    // Параметры пагинации
    page,
    limit,
    // Колбэки
    handleDelete,
    handlePageChange,
    handleLimitChange,
    goToCreate,
    goToDetails,
    goToEdit,
  };
}