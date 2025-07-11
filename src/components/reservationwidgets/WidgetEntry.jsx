import { useEffect, useState } from "react";
import WidgetFAB from "./WidgetFAB";
import ReservationWidgetModal from "./ReservationWidgetModal";
import ReservationWidgetWrapper from "./ReservationWidgetWrapper";

const WidgetEntry = ({locationId}) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [locationId, setLocationId] = useState(null);

  // useEffect(() => {
  //   // Get current script tag with 'data-location' attribute
  //   const currentScript = document.currentScript || document.querySelector('script[data-location]');
  //   const locId = currentScript?.getAttribute('data-location');
  //   if (locId) {
  //     setLocationId(locId);
  //   }
  // }, []);

  // locationId={"AB002L1"}

  return (
    <>
      <WidgetFAB onClick={() => setIsOpen((prev) => !prev)} />
      <ReservationWidgetModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ReservationWidgetWrapper locationId={'AB002L1'} />
      </ReservationWidgetModal>
    </>
  );
};

export default WidgetEntry;
