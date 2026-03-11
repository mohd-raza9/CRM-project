import { useState } from "react";
import { HiOutlineBell } from "react-icons/hi";
import ReminderNotifications from "../Common/ReminderNotifications";
import { useFollowups } from "../../hooks/useFollowups";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { followups, count, markComplete } = useFollowups();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {getGreeting()}
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HiOutlineBell className="w-6 h-6" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>

        {showNotifications && (
          <ReminderNotifications
            followups={followups}
            onComplete={markComplete}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>
    </header>
  );
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 17) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
}

export default Navbar;