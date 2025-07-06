// src/components/common/DropdownSelect.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ label, options, selected, onChange }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative w-full">
            <button
                className="w-full px-2 py-1 rounded-xl flex justify-between items-center bg-white text-[11px] lg:text-[13px]"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span>{label}</span>
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.ul
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-50 -right-2 w-44  bg-white shadow-xl inset-shadow-sm/15 rounded-xl text-left p-1"
                        >
                            {options.map((opt) => (
                                <li
                                    key={opt}
                                    className="px-3 rounded-xl py-2 hover:bg-primary hover:text-white cursor-pointer"
                                    onClick={() => {
                                        onChange(opt);
                                        setOpen(false);
                                    }}
                                >
                                    {opt}
                                </li>
                            ))}
                        </motion.ul>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;