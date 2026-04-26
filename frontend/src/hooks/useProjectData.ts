import { useParams } from "react-router-dom";
import { useReadProjectById } from '../api/index';

export function useProjectData() {
    const { id } = useParams<{ id: string}>();
    const query = useReadProjectById(id!);

    return {
        project: query.data?.data,
        isLoading: query.isLoading,
        error: query.error,
        projectId: id
    };
}
