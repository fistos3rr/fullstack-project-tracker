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

export function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  // Запрос выполняется только если есть id (передаём undefined иначе)
  const projectRes = useGetProjectById(isEdit ? id : undefined);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  // При создании статус по умолчанию – первый из enum
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(() =>
    isEdit ? ProjectStatus.planned : ProjectStatus.planned
  );

  const initialized = useRef(false);

  // Сброс флага при смене id
  useEffect(() => {
    initialized.current = false;
  }, [id]);

  // Заполнение формы при редактировании (только один раз)
  useEffect(() => {
    if (isEdit && projectRes.isSuccess && projectRes.data?.data && !initialized.current) {
      const project = projectRes.data.data;
      setName(project.name ?? '');
      setDescription(project.description ?? '');
      setStatus(project.status ?? ProjectStatus.planned);
      initialized.current = true;
    }
  }, [isEdit, projectRes.isSuccess, projectRes.data]);

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
      if (isEdit) {
        navigate('/projects/' + id);
      } else {
        navigate('/projects');
      }
    } catch (err) {
      alert('Ошибка сохранения: ' + (err as Error).message);
      navigate('/projects')
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>{isEdit ? 'Редактировать' : 'Создать'} проект</h2>
      <label>
        Название:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: 8 }}
        />
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
        Статус:
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          required
          style={{ display: 'block', width: '100%', padding: 8 }}
        >
          {Object.values(ProjectStatus).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          Сохранить
        </button>
        <button type="button" onClick={() => navigate('/projects')}>
          Отмена
        </button>
      </div>
    </form>
  );
}