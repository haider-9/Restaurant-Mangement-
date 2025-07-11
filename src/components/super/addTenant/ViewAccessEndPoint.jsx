
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { div } from 'framer-motion/client';
import { useForm } from 'react-hook-form';
import Input from '../../common/Input';
import MainButton from '../../common/buttons/MainButton';

const DeleteSuspendForm = ({ isOpen, onClose, label }) => {

    const [endPoints, setEndPoints] = useState(
        [
            'google.com/app/2173dfeesdfwerq243r',
            'google.com/app/2173dfeesdfwerq243r',
            'google.com/app/2173dfeesdfwerq243r',
            'google.com/app/2173dfeesdfwerq243r',
            'google.com/app/2173dfeesdfwerq243r',
            'google.com/app/2173dfeesdfwerq243r',
            'google.com/app/2173dfeesdfwerq243r',
        ]
    )

    const onSubmit = (data) => {
        console.log("Tenant Submitted:", data);
        // Add API or state logic here
        reset();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className='absolute top-0  left-0 w-svw h-svh'>
                    <div className='w-full h-full flex items-center justify-center'>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black"
                            onClick={() => onClose()}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            initial={{ x: "70%" }}
                            animate={{ x: 0, opacity: 100 }}
                            exit={{ x: "70%", opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className=" z-50 h-auto w-full max-w-md bg-white rounded-4xl shadow-lg p-6 overflow-y-auto"
                        >
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-textPrimary">{label}</h2>
                            </div>

                            <div className='w-full flex justify-center items-center'>
                                <div className='w-4/5'>
                                    <div className='flex items-center justify-between text-sm  mb-2'>
                                        <p className='font-semibold'>Api Key</p>
                                        <p>Copy</p>
                                    </div>
                                    <div className='border min-h-20 overflow-y-auto text-left p-3 max-h-40'>
                                        {endPoints?.map((endPoint, i) => (
                                            <p key={i} className='text-xs text-textSecondary'>{endPoint}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteSuspendForm;
