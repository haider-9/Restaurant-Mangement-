import { useState } from "react";
import Button from "../common/buttons/MainButton";
import Input from "../common/Input";
import ReservationSummary from "./ReservationSummary";
import { MessageSquareIcon, Mail } from "lucide-react";

const EnterDetails = ({ data, update, onNext, onPrevious }) => {
    const [notifyEmail, setNotifyEmail] = useState(data.notifyEmail || false);
    const [notifySMS, setNotifySMS] = useState(data.notifySMS || false);
    const [error, setError] = useState("");

    const handleToggleNotifyEmail = () => {
        setNotifyEmail((prev) => {
            update("notifyEmail", !prev);
            return !prev;
        });
    };

    const handleToggleNotifySMS = () => {
        setNotifySMS((prev) => {
            update("notifySMS", !prev);
            return !prev;
        });
    };

    const handleNext = () => {
        if (
            !data.fullName?.trim() ||
            !data.email?.trim() ||
            !data.phone?.trim() ||
            !data.zip?.trim()
        ) {
            setError("Please fill out all required fields.");
            return;
        }

        setError("");
        onNext();
    };

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <ReservationSummary data={data} />

            <h2 className="text-2xl font-bold text-center text-gray-800">
                Enter Your Details
            </h2>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-center">
                    {error}
                </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
                <Input
                    placeholder="Full Name *"
                    value={data?.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <Input
                    placeholder="Email *"
                    type="email"
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <Input
                    placeholder="Phone Number *"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <Input
                    placeholder="ZIP Code *"
                    value={data.zip}
                    onChange={(e) => update("zip", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
            </div>

            {/* Notification Options */}
            <div className="space-y-3 w-full  flex items-center justify-center">
                {/* Email Notification */}
                <div 
                    onClick={handleToggleNotifyEmail}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${notifyEmail ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                >
                    
                    <div className="flex items-center">
                        <div className={`p-2 rounded-full ${notifyEmail ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-600'}`}>
                            <Mail set="bold" size={20} />
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notifyEmail ? 'bg-amber-500' : 'bg-gray-300'}`}>
                        <div className={`h-4 w-4 rounded-full bg-white shadow-md transform transition-transform ${notifyEmail ? 'translate-x-6' : ''}`}></div>
                    </div>
                </div>
                
                {/* SMS Notification */}
                <div 
                    onClick={handleToggleNotifySMS}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${notifySMS ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${notifySMS ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                            <MessageSquareIcon set="bold" size={20} />
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${notifySMS ? 'bg-blue-500' : 'bg-gray-300'}`}>
                        <div className={`h-4 w-4 rounded-full bg-white shadow-md transform transition-transform ${notifySMS ? 'translate-x-6' : ''}`}></div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
                <Button 
                    onClick={onPrevious}
                    className="px-6 py-3 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                    Back
                </Button>
                <Button 
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 rounded-lg font-medium shadow-md hover:shadow-amber-200 transition-all"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default EnterDetails;