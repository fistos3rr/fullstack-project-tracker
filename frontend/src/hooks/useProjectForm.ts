import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useReadProjectById,
    useCreateProject,
    useUpdateProject,
    ProjectStatus,
} from '../api/index';
import type { ProjectCreate, ProjectUpdate, HTTPValidationError } from '../api/index';
import { AxiosError } from 'axios';

type ApiError = AxiosError<HTTPValidationError>;

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

    const [name, setNameState] = useState('');
    const [description, setDescriptionState] = useState('');
    const [status, setStatusState] = useState<ProjectStatus>(ProjectStatus.planned);
    const [originalStatus, setOriginalStatus] = useState<ProjectStatus | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

    const clearFieldError = (field: string) => {
        setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const setName = (value: string) => {
        setNameState(value);
        clearFieldError("name");
    };

    const setDescription = (value: string) => {
        setDescriptionState(value);
        clearFieldError("description");
    };

    const setStatus = (value: ProjectStatus) => {
        setStatusState(value);
        clearFieldError("status");
    };

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
            const error = err as ApiError;
            if (error.response?.status == 422 && error.response?.data?.detail) {
                const errorsMap: Record<string, string> = {};
                error.response.data.detail.forEach ((ve) => {
                    const field = ve.loc[1];
                    if (field) errorsMap[field] = ve.msg;
                })
                setValidationErrors(errorsMap);
                return;
            }
            alert('Save error: ' + (error.message || 'Unknown error'));
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
        validationErrors,
        isEdit,
        isLoading,
        isSubmitting,
	    isCompleted,
        handleSubmit,
        handleCancel,
  };
}