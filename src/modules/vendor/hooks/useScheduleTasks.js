import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchScheduleTasks, createScheduleTask, updateScheduleTask, deleteScheduleTask } from "../api/vendor.api";

export const useScheduleTasks = () => {
    const queryClient = useQueryClient();

    const tasksQuery = useQuery({
        queryKey: ["schedule-tasks"],
        queryFn: async () => {
            const res = await fetchScheduleTasks();
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: createScheduleTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedule-tasks"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateScheduleTask(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedule-tasks"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteScheduleTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedule-tasks"] });
        },
    });

    return {
        tasks: tasksQuery.data?.results || (Array.isArray(tasksQuery.data) ? tasksQuery.data : []),
        isLoading: tasksQuery.isLoading,
        isError: tasksQuery.isError,
        createTask: createMutation.mutateAsync,
        updateTask: updateMutation.mutateAsync,
        deleteTask: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
