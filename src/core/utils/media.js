
/**
 * Utility to handle media URLs from the backend.
 * Prepends the backend base URL for relative media paths.
 */
const CATALOG_BASE_URL = "http://localhost:8003";

export const getMediaUrl = (path) => {
    if (!path) return null;
    
    // If it's already a full URL (blob, data, http), return as is
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
    }

    // Prepend base URL if it looks like a media path
    if (path.startsWith('/media/')) {
        return `${CATALOG_BASE_URL}${path}`;
    }

    // For paths that might not have the leading slash but are media
    if (path.startsWith('media/')) {
        return `${CATALOG_BASE_URL}/${path}`;
    }

    // Default: return as is if no match
    return path;
};
