import { useReadProjectLogList } from "../api/index";

export function useProjectLogs(projectId: string) {
    const logsQuery = useReadProjectLogList(projectId);
    const logs = logsQuery.data?.data?.data ?? [];

    return {
        logs,
        isLoading: logsQuery.isLoading,
        error: logsQuery.isError,
    };
}