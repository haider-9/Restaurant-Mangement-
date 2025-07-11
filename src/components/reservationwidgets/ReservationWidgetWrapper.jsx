import { useState } from "react";
import FindTable from "./FindTable";
import EnterDetails from "./EnterDetails";
import SpecialRequest from "./SpecialRequest";
import ConfirmReservation from "./ConfirmReservation";

const ReservationWidgetWrapper = ({ locationId }) => {
    const [step, setStep] = useState(1);
    const [reservationData, setReservationData] = useState({
        people: "",
        date: "",
        time: "",
        table: "",
        fullName: "",
        email: "",
        phone: "",
        zip: "",
        notify: false,
        specialRequest: "",
        allergy: "",
    });

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const updateData = (key, value) => {
        setReservationData((prev) => ({ ...prev, [key]: value }));
    };

    const steps = {
        1: <FindTable data={reservationData} update={updateData} onContinue={nextStep} locationId={locationId}/>,
        2: <EnterDetails data={reservationData} update={updateData} onNext={nextStep} onPrevious={prevStep} />,
        3: <SpecialRequest data={reservationData} update={updateData} onConfirm={nextStep} onPrevious={prevStep} />,
        4: <ConfirmReservation data={reservationData} onPrevious={prevStep} onExit={() => setStep(1)} locationId={locationId} />,
    };


    return (
        <div className="space-y-4 w-full font-inter">
            {/* ✅ Step Checkpoints */}
            <h2 className="text-xl font-semibold text-center text-textPrimary">{step ===4 ? 'Reservation Confirmed' : 'Make Reservation'}</h2>
            {

                <div className="flex justify-center gap-6 text-sm font-medium">
                <div className={`flex items-center py-2 px-1 gap-2 ${step === 1 ? "border-b-2 border-b-widgetColor" : "text-gray-500"}`}>
                    <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${step === 1 ? "bg-widgetColor text-white border-widgetColor" : "text-gray-500 border-gray-300"
                            }`}
                    >
                        1
                    </div>
                    <span className={step === 1 ? "text-widgetColor" : "text-gray-500"}>
                        Find a Table
                    </span>
                </div>

                <div className={`flex items-center py-2 px-1 gap-2 ${step >= 2 ? "border-b-2 border-b-widgetColor" : "text-gray-500"}`}>
                    <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${step >= 2 ? "bg-widgetColor text-white border-widgetColor " : "text-gray-500 border-gray-300"
                            }`}
                    >
                        2
                    </div>
                    <span className={step >= 2 ? "text-widgetColor" : "text-gray-500"}>
                        Enter Details
                    </span>
                </div>
            </div>
            }

            {/* Step Content */}
            <div className="w-full">{steps[step]}</div>
        </div>
    );
};

export default ReservationWidgetWrapper;
