import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useReadProjectByIdApiV1ProjectsIdGet as useReadProjectById,
  useReadProjectLogsApiV1ProjectsProjectIdLogsGet as useReadProjectLogs,
  useReadProjectCommentsApiV1ProjectsProjectIdCommentsGet as useReadProjectComments,
  useCreateProjectCommentApiV1ProjectsProjectIdCommentsPost as useCreateProjectComment,
} from '../api/index';
import type { ProjectCommentCreate } from '../api/index';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const project = useReadProjectById(id!).data;
  const logs = useReadProjectLogs(id!).data;
  
  // Сохраняем объект запроса, чтобы иметь доступ к refetch
  const commentsQuery = useReadProjectComments(id!);
  const comments = commentsQuery.data;
  
  const createComment = useCreateProjectComment();

  const [content, setContent] = useState('');

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    await createComment.mutateAsync({ 
      projectId: String(id), 
      data: { content } as ProjectCommentCreate
    });
    
    setContent('');
    
    // Явно перезапрашиваем комментарии
    await commentsQuery.refetch();
    
    // Дополнительно можно инвалидировать связанные квери, если нужно
    // queryClient.invalidateQueries({ queryKey: commentsQuery.queryKey });
  };

  if (!project?.data) return <p>Загрузка...</p>;
  const p = project.data;
  const logsList = logs?.data?.data ?? [];
  const commentsList = comments?.data?.data ?? [];

  return (
    <div>
      <button onClick={() => navigate('/projects')}>← Назад</button>
      <h1>{p.name}</h1>
      <p>{p.description || 'Нет описания'}</p>

      <h3>📜 Логи</h3>
      {logsList.length ? (
        <ul>
          {logsList.map((log) => (
            <li key={log.id} style={{ marginBottom: 4 }}>
              <code>{new Date(log.changed_at).toLocaleString()}</code> — {log.field_name || JSON.stringify(log)}
            </li>
          ))}
        </ul>
      ) : <p>Логи отсутствуют</p>}

      <h3>💬 Комментарии</h3>
      <ul>
        {commentsList.map((c) => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <strong>{new Date(c.created_at).toLocaleString()}:</strong> {c.content}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ваш комментарий..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={createComment.isPending}>Отправить</button>
      </form>

      <div style={{ marginTop: 24 }}>
        <button onClick={() => navigate(`/projects/${id}/edit`)}>✏️ Редактировать проект</button>
      </div>
    </div>
  );
}