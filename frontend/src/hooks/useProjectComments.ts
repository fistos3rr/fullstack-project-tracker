import { useState } from "react";
import { useReadProjectCommentList, useCreateProjectComment } from "../api/index";
import type { ProjectCommentCreate } from "../api/index";

export function useProjectComments(projectId: string) {
    const commentsQuery = useReadProjectCommentList(projectId);
    const createCommentMutation = useCreateProjectComment();
    const [content, setContent] = useState('');

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        await createCommentMutation.mutateAsync({
            projectId,
            data: { content } as ProjectCommentCreate, 
        });

        setContent('');
        await commentsQuery.refetch();
    };

    return {
        comments: commentsQuery.data?.data?.data ?? [],
        isLoading: commentsQuery.isLoading,
        error: commentsQuery.error,
        isSubmitting: createCommentMutation.isPending,
        content,
        setContent,
        handleAddComment,
    };
}