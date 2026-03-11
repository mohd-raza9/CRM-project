import { useState, useEffect } from "react";
import API from "../api/axios";
import VisitForm from "../components/Visits/VisitForm";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { HiOutlinePlus } from "react-icons/hi";
import { Link } from "react-router-dom";

const visitStatusColors = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  rescheduled: "bg-yellow-100 text-yellow-700",
  no_show: "bg-red-100 text-red-700",
  booked: "bg-emerald-100 text-emerald-700",
};

const VisitSchedulerPage = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchVisits = async () => {
    try {
      const params = {};
      if (filter) params.visit_status = filter;
      const { data } = await API.get("/visits", { params });
      setVisits(data);
    } catch (err) {
      console.error("Failed to fetch visits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [filter]);

  const handleStatusUpdate = async (visitId, newStatus) => {
    try {
      await API.patch(`/visits/${visitId}`, { visit_status: newStatus });
      toast.success("Visit status updated!");
      fetchVisits();
    } catch (err) {
      toast.error("Failed to update visit");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visit Scheduler</h1>
          <p className="text-sm text-gray-500">
            Manage all property visit appointments
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Schedule Visit
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["", "scheduled", "completed", "rescheduled", "no_show", "booked"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                filter === s
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s === "" ? "All" : s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          )
        )}
      </div>

      {/* Visit List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : visits.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">No visits found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {visits.map((visit) => (
            <div
              key={visit._id}
              className="card flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-primary-600">
                    {format(new Date(visit.date), "dd")}
                  </span>
                  <span className="text-[10px] text-primary-400 uppercase">
                    {format(new Date(visit.date), "MMM")}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {visit.property_name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Link
                      to={`/leads/${visit.lead_id?._id}`}
                      className="text-xs text-primary-600 hover:underline"
                    >
                      {visit.lead_id?.name}
                    </Link>
                    <span className="text-xs text-gray-400">
                      {visit.lead_id?.phone}
                    </span>
                    <span className="text-xs text-gray-400">
                      at {visit.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    visitStatusColors[visit.visit_status]
                  }`}
                >
                  {visit.visit_status}
                </span>
                <select
                  value={visit.visit_status}
                  onChange={(e) => handleStatusUpdate(visit._id, e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1.5 bg-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="no_show">No Show</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <VisitForm
          onSuccess={fetchVisits}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default VisitSchedulerPage;