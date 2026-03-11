import { HiOutlineCheck, HiOutlineX, HiOutlinePhone } from "react-icons/hi";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const ReminderNotifications = ({ followups, onComplete, onClose }) => {
  return (
    <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <h3 className="font-semibold text-sm text-gray-700">
          Follow-up Reminders ({followups.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-80">
        {followups.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No pending reminders 🎉
          </div>
        ) : (
          followups.map((f) => (
            <div
              key={f._id}
              className="px-4 py-3 border-b border-gray-50 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/leads/${f.lead_id?._id}`}
                    className="text-sm font-medium text-gray-800 hover:text-primary-600"
                    onClick={onClose}
                  >
                    {f.lead_id?.name || "Unknown Lead"}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <HiOutlinePhone className="w-3 h-3" />
                    {f.lead_id?.phone}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{f.reason}</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(f.reminder_date), "MMM dd, hh:mm a")}
                  </p>
                </div>
                <button
                  onClick={() => onComplete(f._id)}
                  className="shrink-0 p-1.5 text-green-600 hover:bg-green-100 rounded-lg"
                  title="Mark as done"
                >
                  <HiOutlineCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReminderNotifications;