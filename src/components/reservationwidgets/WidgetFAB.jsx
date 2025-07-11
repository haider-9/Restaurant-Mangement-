
import { CalendarCheck2 } from "lucide-react";

const WidgetFAB = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-60 bg-widgetColor text-white p-4 rounded-full shadow-lg hover:bg-widgetColor/90 transition"
    >
      <CalendarCheck2 size={24} />
    </button>
  );
};

export default WidgetFAB;
