import { useProjectList } from '../hooks/useProjectList';
import { ProjectListView } from '../components/ProjectListView';

export function ProjectList() {
  const {
    projects,
    totalPages,
    page,
    limit,
    isLoading,
    isDeleting,
    error,
    handleDelete,
    handlePageChange,
    handleLimitChange,
    goToCreate,
    goToEdit,
    goToDetails
  } = useProjectList();

  return (
    <ProjectListView
      projects={projects}
      totalPages={totalPages}
      page={page}
      limit={limit}
      isLoading={isLoading}
      isDeleting={isDeleting}
      error={error}
      onDelete={handleDelete}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      onCreate={goToCreate}
      onDetails={goToDetails}
      onEdit={goToEdit}
    />
  );
}