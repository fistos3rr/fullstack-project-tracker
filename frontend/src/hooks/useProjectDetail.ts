// hooks/useProjectDetail.ts
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useReadProjectByIdApiV1ProjectsIdGet as useReadProjectById,
  useReadProjectLogsApiV1ProjectsProjectIdLogsGet as useReadProjectLogs,
  useReadProjectCommentsApiV1ProjectsProjectIdCommentsGet as useReadProjectComments,
  useCreateProjectCommentApiV1ProjectsProjectIdCommentsPost as useCreateProjectComment,
} from '../api/index';
import type { ProjectCommentCreate } from '../api/index';

export function useProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Данные
  const projectQuery = useReadProjectById(id!);
  const logsQuery = useReadProjectLogs(id!);
  const commentsQuery = useReadProjectComments(id!);
  const createCommentMutation = useCreateProjectComment();

  // Локальное состояние для формы
  const [content, setContent] = useState('');

  // Действия
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createCommentMutation.mutateAsync({
      projectId: String(id),
      data: { content } as ProjectCommentCreate,
    });

    setContent('');
    await commentsQuery.refetch();
  };

  const goBack = () => navigate('/projects');
  const goToEdit = () => navigate(`/projects/${id}/edit`);

  // Вычисляемые значения для удобства
  const project = projectQuery.data?.data;
  const logs = logsQuery.data?.data?.data ?? [];
  const comments = commentsQuery.data?.data?.data ?? [];
  const isLoading = projectQuery.isLoading;
  const isSubmitting = createCommentMutation.isPending;

  return {
    // Данные
    project,
    logs,
    comments,
    // Состояния загрузки/ошибок
    isLoading,
    isSubmitting,
    error: projectQuery.error || logsQuery.error || commentsQuery.error,
    // Форма
    content,
    setContent,
    // Колбэки
    handleAddComment,
    goBack,
    goToEdit,
  };
}