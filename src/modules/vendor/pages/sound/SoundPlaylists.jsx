
import React, { useState } from "react";
import { FiMusic, FiPlus, FiPlay, FiTrash2, FiUser, FiLoader } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlaylists, updatePlaylist, deletePlaylist } from "../../api/playlist.api";
import AddPlaylistModal from "./components/AddPlaylistModal";

export default function SoundPlaylists() {
    const { data: playlists, isLoading } = useQuery({
        queryKey: ["vendor-playlists"],
        queryFn: getPlaylists
    });

    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Auto-select first playlist on load 
    React.useEffect(() => {
        if (playlists && playlists.length > 0 && !selectedPlaylist) {
            setSelectedPlaylist(playlists[0]);
        }
    }, [playlists]);

    const queryClient = useQueryClient();

    // Add Song Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updatePlaylist(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["vendor-playlists"] });
            setSelectedPlaylist(data); // Update local view
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: deletePlaylist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-playlists"] });
            setSelectedPlaylist(null);
        }
    });

    const handleDeletePlaylist = async (id) => {
        if (window.confirm("Delete this playlist?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleAddSong = () => {
        if (!selectedPlaylist) return;
        const title = prompt("Song Title:");
        if (!title) return;
        const artist = prompt("Artist:");

        const newSong = { title, artist: artist || "Unknown", duration: "0:00" };
        const updatedSongs = [...(selectedPlaylist.songs || []), newSong];

        updateMutation.mutate({
            id: selectedPlaylist.id,
            data: { songs: updatedSongs }
        });
    };

    const handleDeleteSong = (index) => {
        if (!confirm("Remove song?")) return;
        const updatedSongs = selectedPlaylist.songs.filter((_, i) => i !== index);
        updateMutation.mutate({
            id: selectedPlaylist.id,
            data: { songs: updatedSongs }
        });
    };

    if (isLoading) return <div className="p-12 flex justify-center text-indigo-600"><FiLoader className="animate-spin w-8 h-8" /></div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[500px] animate-in fade-in duration-500">
            {/* Sidebar Playlists */}
            <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Playlists</h3>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition"
                    >
                        <FiPlus />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 space-y-2">
                    {playlists?.length === 0 && <p className="text-gray-400 text-center text-sm py-4">No playlists yet.</p>}

                    {playlists?.map(playlist => (
                        <div
                            key={playlist.id}
                            onClick={() => setSelectedPlaylist(playlist)}
                            className={`p-3 rounded-xl cursor-pointer transition flex items-center gap-3 group relative ${selectedPlaylist?.id === playlist.id ? 'bg-indigo-50 border-indigo-100 border' : 'hover:bg-gray-50 border border-transparent'}`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${selectedPlaylist?.id === playlist.id ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                                <FiMusic />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-semibold truncate ${selectedPlaylist?.id === playlist.id ? 'text-indigo-900' : 'text-gray-900'}`}>{playlist.name}</h4>
                                <p className="text-xs text-gray-500 truncate">
                                    {playlist.songs?.length || 0} Songs • {playlist.client_name || "No Client"}
                                </p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id); }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                {selectedPlaylist ? (
                    <>
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedPlaylist.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-md font-medium">{selectedPlaylist.type}</span>
                                        {selectedPlaylist.client_name && (
                                            <>
                                                <span className="text-gray-400 text-sm">•</span>
                                                <span className="text-gray-600 text-sm flex items-center gap-1"><FiUser size={12} /> {selectedPlaylist.client_name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddSong}
                                        className="px-4 py-2 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 flex items-center gap-2"
                                    >
                                        <FiPlus size={16} /> Add Songs
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-xl rounded-bl-xl w-10">#</th>
                                        <th className="px-4 py-3">Title</th>
                                        <th className="px-4 py-3">Artist</th>
                                        <th className="px-4 py-3 rounded-tr-xl rounded-br-xl w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {selectedPlaylist.songs?.map((song, index) => (
                                        <tr key={index} className="hover:bg-gray-50 group transition">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{song.title}</td>
                                            <td className="px-4 py-3">{song.artist}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDeleteSong(index)}
                                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!selectedPlaylist.songs || selectedPlaylist.songs.length === 0) && (
                                <div className="mt-8 text-center bg-gray-50 p-8 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 mb-2">No songs yet.</p>
                                    <button onClick={handleAddSong} className="text-indigo-600 font-medium hover:underline">Add your first song</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select or create a playlist to start.
                    </div>
                )}
            </div>

            <AddPlaylistModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
};
