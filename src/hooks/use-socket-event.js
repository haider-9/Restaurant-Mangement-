import { registerSocketEventCallback } from "@/context/SocketEventRegistry";
import { useEffect, useCallback } from "react";

/**
 * Register a callback for a specific socket event
 * @param {string} eventName - The name of the event 
 * @param {Function} cb - The function to run when event fires
 * @returns undefined
 */
const useSocketEvent = (eventName, cb) => {
    const memoizedCallback = useCallback(cb, [cb]);

    useEffect(() => {
        if (!eventName) return;
        
        const unregister = registerSocketEventCallback(eventName, memoizedCallback);
        
        return () => {
            if (unregister) {
                unregister();
            }
        };
    }, [eventName, memoizedCallback]);
};

export default useSocketEvent;