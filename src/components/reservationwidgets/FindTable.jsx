import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainButton from "../common/buttons/MainButton";
import { getAvailableTables } from "../reservationwidgets/widgetApi";
import { User } from "react-iconly";
import { Sun, Moon, Coffee, Clock } from "lucide-react";

// Define meal types with their time ranges
const MEAL_TYPES = [
  {
    id: "breakfast",
    label: "Breakfast",
    icon: <Coffee set="bold" size={20} />,
    timeRange: ["06:00", "11:00"],
    color: "bg-amber-100 text-amber-800"
  },
  {
    id: "lunch",
    label: "Lunch",
    icon: <Sun set="bold" size={20} />,
    timeRange: ["11:00", "16:00"],
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "dinner",
    label: "Dinner",
    icon: <Moon set="bold" size={20} />,
    timeRange: ["16:00", "23:00"],
    color: "bg-indigo-100 text-indigo-800"
  }
];

// Helper to convert 24h to 12h format
const formatTime = (time, is12Hour) => {
  if (!is12Hour) return time;
  
  const [hours, minutes] = time.split(':');
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes} ${period}`;
};

const FindTable = ({ data, update, onContinue, locationId }) => {
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [is12Hour, setIs12Hour] = useState(true);

  const handleSearch = async () => {
    if (!data.people || !data.date) {
      setError("Please fill all fields.");
      return;
    }

    setAvailableTimeSlots([
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30'
    ])
    setShowTimeSelection(true)

    setError("");
    setLoading(true);
    
    try {
    //   const response = await getAvailableTables(locationId, {
    //     partySize: data.people,
    //     date: data.date,
    //     mealType: selectedMeal // Pass meal type to API
    //   });
      
    //   if (response.success) {
    //     setAvailableTimeSlots(response.tableAvailableTime || []);
    //     setShowTimeSelection(true);
    //   } else {
    //     setError(response.message || "Could not fetch tables.");
    //   }
    } catch (err) {
      setError("Failed to fetch available tables.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    update("time", time);
  };

  const handleMealSelect = (mealId) => {
    setSelectedMeal(mealId);
    setSelectedTime("");
    // You might want to refetch times when meal type changes
    // handleSearch();
  };

  // Filter times based on selected meal type
  const getFilteredTimes = () => {
    const currentMeal = MEAL_TYPES.find(m => m.id === selectedMeal);
    if (!currentMeal) return availableTimeSlots;
    
    return availableTimeSlots.filter(time => {
      const [hour] = time.split(':');
      const hourNum = parseInt(hour, 10);
      const [start, end] = currentMeal.timeRange.map(t => parseInt(t.split(':')[0], 10));
      return hourNum >= start && hourNum < end;
    });
  };

  return (
    <div className=" w-full max-h-80 overflow-y-auto overflow-x-hidden scrollbar-none">
      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="w-full flex flex-col gap-4">
          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}

          <div className="flex items-center justify-center gap-5">
            {/* People Selector */}
            <div className="w-full border border-gray-200 p-3 text-sm rounded-xl flex items-center gap-2 bg-white shadow-sm hover:shadow-md transition-shadow">
              <User set="bold" size={20} className="text-gray-500" />
              <select
                value={data?.people || ""}
                onChange={(e) => update("people", e.target.value)}
                className="w-full bg-transparent outline-none appearance-none"
              >
                <option value="" disabled className="bg-white">How many people?</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num} className="bg-white hover:bg-widgetColor">
                    {num} {num === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="w-full border border-gray-200 p-3 text-sm rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <input
                type="date"
                value={data.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Find Button */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          duration={{time: 500}}
          className="pt-1 pb-3"
        >
          <MainButton 
            onClick={handleSearch}
            className=" py-2 rounded-xl bg-widgetColor text-white font-medium shadow-md hover:shadow-widgetColor/50 "
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loader w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                Finding Tables...
              </div>
            ) : (
              "Find Available Tables"
            )}
          </MainButton>
        </motion.div>
      </motion.div>

      {/* Time Selection Section */}
      <AnimatePresence>
        {showTimeSelection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className=" space-y-3 overflow-hidden"
          >
            {/* Meal Type Selector */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
                <hr />
              <div className="flex gap-3">
                {MEAL_TYPES.map((meal) => (
                  <motion.button
                    key={meal.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMealSelect(meal.id)}
                    className={`flex-1 flex flex-col sm:flex-row items-center gap-2 p-2 text-xs rounded-xl border-2 transition-all ${
                      selectedMeal === meal.id 
                        ? `${meal.color.replace('bg-', 'bg-')} border-transparent shadow-md`
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {meal.icon}
                    <span className="font-medium">{meal.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Time Slot Selector */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm sm:text-lg font-medium text-gray-800">Available Time Slots</h3>
                <button 
                  onClick={() => setIs12Hour(!is12Hour)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <Clock set="bold" size={16} />
                  <span>{is12Hour ? "Switch to 24h" : "Switch to 12h"}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {getFilteredTimes().map((time) => (
                  <motion.button
                    key={time}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectTime(time)}
                    className={`p-2 rounded-lg border transition-all text-xs  ${
                      selectedTime === time
                        ? "bg-widgetColor text-white shadow-lg"
                        : "bg-white border-gray-200 hover:border-widgetColor/30 hover:bg-widgetColor/10"
                    }`}
                  >
                    <span className="font-medium">
                      {formatTime(time, is12Hour)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Continue Button */}
            {selectedTime && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="pt-4"
              >
                <MainButton 
                  onClick={onContinue}
                  className=" py-3 rounded-xl bg-widgetColor text-white font-medium shadow-md hover:shadow-green-200/50"
                >
                  Continue to Reservation
                </MainButton>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindTable;