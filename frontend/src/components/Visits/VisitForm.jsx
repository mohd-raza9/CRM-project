import { useState, useEffect } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

const VisitForm = ({ leadId, onSuccess, onClose }) => {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    lead_id: leadId || "",
    property_name: "",
    date: "",
    time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leadId) {
      API.get("/leads?limit=200").then(({ data }) => setLeads(data.leads));
    }
  }, [leadId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.lead_id || !form.property_name || !form.date || !form.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await API.post("/visits", form);
      toast.success("Visit scheduled successfully!");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule visit");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Schedule Visit</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!leadId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Lead *
              </label>
              <select
                name="lead_id"
                value={form.lead_id}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Choose a lead...</option>
                {leads.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name} — {l.phone}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name *
            </label>
            <input
              name="property_name"
              value={form.property_name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Sunshine PG Koramangala"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="input-field"
              rows={2}
              placeholder="Any special notes..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Visit"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitForm;