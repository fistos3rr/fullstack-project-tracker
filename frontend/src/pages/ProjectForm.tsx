import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useReadProjectByIdApiV1ProjectsIdGet,
  useCreateProjectApiV1ProjectsPost,
  useUpdateProjectApiV1ProjectsIdPatch,
} from '../api/index';
import type { ProjectCreate, ProjectUpdate } from '../api/index';

export function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const projectRes = useReadProjectByIdApiV1ProjectsIdGet(id!);
  const createMutation = useCreateProjectApiV1ProjectsPost();
  const updateMutation = useUpdateProjectApiV1ProjectsIdPatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (projectRes?.data) {
      setName(projectRes.data?.data.name ?? '');
      setDescription(projectRes.data?.data.description ?? '');
      setStatus(projectRes.data?.data.status ?? '');
    }
  }, [projectRes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description, status };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: String(id), data: payload as ProjectUpdate });
      } else {
        await createMutation.mutateAsync({  data: payload as ProjectCreate });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/v1/projects'] });
      navigate('/');
    } catch (err) {
      alert('Ошибка сохранения: ' + (err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>{isEdit ? 'Редактировать' : 'Создать'} проект</h2>
      <label>
        Название:
        <input value={name} onChange={(e) => setName(e.target.value)} required style={{ display: 'block', width: '100%', padding: 8 }} />
      </label>
      <label>
        Описание:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ display: 'block', width: '100%', padding: 8 }}
        />
      </label>
      <label>
        Status:
        <textarea
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          rows={4}
          style={{ display: 'block', width: '100%', padding: 8 }}
        />
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          Сохранить
        </button>
        <button type="button" onClick={() => navigate('/projects')}>Отмена</button>
      </div>
    </form>
  );
}