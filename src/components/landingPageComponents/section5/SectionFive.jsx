/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import PlanButton from '../../common/buttons/PlanButton';
import Package from '../../../assets/images/landing/package.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../../common/ConfirmationModal';
import DropdownSelect from '../../common/DropdownSelect';
import Api from '../../../config/api';
import { loadStripe } from '@stripe/stripe-js';

const SectionFive = () => {
  const [billing, setBilling] = useState('monthly');
  const [swiperReady, setSwiperReady] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  const plans = useSelector(state => state.plan.plans);
  const { status, userData } = useSelector(state => state.auth);

  const handleChoosePlan = (plan) => {
    if (!status) {
      setSelectedPlan(plan);
      setShowLoginModal(true);
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    navigate('/auth/login', {
      state: { from: '/' } // To redirect back after login
    });
  };

  const handlePaymentConfirm = async () => {
    // Redirect to login if not authenticated
    if (!status) {
      navigate("/auth/login", { state: { from: window.location.pathname } });
      return;
    }

    // setSelectedPlan(planKey);
    setError("");
    
    try {
      // Initialize Stripe
      const stripe = await loadStripe(
        "pk_test_51RglbC08uh9iC2XpRQIfHgG3MrvTHRTz9Iwt6MJWzKwcDyRF1tj2grewT386bPaowFUk0yUkRezPR61WBBO6pgch00ZaHxLcFz"
      );

      const plan = selectedPlan?.planName;
      console.log('plan', plan)
      if (!plan) {
        throw new Error("Selected plan is not available");
      }
      
      // Validate plan data matches backend requirements
      // if (!plan.name || !plan.bestFor) {
        //   throw new Error("Invalid plan structure: missing name or description");
        // }
        
        // Convert prices to numbers as backend expects
        const monthlyPrice = Number(selectedPlan.pricePerMonth);
        const yearlyPrice = Number(selectedPlan.pricePerYear);

      console.log('monthlyPrice', monthlyPrice)
      if (isNaN(monthlyPrice) || isNaN(yearlyPrice)) {
        throw new Error("Invalid price values");
      }
      
      // Prepare request body matching backend schema
      const requestBody = {
        planId: selectedPlan._id,
        userId: userData._id,
        subscriptionType: subscriptionType, // 'monthly' or 'yearly'
      };
      
      // Call backend endpoint
      const paymentApi = new Api('/api/payment')
      const response = await paymentApi.post("/checkout",
        requestBody
      );
      console.log('response', response)
      
      if (response) {
        const result = await stripe.redirectToCheckout({
          sessionId: response.sessionId,
        });
        
        if (result.error) {
          setError(result.error.message);
        }
      } else {
        setError(
          response.message || "Payment initialization failed"
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment processing failed");
    }
  };
  // const handlePaymentConfirm = async () => {
  //   if (!selectedPlan || !userData?._id) {
  //     console.log('selectedPlan', selectedPlan)
  //     console.log('userData', userData)
  //     return
  //   };

  //   setIsProcessing(true);
  //   setError(null);

  //   // Payment function that matches backend requirements

  //   try {

  //     const stripe = await loadStripe(
  //       "pk_test_51RglbC08uh9iC2XpRQIfHgG3MrvTHRTz9Iwt6MJWzKwcDyRF1tj2grewT386bPaowFUk0yUkRezPR61WBBO6pgch00ZaHxLcFz"
  //     );

  //     // console.log('selectedPlan', selectedPlan)
  //     console.log('plans', plans)

  //     // const plan = plans[planKey];
  //     if (!selectedPlan) {
  //       throw new Error("Selected plan is not available");
  //     }


  //     // Convert prices to numbers as backend expects
  //     const monthlyPrice = Number(selectedPlan.monthlyPrice);
  //     const yearlyPrice = Number(selectedPlan.yearlyPrice);

  //     // if (isNaN(monthlyPrice) || isNaN(yearlyPrice)) {
  //     //   throw new Error("Invalid price values");
  //     // }

  //     const paymentApi = new Api('/api/payment')

  //     console.log(selectedPlan?._id, userData?._id)
    
  //     const response = await paymentApi.post('/checkout', {
  //       planId: selectedPlan?._id,
  //       userId: userData?._id,
  //       subscriptionType: subscriptionType
  //     });

  //     console.log('response', response)

  //     if (response.data.success) {
  //         // Redirect to Stripe checkout
  //         const result = await stripe.redirectToCheckout({
  //           sessionId: response.data.sessionId,
  //         });

  //         if (result.error) {
  //           setError(result.error.message);
  //         }
  //       } else {
  //         setError(
  //           response.data.message || "Payment initialization failed"
  //         );
  //       }
  //   } catch (err) {
  //     console.error('Payment error:', err);
  //     setError(err.response?.data?.message || 'Payment processing failed');
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  return (
    <section id='pricing' className="-pt-10 md:py-10 px-2 lg:px-16 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-[40px] font-bold">Choose your Plan</h2>
        <p className="text-gray-600 mt-2">Flexible pricing tailored to your restaurant’s needs.</p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="w-[15rem] bg-gray-200 rounded-lg flex p-0.5 shadow-lg shadow-gray-300">
          <button
            className={`flex-1 py-1 text-sm rounded-lg transition-all duration-300 ${billing === 'monthly' ? 'bg-white text-textSecondary' : 'text-textSecondary'}`}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            className={`flex-1 py-1 text-sm rounded-lg transition-all duration-300 ${billing === 'annual' ? 'bg-white text-textSecondary' : ' text-textSecondary'}`}
            onClick={() => setBilling('annual')}
          >
            Annual
            <span className="text-[10px] text-primary"> (save 20%)</span>
          </button>
        </div>
      </div>

      {/* Login Required Modal */}
      <ConfirmationModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
        label="Login Required"
        message="You need to login to choose a plan. Would you like to login now?"
        confirmText="Login"
        cancelText="Cancel"
      />


      {/* Payment Confirmation Modal */}
      <ConfirmationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={() => handlePaymentConfirm()}
        label="Confirm Subscription"
        confirmText={isProcessing ? "Processing..." : "Proceed to Payment"}
        cancelText="Cancel"
        disableConfirm={isProcessing}
      >
        {selectedPlan && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Plan:</span>
              <span>{selectedPlan.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Price:</span>
              <span>
                ${subscriptionType === 'monthly'
                  ? selectedPlan.pricePerMonth
                  : selectedPlan.pricePerYear}
                /{subscriptionType === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            <div className="mt-4">
              <DropdownSelect
                label="Subscription Type"
                options={[
                  { id: 'monthly', label: 'Monthly', value: 'monthly' },
                  { id: 'yearly', label: 'Yearly (Save 20%)', value: 'yearly' }
                ]}
                selected={subscriptionType}
                onChange={(opt) => setSubscriptionType(opt.value)}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
          </div>
        )}
      </ConfirmationModal>

      {/* Mobile: Swiper Slider */}
      <div className="relative md:hidden w-full">
        {/* ... existing swiper code ... */}
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            if (prevRef.current && nextRef.current) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          onSwiper={() => setSwiperReady(true)}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
        >
          {plans?.map((plan, index) => (
            <SwiperSlide key={plan.id}>
              <PlanCard
                plan={plan}
                billing={billing}
                index={index}
                onChoosePlan={() => handleChoosePlan(plan)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Tablet: Column layout */}
      <div className="hidden md:flex lg:hidden flex-col gap-6">
        {plans?.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billing={billing}
            index={index}
            onChoosePlan={() => handleChoosePlan(plan)}
          />
        ))}
      </div>

      {/* Laptop & Desktop: 3 Column Grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {plans?.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billing={billing}
            index={index}
            onChoosePlan={() => handleChoosePlan(plan)}
          />
        ))}
      </div>
    </section>
  );
};

const PlanCard = ({ plan, billing, index, onChoosePlan }) => (
  <motion.div
    className="relative bg-white rounded-xl shadow-lg p-2 lg:hover:-translate-y-4 duration-300 lg:hover:shadow-primary flex flex-col md:flex-row lg:flex-col md:items-center border border-gray-200"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 * index }}
  >

    {/* Left Section */}
    <div className="flex-1 md:w-1/2 lg:w-full lg:pt-5">
      <div className="flex justify-between mb-4 w-full">
        <div className='w-4/5 pt-5 pl-5'>
          <h3 className="text-2xl font-semibold text-left text-textPrimary">{plan.planName}</h3>
          <p className="text-xs text-justify lg:text-sm text-textSecondary mt-1">{plan.description}</p>
        </div>

      </div>
      <div className="text-2xl text-left pl-5 font-bold text-textPrimary mb-4">${billing === "monthly" ? plan.pricePerMonth : plan.pricePerYear}</div>
      <PlanButton onClick={onChoosePlan}>Choose Plan</PlanButton>
    </div>

    {/* Right Section */}
    <div className="mt-2 md:mt-6 md:ml-6 lg:ml-0 lg:mt-6 md:border-t-0 md:border-l-gray-300 md:border-l lg:border-none pt-6 md:pl-6 lg:pl-0 lg:pt-3 md:w-1/2 lg:w-full md:pb-5">
      <p className="text-sm text-gray-600 mb-3">What’s included:</p>
      <ul className="space-y-2 pl-5">
        {plan.access?.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-xs text-gray-700">
            <CheckCircle className="w-5 h-5 text-textPrimary" /> {feature}
          </li>
        ))}
      </ul>
    </div>

    <div className='absolute top-3 right-3'>
      <img src={Package} alt="" className='h-15 w-15' />
    </div>
  </motion.div>
);

export default SectionFive;
