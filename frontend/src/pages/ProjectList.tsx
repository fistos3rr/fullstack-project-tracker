import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useReadProjectsApiV1ProjectsGet,
  useDeleteProjectApiV1ProjectsIdDelete,
} from '../api/index';
import type { ProjectRead } from '../api/index';

export function ProjectList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useReadProjectsApiV1ProjectsGet();
  const deleteMutation = useDeleteProjectApiV1ProjectsIdDelete();

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить проект?')) return;
    await deleteMutation.mutateAsync({ id: String(id) });
    queryClient.invalidateQueries({ queryKey: ['/api/v1/projects'] });
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error.message}</p>;

  const projects: ProjectRead[] = data?.data.data ?? [];

  return (
    <div>
      <h1>Проекты</h1>
      <button onClick={() => navigate('/projects/new')} style={{ marginBottom: 16 }}>
        + Новый проект
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {projects.map((p) => (
          <li key={p.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 6 }}>
            <strong style={{ fontSize: 18 }}>{p.name}</strong>
            <p>{p.description || 'Без описания'}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate(`/projects/${p.id}`)}>Открыть</button>
              <button onClick={() => navigate(`/projects/${p.id}/edit`)}>Редактировать</button>
              <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}