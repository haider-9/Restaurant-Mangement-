import Button from "../common/buttons/MainButton";
import ReservationSummary from "./ReservationSummary";
import { createReservation } from "./widgetApi";
import { useState } from "react";

const ConfirmReservation = ({ data, onExit, onPrevious, locationId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleConfirm = async () => {
        

        const payload = {
            customerName: data.fullName,
            email: data.email,
            phone: data.phone,
            zipCode: data.zip,
            notify: data.notify,
            specialRequests: data.specialRequest,
            allergies: data.allergy,
            partySize: data.people,
            date: data.date,
            time: data.time,
        };

        setLoading(true);
        setError("");

        const response = await createReservation(locationId, payload);

        setLoading(false);

        if (response.success) {
            setSuccess(true);
        } else {
            setError(response.message || "Reservation failed. Please try again.");
        }
    };

    return (
        <div className="space-y-6">
            {!success ? (
                <>
                    <p className="mb-3 text-sm text-textPrimary font-semibold">
                        Please review your reservation before confirming.
                    </p>

                    <div className="p-4 border-t-2 border-gray-300">
                        <p className="mb-3 text-[16px] font-semibold text-textPrimary">Reservation Details</p>

                        <ReservationSummary data={data} />

                        <div className="flex justify-center">
                            <ul className="space-y-4 text-sm mt-5 text-left">
                                <li><strong>Name:</strong> {data.fullName}</li>
                                <li><strong>Email:</strong> {data.email}</li>
                                <li><strong>Phone no:</strong> {data.phone}</li>
                                <li><strong>ZIP Code:</strong> {data.zip}</li>
                            </ul>
                        </div>
                    </div>

                    {error && <div className="text-center text-red-500 text-sm">{error}</div>}

                    <div className="text-center flex justify-center gap-2">
                        <Button onClick={onPrevious} className="px-4 bg-textSecondary">Back</Button>
                        <Button
                            onClick={handleConfirm}
                            className="px-4 bg-widgetColor"
                            disabled={loading}
                        >
                            {loading ? "Confirming..." : "Confirm Reservation"}
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-center text-green-600 font-semibold text-lg">🎉 Reservation confirmed successfully!</p>
                    <div className="text-center">
                        <Button onClick={onExit} className="px-4 bg-widgetColor mt-4">Exit</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfirmReservation;
