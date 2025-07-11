import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Input from '../../common/Input';
import MainButton from '../../common/buttons/MainButton';
import { useSelector, useDispatch } from 'react-redux';
import { createTenant, editTenant } from '../../../store/slices/super-admin/tenants/tenantSlice';
import { useToast } from '../../common/toast/useToast';

const AddTenantForm = ({ isOpen, onClose, label, fetchTenants, initialData }) => {
    const plans = useSelector(state => state.plan.plans);
    const { loading, error } = useSelector(state => state.tenants);
    const dispatch = useDispatch();
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        planId: '',
        subscriptionType: '',
        customAmount: ''
    });

    const [errors, setErrors] = useState({});

    // Check if selected plan is Enterprise
    const isEnterprisePlan = formData.planId && 
        plans.find(plan => plan._id === formData.planId)?.planName === 'enterprise';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.planId) newErrors.planId = 'Plan is required';
        if (!formData.subscriptionType) newErrors.subscriptionType = 'Subscription type is required';
        if (isEnterprisePlan && !formData.customAmount) {
            newErrors.customAmount = 'Custom amount is required for Enterprise plan';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast({ title: 'Please fill all required fields', variant: 'destructive' });
            return;
        }

        try {
            const response = await dispatch(createTenant({
                ...formData,
                // Include custom amount only if it's an Enterprise plan
                amount: isEnterprisePlan ? formData.customAmount : undefined
            }));

            console.log('response', response)

            if (response.payload?.success) {
                toast({
                    title: response.payload.message,
                    variant: "success",
                });
                
                if (response.payload.paymentLink) {
                    // Redirect to Stripe payment link
                    window.location.href = response.payload.paymentLink;
                } else {
                    fetchTenants();
                    onClose();
                }
            } else {
                toast({
                    title: response.payload?.message || 'Failed to create tenant',
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: 'An error occurred',
                variant: "destructive",
            });
            console.error('Submission error:', error);
        }
    };

    // Reset form when closing
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                email: '',
                planId: '',
                subscriptionType: '',
                customAmount: ''
            });
            setErrors({});
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className='absolute top-0 left-0 w-svw h-svh'>
                    <div className='w-full h-full flex items-center justify-center'>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black"
                            onClick={onClose}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            initial={{ x: "70%" }}
                            animate={{ x: 0, opacity: 100 }}
                            exit={{ x: "70%", opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="z-50 h-auto w-full max-w-md bg-white rounded-4xl shadow-lg p-6 overflow-y-auto"
                        >
                            <div className="mb-5 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-textPrimary">{label}</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email */}
                                <div className='flex w-full items-center'>
                                    <label className="w-2/6 text-left text-sm text-textSecondary  mb-1">
                                        Email
                                    </label>
                                    <div className="w-4/6">
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full py-1"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Plan Type */}
                                <div className='flex w-full items-center'>
                                    <label className="w-2/6 text-left text-sm text-textSecondary ">
                                        Plan Type
                                    </label>
                                    <div className="w-4/6 flex flex-col gap-2">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {plans?.map((plan) => (
                                                <label key={plan._id} className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="planId"
                                                        value={plan._id}
                                                        checked={formData.planId === plan._id}
                                                        onChange={handleChange}
                                                    />
                                                    {plan.planName}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.planId && (
                                            <p className="text-red-500 text-xs">{errors.planId}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Amount for Enterprise */}
                                {isEnterprisePlan && (
                                    <div className='flex w-full items-center'>
                                        <label className="w-2/6 text-left text-sm text-textSecondary  mb-1">
                                            Custom Amount
                                        </label>
                                        <div className="w-4/6">
                                            <Input
                                                type="number"
                                                name="customAmount"
                                                value={formData.customAmount}
                                                onChange={handleChange}
                                                className="w-full py-1"
                                                min="1"
                                                step="0.01"
                                            />
                                            {errors.customAmount && (
                                                <p className="text-red-500 text-xs mt-1">{errors.customAmount}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Subscription Type */}
                                <div className='flex w-full items-center'>
                                    <label className="w-2/6 text-left text-sm text-textSecondary">
                                        Subscription Type
                                    </label>
                                    <div className="w-4/6 flex flex-col gap-2">
                                        <div className="flex gap-4 items-center">
                                            {["Monthly", "Yearly"].map((type) => (
                                                <label key={type} className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="subscriptionType"
                                                        value={type.toLowerCase()}
                                                        checked={formData.subscriptionType === type.toLowerCase()}
                                                        onChange={handleChange}
                                                    />
                                                    {type}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.subscriptionType && (
                                            <p className="text-red-500 text-xs">{errors.subscriptionType}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="pt-4 mb-3 flex justify-end gap-3">
                                    <MainButton
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                        }}
                                        className="bg-gray-600 px-3"
                                        radius='rounded-xl'
                                    >
                                        Cancel
                                    </MainButton>
                                    <MainButton 
                                        type="submit" 
                                        className="px-3" 
                                        radius='rounded-xl'
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Continue to Payment'}
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

export default AddTenantForm;