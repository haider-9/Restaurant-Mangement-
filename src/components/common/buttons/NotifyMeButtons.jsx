
import { Bell, BellOff } from "lucide-react";

const NotifyMeButton = ({ isEnabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-center gap-2 border px-3 py-2 rounded-xl text-xs transition ${
        isEnabled ? "bg-widgetColor text-white" : "bg-white hover:bg-gray-100"
      }`}
    >
      {isEnabled ? <Bell size={16}/> : <BellOff size={16}/>}
      Notify Me
    </button>
  );
};

export default NotifyMeButton;
