import { cn } from "../../../lib/utils";

const MainButton = ({ children, color = "bg-primary", radius = "rounded-4xl", onClick, className = "", ...props }) => {
  return (
    <button
      className={cn(`${color} hover:scale-105 text-white cursor-pointer font-medium py-3 px-4 ${radius} shadow-md  ${className}`)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default MainButton;