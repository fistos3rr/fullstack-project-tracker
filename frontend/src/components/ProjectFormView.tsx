import { ProjectStatus } from '../api';

interface ProjectFormViewProps {
  name: string;
  description: string;
  status: ProjectStatus;
  isEdit: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStatusChange: (value: ProjectStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProjectFormView({
  name,
  description,
  status,
  isEdit,
  isLoading,
  isSubmitting,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
  onSubmit,
  onCancel,
}: ProjectFormViewProps) {
  if (isLoading) {
    return <p>Загрузка проекта...</p>;
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>{isEdit ? 'Редактировать' : 'Создать'} проект</h2>
      
      <label>
        Название:
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: 8 }}
        />
      </label>
      
      <label>
        Описание:
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          style={{ display: 'block', width: '100%', padding: 8 }}
        />
      </label>
      
      <label>
        Статус:
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ProjectStatus)}
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
        <button type="submit" disabled={isSubmitting}>
          Сохранить
        </button>
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}