import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useReadProjectByIdApiV1ProjectsIdGet as useGetProjectById,
  useCreateProjectApiV1ProjectsPost as useCreateProject,
  useUpdateProjectApiV1ProjectsIdPatch as useUpdateProject,
  ProjectStatus,
} from '../api/index';
import type { ProjectCreate, ProjectUpdate } from '../api/index';

export function useProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const projectQuery = useGetProjectById(id!, {
    query: { enabled: !!id }, // запрос выполнится только если id определён
  });
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.planned);

  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = false;
  }, [id]);

  useEffect(() => {
    if (isEdit && projectQuery.isSuccess && projectQuery.data?.data && !initialized.current) {
      const project = projectQuery.data.data;
      setName(project.name ?? '');
      setDescription(project.description ?? '');
      setStatus(project.status ?? ProjectStatus.planned);
      initialized.current = true;
    }
  }, [isEdit, projectQuery.isSuccess, projectQuery.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description, status };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: String(id), data: payload as ProjectUpdate });
      } else {
        await createMutation.mutateAsync({ data: payload as ProjectCreate });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/v1/projects'] });
      navigate(isEdit ? `/projects/${id}` : '/projects');
    } catch (err) {
      alert('Ошибка сохранения: ' + (err as Error).message);
      navigate('/projects');
    }
  };

  const handleCancel = () => navigate('/projects');

  const isLoading = isEdit && projectQuery.isLoading;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    name,
    description,
    status,
    setName,
    setDescription,
    setStatus,
    isEdit,
    isLoading,
    isSubmitting,
    handleSubmit,
    handleCancel,
  };
}