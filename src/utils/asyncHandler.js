
const asyncHandler = async (fn, onError) => {
    try {
        const data = await fn();
        return { data, error: null };
    } catch (error) {
        if (onError && typeof onError === "function") {
            onError(error);
        } else {
            console.error("[Async Error]:", error);
        }
        return { data: null, error };
    }
};

export default asyncHandler;
