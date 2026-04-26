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
	isCompleted,
    setName,
    setDescription,
    setStatus,
    validationErrors,
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
	  isCompleted={isCompleted}
      onNameChange={setName}
      onDescriptionChange={setDescription}
      onStatusChange={setStatus}
      validationErrors={validationErrors}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}