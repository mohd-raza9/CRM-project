import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import VisitForm from "../components/Visits/VisitForm";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlinePencil,
} from "react-icons/hi";

const STATUS_OPTIONS = [
  { id: "new", label: "New Lead" },
  { id: "contacted", label: "Contacted" },
  { id: "requirement_collected", label: "Requirement Collected" },
  { id: "property_suggested", label: "Property Suggested" },
  { id: "visit_scheduled", label: "Visit Scheduled" },
  { id: "visit_completed", label: "Visit Completed" },
  { id: "booked", label: "Booked" },
  { id: "lost", label: "Lost" },
];

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-violet-100 text-violet-700",
  requirement_collected: "bg-amber-100 text-amber-700",
  property_suggested: "bg-emerald-100 text-emerald-700",
  visit_scheduled: "bg-indigo-100 text-indigo-700",
  visit_completed: "bg-pink-100 text-pink-700",
  booked: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const activityIcons = {
  lead_created: "🆕",
  assigned: "👤",
  status_changed: "🔄",
  contacted: "📞",
  visit_scheduled: "📅",
  visit_completed: "✅",
  visit_rescheduled: "🔁",
  visit_no_show: "❌",
  visit_booked: "🎉",
  note_added: "📝",
  follow_up_created: "⏰",
};

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    try {
      const [leadRes, actRes, visitRes] = await Promise.all([
        API.get(`/leads/${id}`),
        API.get(`/leads/${id}/activities`),
        API.get(`/visits?lead_id=${id}`),
      ]);
      setLead(leadRes.data);
      setActivities(actRes.data);
      setVisits(visitRes.data);
      setNotes(leadRes.data.notes || "");
    } catch (err) {
      toast.error("Failed to load lead details");
      navigate("/leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await API.patch(`/leads/${id}`, { status: newStatus });
      toast.success("Status updated!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleSaveNotes = async () => {
    try {
      await API.patch(`/leads/${id}`, { notes });
      toast.success("Notes saved!");
      setEditNotes(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to save notes");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await API.delete(`/leads/${id}`);
      toast.success("Lead deleted");
      navigate("/leads");
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  const handleVisitStatusUpdate = async (visitId, newStatus) => {
    try {
      await API.patch(`/visits/${visitId}`, { visit_status: newStatus });
      toast.success("Visit updated!");
      fetchData();
    } catch (err) {
      toast.error("Failed to update visit");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/leads")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <span
              className={`inline-block text-xs px-3 py-1 rounded-full font-medium mt-1 ${
                statusColors[lead.status]
              }`}
            >
              {STATUS_OPTIONS.find((s) => s.id === lead.status)?.label}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowVisitForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiOutlineCalendar className="w-4 h-4" />
            Schedule Visit
          </button>
          <button onClick={handleDelete} className="btn-danger flex items-center gap-2">
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Lead Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Contact Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <HiOutlinePhone className="w-4 h-4 text-gray-400" />
                <span>{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3 text-sm">
                  <HiOutlineMail className="w-4 h-4 text-gray-400" />
                  <span>{lead.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <HiOutlineUser className="w-4 h-4 text-gray-400" />
                <span>Agent: {lead.assigned_agent?.name || "Unassigned"}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Source:</span>{" "}
                <span className="capitalize font-medium">{lead.source}</span>
              </p>
              {lead.budget && (
                <p>
                  <span className="text-gray-500">Budget:</span>{" "}
                  <span className="font-medium">{lead.budget}</span>
                </p>
              )}
              {lead.preferred_location && (
                <p>
                  <span className="text-gray-500">Location:</span>{" "}
                  <span className="font-medium">{lead.preferred_location}</span>
                </p>
              )}
              <p>
                <span className="text-gray-500">Created:</span>{" "}
                {format(new Date(lead.created_at), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3">Update Status</h3>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input-field"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Notes</h3>
              <button
                onClick={() => setEditNotes(!editNotes)}
                className="text-primary-600 hover:text-primary-700"
              >
                <HiOutlinePencil className="w-4 h-4" />
              </button>
            </div>
            {editNotes ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field"
                  rows={4}
                />
                <button
                  onClick={handleSaveNotes}
                  className="btn-primary mt-2 text-sm"
                >
                  Save Notes
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {lead.notes || "No notes yet."}
              </p>
            )}
          </div>
        </div>

        {/* Right Column — Visits & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visits */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">
              Scheduled Visits ({visits.length})
            </h3>
            {visits.length === 0 ? (
              <p className="text-sm text-gray-400">No visits scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {visits.map((v) => (
                  <div
                    key={v._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{v.property_name}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(v.date), "MMM dd, yyyy")} at {v.time}
                      </p>
                    </div>
                    <select
                      value={v.visit_status}
                      onChange={(e) =>
                        handleVisitStatusUpdate(v._id, e.target.value)
                      }
                      className="text-xs border rounded-lg px-2 py-1"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="no_show">No Show</option>
                      <option value="booked">Booked</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">
              Activity Timeline
            </h3>
            {activities.length === 0 ? (
              <p className="text-sm text-gray-400">No activities yet.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity._id} className="flex gap-4 relative">
                      <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm z-10 shrink-0">
                        {activityIcons[activity.type] || "📋"}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-gray-800">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {format(
                              new Date(activity.timestamp),
                              "MMM dd, yyyy — hh:mm a"
                            )}
                          </span>
                          {activity.agent_id && (
                            <span className="text-xs text-gray-400">
                              by {activity.agent_id.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visit Form Modal */}
      {showVisitForm && (
        <VisitForm
          leadId={id}
          onSuccess={fetchData}
          onClose={() => setShowVisitForm(false)}
        />
      )}
    </div>
  );
};

export default LeadDetailsPage;