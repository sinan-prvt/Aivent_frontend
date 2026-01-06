import React, { useState } from "react";
import { FiPlus, FiChevronLeft, FiChevronRight, FiFilter, FiUsers, FiCalendar, FiClock, FiMapPin, FiX, FiCheck, FiTrash2, FiEdit2 } from "react-icons/fi";
import { useScheduleTasks } from "../../hooks/useScheduleTasks";
import { useTechnicians } from "../../hooks/useTechnicians";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const VIEW_MODES = ["Timeline", "Week", "Month", "List"];

export default function LightingScheduleManager() {
    const { tasks, isLoading: tasksLoading, createTask, updateTask, deleteTask } = useScheduleTasks();
    const { technicians, isLoading: techsLoading } = useTechnicians();
    const [viewMode, setViewMode] = useState("Week");
    const [technicianFilter, setTechnicianFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        event_name: "",
        location: "",
        start_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        end_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        description: "",
        status: "pending",
        assigned_technicians: [],
        tasks: []
    });

    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

    const weekDays = DAYS.map((day, i) => addDays(currentWeekStart, i));

    const handleOpenModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                event_name: task.event_name,
                location: task.location,
                start_time: format(parseISO(task.start_time), "yyyy-MM-dd'T'HH:mm"),
                end_time: format(parseISO(task.end_time), "yyyy-MM-dd'T'HH:mm"),
                description: task.description || "",
                status: task.status,
                assigned_technicians: task.assigned_technicians || [],
                tasks: task.tasks || []
            });
        } else {
            setEditingTask(null);
            setFormData({
                event_name: "",
                location: "",
                start_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                end_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                description: "",
                status: "pending",
                assigned_technicians: [],
                tasks: []
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await updateTask({ id: editingTask.id, payload: formData });
            } else {
                await createTask(formData);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await deleteTask(id);
        }
    };

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (statusFilter !== "all" && task.status !== statusFilter) return false;
        if (technicianFilter !== "all") {
            return task.assigned_technicians?.includes(technicianFilter);
        }
        return true;
    });

    if (tasksLoading || techsLoading) {
        return <div className="p-10 text-center font-bold text-gray-500">Loading Schedule...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Schedule Manager</h1>
                    <p className="text-gray-500 text-sm mt-1">Assign technicians to events and manage setup/teardown billing.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-5 py-3 bg-sky-600 text-white rounded-xl font-bold shadow-lg hover:bg-sky-700 transition-all text-sm"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Add New Task</span>
                    </button>
                </div>

            </div>

            {/* Filters & View Toggle */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-sky-600 text-white rounded-lg font-bold text-xs">
                        All Events
                    </button>
                    <select
                        value={technicianFilter}
                        onChange={(e) => setTechnicianFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-xs text-gray-600"
                    >
                        <option value="all">By Technician ▾</option>
                        {technicians.map(tech => (
                            <option key={tech.id} value={tech.name}>{tech.name}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-xs text-gray-600"
                    >
                        <option value="all">By Status ▾</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {VIEW_MODES.map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === mode
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <FiChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <FiChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 border-b border-gray-100">
                    {weekDays.map((date, i) => (
                        <div key={i} className="p-4 text-center border-r border-gray-100 last:border-r-0">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{DAYS[i]}</span>
                            <span className="block text-lg font-black text-gray-900 mt-1">{format(date, "d")}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 min-h-[500px]">
                    {weekDays.map((date, dayIndex) => (
                        <div key={dayIndex} className="border-r border-gray-100 last:border-r-0 p-3 space-y-3 bg-gray-50/30">
                            {filteredTasks
                                .filter(task => isSameDay(parseISO(task.start_time), date))
                                .map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleOpenModal(task)}
                                        className={`bg-white group relative border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden`}
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full ${task.status === 'confirmed' ? 'bg-sky-500' :
                                            task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`} />

                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h4 className="font-bold text-sm text-gray-900 line-clamp-2">{task.event_name}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${task.status === 'confirmed' ? 'bg-sky-100 text-sky-700' :
                                                task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-[10px] text-gray-500 font-bold">
                                            <div className="flex items-center gap-1.5">
                                                <FiClock className="w-3 h-3 text-sky-500" />
                                                <span>{format(parseISO(task.start_time), "HH:mm")} - {format(parseISO(task.end_time), "HH:mm")}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FiMapPin className="w-3 h-3 text-sky-500" />
                                                <span className="truncate">{task.location}</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex -space-x-2">
                                            {task.assigned_technicians?.map((tech, i) => (
                                                <div
                                                    key={i}
                                                    title={tech}
                                                    className="w-6 h-6 rounded-full bg-sky-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-sky-700"
                                                >
                                                    {tech[0]}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">{editingTask ? "Edit Task" : "Add New Task"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                                <FiX className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Event Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.event_name}
                                        onChange={e => setFormData({ ...formData, event_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-bold"
                                        placeholder="e.g. Wedding Reception"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-bold"
                                        placeholder="Specific Venue/Hall"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.start_time}
                                        onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">End Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.end_time}
                                        onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-bold"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Assign Technicians</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                        {technicians.length === 0 ? (
                                            <p className="text-xs text-gray-400 italic col-span-2">No staff profiles found. Create them in the Staff page.</p>
                                        ) : (
                                            technicians.map(tech => (
                                                <label key={tech.id} className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-gray-300"
                                                        checked={formData.assigned_technicians.includes(tech.name)}
                                                        onChange={(e) => {
                                                            const newStaff = e.target.checked
                                                                ? [...formData.assigned_technicians, tech.name]
                                                                : formData.assigned_technicians.filter(name => name !== tech.name);
                                                            setFormData({ ...formData, assigned_technicians: newStaff });
                                                        }}
                                                    />
                                                    <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-tight">
                                                        {tech.name}
                                                    </span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none font-bold"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                </div>
                            </div>
                        </form>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            {editingTask ? (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(editingTask.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-red-600 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <FiTrash2 /> Delete
                                </button>
                            ) : <div></div>}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-8 py-2 bg-sky-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-sky-700 transition-all"
                                >
                                    <FiCheck /> {editingTask ? "Save Changes" : "Create Task"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
