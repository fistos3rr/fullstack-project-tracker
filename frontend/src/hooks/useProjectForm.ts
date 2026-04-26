import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useReadProjectById,
    useCreateProject,
    useUpdateProject,
    ProjectStatus,
} from '../api/index';
import type { ProjectCreate, ProjectUpdate } from '../api/index';

export function useProjectForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;
  
  
    const projectQuery = useReadProjectById(id!, {
        query: { 
            enabled: !!id 
        },
    });
    if (projectQuery.isError) {
        navigate("/projects");
    }
    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.planned);
    const [originalStatus, setOriginalStatus] = useState<ProjectStatus | null>(null);

    useEffect(() => {
        if (isEdit && projectQuery.isSuccess && projectQuery.data?.data) {
            const project = projectQuery.data.data;
            setName(project.name ?? '');
            setDescription(project.description ?? '');
            setStatus(project.status ?? ProjectStatus.planned);
            setOriginalStatus(project.status ?? ProjectStatus.planned);
        }
    }, [isEdit, projectQuery.isSuccess, projectQuery.data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { name, description, status };

        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: String(id), data: payload as ProjectUpdate });
            } else {
                await createMutation.mutateAsync({ data: payload as ProjectCreate });
            }
            navigate(isEdit ? `/projects/${id}` : '/projects');
        } catch (err) {
            alert('Save error: ' + (err as Error).message);
            navigate('/projects');
        }
    };

    const handleCancel = () => navigate('/projects');

    const isLoading = isEdit && projectQuery.isLoading;
    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const isCompleted = originalStatus == ProjectStatus.completed

    return {
        name,
        description,
        status,
        setName,
        setDescription,
        setStatus,
        isEdit,
        isLoading,
        isSubmitting,
	    isCompleted,
        handleSubmit,
        handleCancel,
  };
}