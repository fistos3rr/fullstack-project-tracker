import { useNavigate } from "react-router-dom";

export function useProjectNavigation(projectId?: string) {
    const navigate = useNavigate();
    return {
        goBack: () => navigate("/projects"),
        goToEdit: () => navigate(`/projects/${projectId}/edit`),
        redirectToProjects: () => navigate("/projects"),
    };
}