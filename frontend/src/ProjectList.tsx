// src/UserList.tsx
import { useEffect, useState } from 'react';
// Импортируем функцию для запроса и тип данных из сгенерированного клиента
import { readProjectsApiProjectsGet } from './client/sdk.gen';
import type { ProjectRead } from './client/types.gen';

export function ProjectList() {
  // Состояния компонента
  const [projects, setProjects] = useState<ProjectRead[]>([]);   // список пользователей
  const [loading, setLoading] = useState(true);     // флаг загрузки
  const [error, setError] = useState<string | null>(null); // сообщение об ошибке

  // useEffect выполняет запрос при первом рендере компонента
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const { data, error: apiError } = await readProjectsApiProjectsGet();
        if (apiError) {
          setError('Ошибка загрузки данных');
          console.error(apiError);
        } else if (data) {
          setProjects(data.data);
        }
      } catch (err) {
        setError('Не удалось соединиться с сервером');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []); // пустой массив зависимостей = выполнить один раз при монтировании

  // Пока загружается – показываем сообщение
  if (loading) return <div>Загрузка...</div>;

  // Если ошибка – показываем ошибку
  if (error) return <div>Ошибка: {error}</div>;

  // Если список пуст – сообщаем
  if (projects.length === 0) return <div>Нет projects</div>;

  // Иначе выводим список
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}