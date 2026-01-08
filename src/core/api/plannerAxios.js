import axios from "axios";

// AI Planner Service runs on 8010
export const PLANNER_API_BASE = "http://localhost:8010";

const plannerAxios = axios.create({
    baseURL: `${PLANNER_API_BASE}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

export default plannerAxios;
