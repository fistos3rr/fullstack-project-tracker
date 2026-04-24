// components/ProjectDetailView.tsx
import type { ProjectRead, ProjectChangeLog, ProjectCommentRead } from '../api';

interface ProjectDetailViewProps {
  project: ProjectRead;
  logs: ProjectChangeLog[];
  comments: ProjectCommentRead[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  content: string;
  onContentChange: (value: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  onGoBack: () => void;
  onGoToEdit: () => void;
}

export function ProjectDetailView({
  project,
  logs,
  comments,
  isLoading,
  isSubmitting,
  content,
  onContentChange,
  onSubmitComment,
  onGoBack,
  onGoToEdit,
}: ProjectDetailViewProps) {
  if (isLoading) return <p>Загрузка...</p>;
  if (!project) return <p>Проект не найден</p>;

  return (
    <div>
      <button onClick={onGoBack}>← Назад</button>
      <h1>{project.name}</h1>
      <p>{project.description || 'Нет описания'}</p>

      <h3>📜 Логи</h3>
      {logs.length ? (
        <ul>
          {logs.map((log) => (
            <li key={log.id} style={{ marginBottom: 4 }}>
              <code>{new Date(log.changed_at).toLocaleString()}</code> —{' '}
              {log.field_name || JSON.stringify(log)}
            </li>
          ))}
        </ul>
      ) : (
        <p>Логи отсутствуют</p>
      )}

      <h3>💬 Комментарии</h3>
      <ul>
        {comments.map((c) => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <strong>{new Date(c.created_at).toLocaleString()}:</strong> {c.content}
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmitComment} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Ваш комментарий..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={isSubmitting}>
          Отправить
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <button onClick={onGoToEdit}>✏️ Редактировать проект</button>
      </div>
    </div>
  );
}