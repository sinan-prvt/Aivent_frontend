import { useState, useEffect } from "react";
import { chatApi } from "../api/chat.api";

const useVendorInbox = (refreshInterval = 10000) => {
    const [inbox, setInbox] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInbox = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await chatApi.getInbox();
            setInbox(data);
        } catch (err) {
            console.error("Error fetching inbox:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInbox();

        // Set up polling
        const interval = setInterval(fetchInbox, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    return { inbox, isLoading, error, refetch: fetchInbox };
};

export default useVendorInbox;
