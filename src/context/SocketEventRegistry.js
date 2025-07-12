const eventRegistry = new Map();

/**
 * Register a callback for a specific socket event
 * @param {string} event - The socket event to listen for
 * @param {Function} callback - The function to run when event fires
 * @returns {Function} unregister function
 */
export const registerSocketEventCallback = (event, callback) => {
    console.log("registering ",event,callback)
    if (!eventRegistry.has(event)) {
        eventRegistry.set(event, new Set());
    }

    const listeners = eventRegistry.get(event);
    listeners.add(callback);

    // Return a cleanup function
    return () => {
        listeners.delete(callback);
        // Clean up the event key if no listeners remain
        if (listeners.size === 0) {
            eventRegistry.delete(event);
        }
    };
};

/**
 * Fire all callbacks registered for a specific event
 * @param {string} event - The socket event name
 * @param {*} payload - The data to pass to each callback
 */
export const fireSocketEventCallbacks = (event, payload) => {
    const listeners = eventRegistry.get(event);
    if (!listeners) return;

    for (const cb of listeners) {
        try {
            cb(payload);
        } catch (err) {
            console.error(`Callback for event "${event}" failed:`, err);
        }
    }
};
