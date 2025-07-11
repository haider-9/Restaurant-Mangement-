
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { div } from 'framer-motion/client';
import { useForm } from 'react-hook-form';
import Input from '../../common/Input';
import MainButton from '../../common/buttons/MainButton';
import { useSelector } from 'react-redux';

const UpgradeDowngradeForm = ({ isOpen, onClose, label }) => {
    const plans = useSelector(state => state.plan.plans)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

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
                            animate={{ x: 0, opacity:100 }}
                            exit={{ x: "70%", opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className=" z-50 h-auto w-full max-w-md bg-white rounded-4xl shadow-lg p-6 overflow-y-auto"
                        >
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-textPrimary">{label}</h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                {/* Plan Type */}
                                <div className='flex w-full items-center '>
                                    <label className="w-2/6 text-left text-sm text-textSecondary font-medium">Select Plan Type</label>
                                    <div className="flex gap-4">
                                        {plans?.map((plan, i) => (
                                            <label key={i} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="radio"
                                                    value={plan._id}
                                                    {...register("planType", { required: true })}
                                                />
                                                {plan.planName}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.planType && <p className="text-red-500 text-xs">Select a plan</p>}
                                </div>

                                {/* Subscription Type */}
                                <div className='flex w-full items-center'>
                                    <label className="w-2/6 text-left text-sm text-textSecondary font-medium">Subscription Type</label>
                                    <div className="flex gap-4">
                                        {["Monthly", "Annual"].map((type) => (
                                            <label key={type} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="radio"
                                                    value={type}
                                                    {...register("subscriptionType", { required: true })}
                                                />
                                                {type}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.subscriptionType && <p className="text-red-500 text-xs">Choose one</p>}
                                </div>

                                <div>
                                    <p className='font-semibold text-sm'> <span className='text-red-500 text-[16px]'>* </span>Are you sure to upgrade or downgrade account</p>
                                </div>

                                {/* Submit */}
                                <div className="pt-4 mb-3 flex justify-end gap-3">
                                    <MainButton 
                                    onClick={() => {
                                        onClose()
                                        reset()
                                    }} 
                                    className="bg-gray-600 px-3"
                                    radius='rounded-xl'
                                    >
                                        Cancel
                                    </MainButton>
                                    <MainButton type="submit" className="px-3" radius='rounded-xl'>
                                        Save
                                    </MainButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UpgradeDowngradeForm;
