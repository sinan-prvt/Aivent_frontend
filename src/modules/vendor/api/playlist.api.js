
import vendorApi from "@/core/api/vendorAxios";

export const getPlaylists = async () => {
    const response = await vendorApi.get("/playlists/");
    return response.data;
};

export const createPlaylist = async (data) => {
    const response = await vendorApi.post("/playlists/", data);
    return response.data;
};

export const updatePlaylist = async (id, data) => {
    const response = await vendorApi.patch(`/playlists/${id}/`, data);
    return response.data;
};

export const deletePlaylist = async (id) => {
    const response = await vendorApi.delete(`/playlists/${id}/`);
    return response.data;
};
