import { useNavigate } from "react-router-dom";

export function useProjectNavigation(projectId?: string) {
    const navigate = useNavigate();
    return {
        goBack: () => navigate("/projects"),
        goToEdit: () => navigate(`/projects/${projectId}/edit`),
        goToList: () => navigate("/projects"),
        goToDetails: () => navigate(`/projects/${projectId}`),
        goToEditId: (id: string) => navigate(`/projects/${id}/edit`),
        goToDetailsId: (id: string) => navigate(`/projects/${id}`),
        goToCreate: () => navigate("/projects/new")
    };
}