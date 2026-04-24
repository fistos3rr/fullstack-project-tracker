import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useReadProjectsApiV1ProjectsGet as useReadProjects,
  useDeleteProjectApiV1ProjectsIdDelete as useDeleteProject,
} from '../api/index';
import type { ProjectRead } from '../api/index';

export function ProjectList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Читаем параметры из URL, по умолчанию page=1 и limit=10
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  // Для API обычно нужно offset = (page - 1) * limit
  const offset = (page - 1) * limit;

  const { data, isLoading, error } = useReadProjects({
    skip: offset,   // или offset: offset
    limit: limit,
  });

  const deleteMutation = useDeleteProject();

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить проект?')) return;
    await deleteMutation.mutateAsync({ id: String(id) });
    queryClient.invalidateQueries({ queryKey: ['/api/v1/projects'] });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage), limit: String(limit) });
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error.message}</p>;

  const projects: ProjectRead[] = data?.data.data ?? [];
  const total = data?.data.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1>Проекты</h1>
      <button onClick={() => navigate('/projects/new')} style={{ marginBottom: 16 }}>
        + Новый проект
      </button>

      {projects.length === 0 ? (
        <p>Нет проектов</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {projects.map((p) => (
              <li key={p.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 6 }}>
                <strong style={{ fontSize: 18 }}>{p.name}</strong>
                <p>{p.description || 'Без описания'}</p>
                <p>Статус: {p.status}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate(`/projects/${p.id}`)}>Открыть</button>
                  <button onClick={() => navigate(`/projects/${p.id}/edit`)}>Редактировать</button>
                  <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>Удалить</button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              ◀ Предыдущая
            </button>
            <span>
              Страница {page} из {totalPages || 1}
            </span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
              Следующая ▶
            </button>
          </div>

          {/* Опционально: выбор лимита на страницу */}
          <div style={{ marginTop: 12 }}>
            <label>
              Показывать на странице:
              <select
                value={limit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  setSearchParams({ page: '1', limit: String(newLimit) });
                }}
                style={{ marginLeft: 8 }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </>
      )}
    </div>
  );
}