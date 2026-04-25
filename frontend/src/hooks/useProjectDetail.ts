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

  const projectQuery = useReadProjectById(id!);
  if (projectQuery.isError) {
      navigate("/projects");
  }
  const logsQuery = useReadProjectLogs(id!);
  const commentsQuery = useReadProjectComments(id!);
  const createCommentMutation = useCreateProjectComment();

  const [content, setContent] = useState('');

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

  const project = projectQuery.data?.data;
  const logs = logsQuery.data?.data?.data ?? [];
  const comments = commentsQuery.data?.data?.data ?? [];
  const isLoading = projectQuery.isLoading;
  const isSubmitting = createCommentMutation.isPending;

  return {
    project,
    logs,
    comments,
    isLoading,
    isSubmitting,
    error: projectQuery.error || logsQuery.error || commentsQuery.error,
    content,
    setContent,
    handleAddComment,
    goBack,
    goToEdit,
  };
}