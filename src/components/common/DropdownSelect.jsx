// src/components/common/DropdownSelect.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const DropdownSelect = ({ label, options, selected, onChange, onToggle, 
  disabled, color="bg-primary", className=""}) => {
    const [open, setOpen] = useState(false);

     const handleToggle = (e) => {
    if (onToggle) onToggle(e); // Call the onToggle handler
    if (!disabled) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!open);
    }
  };

    return (
        <div className="relative w-full">
            <button
                className="w-full border border-textSecondary px-2 py-1 rounded-xl flex justify-between items-center bg-white text-[13px] lg:text-[14px]"
                onClick={(e) => handleToggle(e)}
            >
                <span className='pr-2 text-textPrimary'>{selected || label}</span>
                <ChevronDown size={16} />
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
                            className="absolute z-50 mt-1 py-2  max-h-56 overflow-y-auto scrollbar-thin w-full bg-white shadow-lg rounded-lg inset-shadow-sm/15 text-left"
                        >
                            {options?.map((opt, id) => (
                                <li
                                    key={id}
                                    className={`px-2 py-2 hover:${color} hover:text-white cursor-pointer ${className}`}
                                    onClick={() => {
                                        onChange(opt);
                                        setOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </li>
                            ))}
                        </motion.ul>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropdownSelect;
