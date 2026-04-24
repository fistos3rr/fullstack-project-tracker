// pages/ProjectForm.tsx
import { useProjectForm } from '../hooks/useProjectForm';
import { ProjectFormView } from '../components/ProjectFormView';

export function ProjectForm() {
  const {
    name,
    description,
    status,
    isEdit,
    isLoading,
    isSubmitting,
    setName,
    setDescription,
    setStatus,
    handleSubmit,
    handleCancel,
  } = useProjectForm();

  return (
    <ProjectFormView
      name={name}
      description={description}
      status={status}
      isEdit={isEdit}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      onNameChange={setName}
      onDescriptionChange={setDescription}
      onStatusChange={setStatus}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}