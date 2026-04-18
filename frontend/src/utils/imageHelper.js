/**
 * Helper function to generate image URLs
 * @param {string} imagePath - The image path from the book object
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return null;
    }
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    // If the path already includes the full URL or protocol, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Otherwise, construct the URL
    return `${apiBaseUrl}/storage/${imagePath}`;
};

/**
 * Alternative using the API base URL from axiosClient
 * @param {string} imagePath - The image path from the book object
 * @param {string} apiBaseUrl - Optional API base URL override
 * @returns {string} - The full image URL
 */
export const getBookImageUrl = (imagePath, apiBaseUrl = 'http://localhost:8000') => {
    if (!imagePath) {
        return null;
    }
    
    // Remove leading slashes for consistency
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    return `${apiBaseUrl}/${cleanPath}`;
};

