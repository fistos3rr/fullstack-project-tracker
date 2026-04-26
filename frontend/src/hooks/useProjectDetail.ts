import { useEffect } from "react";
import { useProjectData } from "./useProjectData";
import { useProjectLogs } from "./useProjectLogs";
import { useProjectComments } from "./useProjectComments";
import { useProjectNavigation } from "./useProjectNavigation";

export function useProjectDetail() {
    const { 
        projectId,
        project,
        isLoading: projectLoading,
        error: projectError,
    } = useProjectData();
    const { logs, isLoading: logsLoading, error: logsError } = useProjectLogs(projectId!);
    const commentsLogic = useProjectComments(projectId!);
    const { goBack, goToEdit, redirectToProjects } = useProjectNavigation(projectId);

    useEffect(() => {
        if (projectError) {
            redirectToProjects();
        }
    }, [projectError, redirectToProjects]);

    return {
        project,
        logs,
        comments: commentsLogic.comments,
        isLoading: projectLoading || logsLoading,
        isSubmitting: commentsLogic.isSubmitting,
        error: projectError || logsError || commentsLogic.error,
        content: commentsLogic.content,
        setContent: commentsLogic.setContent,
        handleAddComment: commentsLogic.handleAddComment,
        goBack,
        goToEdit,
    };
}