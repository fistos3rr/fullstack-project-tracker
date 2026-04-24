import type { ProjectRead } from '../api';

interface ProjectListViewProps {
  projects: ProjectRead[];
  totalPages: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isDeleting?: boolean;
  error: Error | null;
  onDelete: (id: string) => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onCreate: () => void;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
}

export function ProjectListView({
  projects,
  totalPages,
  page,
  limit,
  isLoading,
  isDeleting,
  error,
  onDelete,
  onPageChange,
  onLimitChange,
  onCreate,
  onDetails,
  onEdit,
}: ProjectListViewProps) {
  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>Ошибка: {error.message}</p>;

  return (
    <div>
      <h1>Проекты</h1>
      <button onClick={onCreate} style={{ marginBottom: 16 }}>
        + Новый проект
      </button>

      {projects.length === 0 ? (
        <p>Нет проектов</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {projects.map((p) => (
              <li
                key={p.id}
                style={{
                  border: '1px solid #ccc',
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 6,
                }}
              >
                <strong style={{ fontSize: 18 }}>{p.name}</strong>
                <p>{p.description || 'Без описания'}</p>
                <p>Статус: {p.status}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onDetails(p.id)}>Открыть</button>
                  <button onClick={() => onEdit(p.id)}>Редактировать</button>
                  <button
                    onClick={() => onDelete(p.id)}
                    style={{ color: 'red' }}
                    disabled={isDeleting}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Пагинация */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              marginTop: 16,
            }}
          >
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              ◀ Предыдущая
            </button>
            <span>
              Страница {page} из {totalPages || 1}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Следующая ▶
            </button>
          </div>

          {/* Выбор лимита */}
          <div style={{ marginTop: 12 }}>
            <label>
              Показывать на странице:
              <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
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