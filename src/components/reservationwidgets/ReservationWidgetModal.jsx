
import { AnimatePresence, motion } from "framer-motion";

const ReservationWidgetModal = ({ isOpen, onClose, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <motion.div
                        className="fixed inset-0 z-40"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="z-50 bg-white rounded-3xl w-full max-w-xs sm:max-w-sm  min-h-[32rem] mx-4 p-6 absolute bottom-21 right-5"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReservationWidgetModal;
