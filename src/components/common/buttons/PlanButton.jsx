import { cn } from "../../../lib/utils";

const PlanButton = ({ children, radius = "rounded-lg", onClick, className = "", ...props }) => {
  return (
    <button
      className={cn(`bg-linear-65 from-[#12101D] to-[#514883] w-5/6 text-white font-light text-xs py-2 lg:text-sm ${radius} shadow-md cursor-pointer shadow-gray-400 ${className}`)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default PlanButton;