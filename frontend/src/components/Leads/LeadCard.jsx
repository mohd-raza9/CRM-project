import { Link } from "react-router-dom";
import { HiOutlinePhone, HiOutlineUser } from "react-icons/hi";

const sourceColors = {
  website: "bg-blue-100 text-blue-700",
  whatsapp: "bg-green-100 text-green-700",
  call: "bg-yellow-100 text-yellow-700",
  social: "bg-purple-100 text-purple-700",
  referral: "bg-pink-100 text-pink-700",
  walkin: "bg-orange-100 text-orange-700",
};

const LeadCard = ({ lead }) => {
  return (
    <Link to={`/leads/${lead._id}`} className="block">
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer mb-2">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-800 truncate flex-1">
            {lead.name}
          </h4>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              sourceColors[lead.source] || "bg-gray-100 text-gray-700"
            }`}
          >
            {lead.source}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <HiOutlinePhone className="w-3 h-3" />
          {lead.phone}
        </div>

        {lead.assigned_agent && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineUser className="w-3 h-3" />
            {lead.assigned_agent.name || "Unassigned"}
          </div>
        )}
      </div>
    </Link>
  );
};

export default LeadCard;