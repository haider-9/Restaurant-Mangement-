
import TextArea from "../common/TextArea";
import Button from "../common/buttons/MainButton";
import ReservationSummary from "./ReservationSummary";

const SpecialRequest = ({ data, update, onConfirm, onPrevious }) => {
  return (
    <div className="space-y-4">

      <ReservationSummary data={data} />

      <h2 className="text-lg text-textPrimary font-semibold text-center">Enter Your Details</h2>

      {/* Textareas */}
      <TextArea
        placeholder="Any Special Request"
        value={data.specialRequest}
        onChange={(val) => update("specialRequest", val)}
      />
      <TextArea
        placeholder="Any Allergy"
        value={data.allergy}
        onChange={(val) => update("allergy", val)}
      />

      {/* Confirm Button */}
      <div className="text-center pt-4 flex justify-end gap-2">
        <Button onClick={onPrevious} className="px-4 bg-textSecondary">Back</Button>
        <Button onClick={onConfirm} className="px-4 bg-widgetColor">Confirm Reservation</Button>
      </div>
    </div>
  );
};

export default SpecialRequest;
