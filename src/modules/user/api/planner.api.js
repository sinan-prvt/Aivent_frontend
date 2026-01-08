import plannerAxios from "../../../core/api/plannerAxios";

/**
 * Generate a full event plan based on a prompt and preferences
 * @param {string} question - "Plan a wedding in Mumbai..."
 * @param {object} preferences - { priority: 'price', city: 'Mumbai' }
 */
export const generatePlan = async (question, preferences = {}) => {
    const response = await plannerAxios.post("/plan", {
        question,
        preferences,
    });
    return response.data;
};

/**
 * Ask for a specific service (rules-based retrieval)
 * @param {string} question - "Find me a DJ under 30k"
 * @param {object} preferences - { priority: 'quality' }
 */
export const askPlanner = async (question, preferences = {}) => {
    const response = await plannerAxios.post("/ask", {
        question,
        preferences,
    });
    return response.data;
};
