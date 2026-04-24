import { useProjectDetail } from '../hooks/useProjectDetail';
import { ProjectDetailView } from '../components/ProjectDetailView';

export function ProjectDetail() {
  const {
    project,
    logs,
    comments,
    isLoading,
    isSubmitting,
    content,
    setContent,
    handleAddComment,
    goBack,
    goToEdit,
  } = useProjectDetail();

  return (
    <ProjectDetailView
      project={project!}
      logs={logs}
      comments={comments}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      content={content}
      onContentChange={setContent}
      onSubmitComment={handleAddComment}
      onGoBack={goBack}
      onGoToEdit={goToEdit}
    />
  );
}