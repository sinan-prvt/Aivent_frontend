import { useQuery } from "@tanstack/react-query";
import { fetchVendorMe, fetchScheduleTasks } from "../api/vendor.api";
import { fetchPackages, fetchDeliveries } from "../api/photography.api";

export const usePhotographyData = () => {
    // 1. Fetch Vendor Profile
    const profileQuery = useQuery({
        queryKey: ["vendor", "me"],
        queryFn: fetchVendorMe,
        select: (res) => res.data,
    });

    // 2. Fetch Photography Packages
    const packagesQuery = useQuery({
        queryKey: ["photography-packages"],
        queryFn: async () => {
            const res = await fetchPackages();
            return res.data;
        },
    });

    // 3. Fetch Deliveries (Galleries)
    const deliveriesQuery = useQuery({
        queryKey: ["photography-deliveries"],
        queryFn: async () => {
            const res = await fetchDeliveries();
            return res.data;
        },
    });

    // 4. Fetch Schedule Tasks
    const tasksQuery = useQuery({
        queryKey: ["schedule-tasks"],
        queryFn: async () => {
            const res = await fetchScheduleTasks();
            return res.data;
        },
    });

    const isLoading = profileQuery.isLoading || packagesQuery.isLoading || deliveriesQuery.isLoading || tasksQuery.isLoading;
    const isError = profileQuery.isError || packagesQuery.isError || deliveriesQuery.isError || tasksQuery.isError;

    // Data Processing
    const profile = profileQuery.data || {};
    const packagesData = packagesQuery.data || {};
    const packages = packagesData.results || (Array.isArray(packagesData) ? packagesData : []);
    const deliveriesData = deliveriesQuery.data || {};
    const deliveries = deliveriesData.results || (Array.isArray(deliveriesData) ? deliveriesData : []);
    const tasksData = tasksQuery.data || {};
    const tasks = tasksData.results || (Array.isArray(tasksData) ? tasksData : []);

    // Calculate Stats
    const stats = {
        totalPackages: packages.length,
        totalDeliveries: deliveries.length,
        upcomingShoots: tasks.filter(t => t.status !== 'completed' && t.status !== 'canceled').length,
        completedShoots: tasks.filter(t => t.status === 'completed').length,
    };

    // Prepare Recent Deliveries (Galleries)
    const recentDeliveries = deliveries.slice(0, 3).map(d => ({
        id: d.id,
        src: d.thumbnail || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300",
        title: d.client_name,
        date: d.delivery_date ? new Date(d.delivery_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "TBD"
    }));

    // Prepare Upcoming Schedule
    const upcomingSchedule = tasks
        .filter(t => t.status !== 'completed' && t.status !== 'canceled')
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, 2)
        .map(t => ({
            event: t.event_name,
            time: new Date(t.start_time).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            loc: t.location,
            day: new Date(t.start_time).getDate(),
            month: new Date(t.start_time).toLocaleString(undefined, { month: 'short' }).toUpperCase()
        }));

    return {
        profile,
        packages,
        deliveries,
        tasks,
        stats,
        recentDeliveries,
        upcomingSchedule,
        isLoading,
        isError,
        refresh: () => {
            profileQuery.refetch();
            packagesQuery.refetch();
            deliveriesQuery.refetch();
            tasksQuery.refetch();
        }
    };
};
