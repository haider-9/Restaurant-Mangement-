import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const FailurePage = () => {
  const navigate = useNavigate();
  
  // Dummy data
  const orderDetails = {
    orderId: "ORD-78945612",
    date: new Date().toLocaleDateString(),
    planName: "Premium Tenant Plan",
    duration: "1 Year",
    price: "$299.00",
    reason: "Insufficient funds",
    paymentMethod: "VISA ending in 4242"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Payment Failed
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            We couldn't process your payment for the {orderDetails.planName}.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Error Header */}
          <div className="bg-red-50 px-6 py-8 sm:px-10 sm:py-12 flex flex-col items-center">
            <div className="bg-red-100 rounded-full p-3 mb-4">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Payment unsuccessful
            </h2>
            <p className="text-red-600">
              Order ID: {orderDetails.orderId}
            </p>
            <p className="mt-2 text-red-600 font-medium">
              Reason: {orderDetails.reason}
            </p>
          </div>

          {/* Order Details */}
          <div className="px-6 py-8 sm:px-10 sm:py-12 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Plan Name</p>
                <p className="mt-1 text-sm text-gray-900">{orderDetails.planName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="mt-1 text-sm text-gray-900">{orderDetails.duration}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Order Date</p>
                <p className="mt-1 text-sm text-gray-900">{orderDetails.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="mt-1 text-sm text-gray-900 font-bold">{orderDetails.price}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="mt-1 text-sm text-gray-900">{orderDetails.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1 text-sm text-red-600 font-medium">Failed</p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="px-6 py-8 sm:px-10 sm:py-12 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              What you can do next
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5 mr-2">1.</div>
                <div>
                  <p className="text-gray-700 font-medium">Try again with a different payment method</p>
                  <p className="text-gray-500 text-sm">Update your payment details and retry the transaction.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5 mr-2">2.</div>
                <div>
                  <p className="text-gray-700 font-medium">Check your payment details</p>
                  <p className="text-gray-500 text-sm">Ensure your card details are correct and funds are available.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5 mr-2">3.</div>
                <div>
                  <p className="text-gray-700 font-medium">Contact your bank</p>
                  <p className="text-gray-500 text-sm">Your bank may be blocking the transaction for security reasons.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="px-6 py-8 sm:px-10 sm:py-12 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-medium text-gray-900">
                  Need help with your payment?
                </h3>
                <p className="text-gray-500">
                  Our support team is here to help you complete your purchase.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/tenantOnboarding')}
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Payment Again
                </button>
                <button
                  onClick={() => navigate('/support')}
                  className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please contact our support team immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FailurePage;