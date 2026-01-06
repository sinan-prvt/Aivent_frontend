import { useQuery } from "@tanstack/react-query";
import { fetchVendorMe, fetchScheduleTasks, fetchTechnicians } from "../api/vendor.api";
import { getVendorProducts } from "../api/catalog.api";

export const useLightingData = () => {
    // 1. Fetch Vendor Profile
    const profileQuery = useQuery({
        queryKey: ["vendor", "me"],
        queryFn: fetchVendorMe,
        select: (res) => res.data,
    });

    // 2. Fetch Vendor Products
    const productsQuery = useQuery({
        queryKey: ["vendor-products"],
        queryFn: getVendorProducts,
    });

    // 3. Fetch Schedule Tasks
    const tasksQuery = useQuery({
        queryKey: ["schedule-tasks"],
        queryFn: async () => {
            const res = await fetchScheduleTasks();
            return res.data;
        },
    });

    // 4. Fetch Technicians
    const techsQuery = useQuery({
        queryKey: ["technicians"],
        queryFn: async () => {
            const res = await fetchTechnicians();
            return res.data;
        },
    });

    const isLoading = profileQuery.isLoading || productsQuery.isLoading || tasksQuery.isLoading || techsQuery.isLoading;
    const isError = profileQuery.isError || productsQuery.isError || tasksQuery.isError || techsQuery.isError;

    // Data Processing
    const profile = profileQuery.data || {};
    const products = Array.isArray(productsQuery.data) ? productsQuery.data : [];
    const tasks = tasksQuery.data || [];
    const techniciansList = techsQuery.data || [];

    // Calculate Stats
    const stats = {
        totalRevenue: 15450, // Mock for now
        upcomingBookings: tasks.filter(t => t.status !== 'completed' && t.status !== 'canceled').length,
        techniciansAvailable: techniciansList.filter(t => t.status === 'available').length,
        totalTechnicians: techniciansList.length,
        equipmentUtilization: 75,
        totalEquipment: products.length,
        availableEquipment: products.filter(p => p.is_available).length,
    };

    // Get Specializations for Lighting & Effects
    const specializationMapping = {
        1: "Decorative Lighting",
        2: "LED & Pixel Lights",
        3: "Laser & Special Effects",
        4: "Fireworks & Cold Pyro"
    };

    const activeSpecializations = (profile.subcategory_ids || [])
        .map(id => specializationMapping[id])
        .filter(Boolean);

    // Equipment categories
    const equipmentCategories = {
        lighting: products.filter(p => p.name?.toLowerCase().includes('light') || p.name?.toLowerCase().includes('led')),
        sound: products.filter(p => p.name?.toLowerCase().includes('speaker') || p.name?.toLowerCase().includes('mic')),
        effects: products.filter(p => p.name?.toLowerCase().includes('laser') || p.name?.toLowerCase().includes('fog')),
    };

    // Use real technicians if available, otherwise mock for UI stability during transition
    const technicians = techniciansList.length > 0 ? techniciansList : [
        { id: 1, name: "Liam Evans", role: "Lighting Operator", status: "available" },
        { id: 2, name: "Olivia Chen", role: "Audio Technician", status: "available" },
        { id: 3, name: "Noah Patel", role: "Laser Technician", status: "busy" },
        { id: 4, name: "Sophia Rodriguez", role: "Stage Manager", status: "available" },
    ];

    // Mock Equipment Status
    const equipmentStatus = products.slice(0, 6).map(p => ({
        name: p.name,
        status: p.is_available ? "Ready" : "In Use",
        statusColor: p.is_available ? "text-emerald-600" : "text-amber-600",
    }));

    // Mock Revenue Data for Chart
    const revenueData = [
        { name: 'Jan', revenue: 8000 },
        { name: 'Feb', revenue: 9500 },
        { name: 'Mar', revenue: 11000 },
        { name: 'Apr', revenue: 10200 },
        { name: 'May', revenue: 13500 },
        { name: 'Jun', revenue: 15450 },
    ];

    // Map real tasks to bookings display
    const bookings = tasks.slice(0, 5).map(task => ({
        id: task.id,
        date: new Date(task.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        event: task.event_name,
        venue: task.location,
        status: task.status
    }));

    return {
        profile,
        products,
        stats,
        activeSpecializations,
        equipmentCategories,
        technicians,
        equipmentStatus,
        revenueData,
        bookings,
        isLoading,
        isError,
        refresh: () => {
            profileQuery.refetch();
            productsQuery.refetch();
            tasksQuery.refetch();
        }
    };
};
