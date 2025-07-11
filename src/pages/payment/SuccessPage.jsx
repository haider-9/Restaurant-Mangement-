import Api from "@/config/api";
import paymentApi from "@/config/paymentApi";
import tenantApi from "@/config/tenantApi";
import {
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  ClockIcon,
  CreditCardIcon,
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  ShieldCheckIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
// import { c } from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
// import { useAuth } from "../context/auth";

const PaymentSuccess = () => {
  const [formData, setFormData] = useState({
    tenantName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [subsDetails, setSubsDetails] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // const [auth] = useAuth();
  const userData = useSelector(state => state.auth.userData)

  const query = new URLSearchParams(window.location.search);
  const sessionId = query.get("session_id");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        
        // Fetch session details
        const sessionRes = await paymentApi.get(`/confirm?sessionId=${sessionId}`);
        console.log('sessionRes', sessionRes)

        if (sessionRes.success) {
          setSubsDetails(sessionRes.session);
          console.log(sessionRes.session);
          console.log(sessionRes.session.createdAt);

          // Pre-fill email from session if available
          setFormData((prev) => ({
            ...prev,
            email: sessionRes.session.customerEmail || "",
          }));

          // Fetch plan details if planId exists
          if (sessionRes.session.planId) {
            const planApi = new Api('/api/plans')
            const planRes = await planApi.get(`/${sessionRes?.session?.planId}`);
            console.log('planRes', planRes)
            if (planRes.data) {
              setPlanDetails(planRes.data.plan);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load payment details. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchData();
  }, [sessionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await tenantApi.post("", {
        ...formData,
        planId: subsDetails?.metadata.planId,
        sessionId,
        subscriptionType: subsDetails?.metadata.subscriptionType,
        userId: userData?._id,
      });

      console.log('response tenant', response)

      if (response.success) {
        navigate("/dashboard", {
          state: {
            success: "Organization setup completed successfully!",
            tenant: response.tenant,
          },
        });
      }
    } catch (err) {
      console.error("Error creating tenant:", err);
      setError(
        err.response?.data?.message ||
          "Failed to complete setup. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subsDetails?.currency || "USD",
    }).format(amount / 100);
  };

  // Calculate savings for annual plan
  const calculateSavings = () => {
    if (!planDetails || subsDetails?.subscriptionType !== "yearly") return null;

    const monthlyCost = planDetails.pricePerMonth * 12;
    const yearlyCost = planDetails.pricePerYear;
    const savings = monthlyCost - yearlyCost;

    return savings > 0 ? savings : null;
  };

  const savings = calculateSavings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading your payment details...
          </p>
        </div>
      </div>
    );
  }

  if (!subsDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <InformationCircleIcon className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Payment Details Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            We couldn't retrieve your payment information. Please check your
            email for confirmation or contact support if you need assistance.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Header */}
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
            Payment Successful!
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Thank you for subscribing to our{" "}
            {planDetails?.planName || subsDetails?.planName} plan.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl font-bold">Order Confirmation</h2>
                <p className="text-blue-100 mt-1">
                  Your subscription is now active
                </p>
              </div>
              <div className="mt-4 md:mt-0 bg-white/10 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">
                  Order # {subsDetails?.sessionId?.slice(0, 8) || "N/A"}
                </p>
                <p className="text-xs text-blue-100 mt-1">
                  Paid on{" "}
                  {new Date(subsDetails?.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 text-primary mr-2" />
                  Subscription Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Plan Name</p>
                    <p className="font-medium capitalize">
                      {planDetails?.planName || subsDetails?.planName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Billing Cycle</p>
                    <div className="flex items-center">
                      <p className="font-medium capitalize">
                        {subsDetails?.subscriptionType || "N/A"}
                      </p>
                      {savings && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                          Save {formatCurrency(savings * 100)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {new Date(subsDetails?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  {subsDetails?.subscriptionType === "yearly" && (
                    <div>
                      <p className="text-sm text-gray-500">Renewal Date</p>
                      <p className="font-medium">
                        {new Date(
                          new Date(subsDetails?.createdAt).setFullYear(
                            new Date(subsDetails?.createdAt).getFullYear() + 1
                          )
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-primary mr-2" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium">
                      {formatCurrency(subsDetails?.amount_total || 0)}
                      {planDetails && (
                        <span className="text-sm text-gray-500 ml-1">
                          /
                          {subsDetails?.subscriptionType === "yearly"
                            ? "year"
                            : "month"}
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(subsDetails?.payment_method_types) &&
                      subsDetails.payment_method_types.length > 0 ? (
                        subsDetails.payment_method_types.map(
                          (method, index) => (
                            <span
                              key={index}
                              className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm capitalize"
                            >
                              {method.replace(/_/g, " ")}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subsDetails?.payment_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {subsDetails?.payment_status === "paid"
                          ? "Completed"
                          : "Processing"}
                      </span>
                      {subsDetails?.transactionId && (
                        <span className="ml-2 text-xs text-gray-500 truncate">
                          ID: {subsDetails.transactionId.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-primary mr-2" />
                  Plan Features
                </h3>
                <ul className="space-y-2">
                  {planDetails?.access?.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  <li className="flex items-start">
                    <LifebuoyIcon className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">24/7 Customer Support</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheckIcon className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      Secure Data Encryption
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Setup Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <BuildingOfficeIcon className="h-6 w-6 text-primary mr-2" />
              Organization Setup
            </h2>
            <p className="text-gray-600 mt-1">
              Complete these details to configure your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="tenantName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="tenantName"
                    name="tenantName"
                    value={formData.tenantName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Acme Corporation"
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This will be your organization's display name
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="contact@yourcompany.com"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Important notifications will be sent here
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    For urgent account-related matters
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Information
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Special requirements, expected usage, or anything else we should know..."
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This helps us better serve your needs
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-md text-base font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors min-w-[180px] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Setting Up...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            What happens next?
          </h3>
          <ol className="space-y-3 list-decimal list-inside text-blue-700">
            <li>We'll configure your organization account within 15 minutes</li>
            <li>You'll receive a welcome email with setup instructions</li>
            <li>Our team will reach out to schedule an onboarding call</li>
            <li>You can start adding your team members and locations</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-100 rounded-md flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Need immediate assistance? Contact our support team at{" "}
              <a
                href="mailto:support@yourcompany.com"
                className="font-medium underline"
              >
                support@yourcompany.com
              </a>{" "}
              or call{" "}
              <a href="tel:+18001234567" className="font-medium underline">
                +1 (800) 123-4567
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
