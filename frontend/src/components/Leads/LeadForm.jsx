import { useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

const LeadForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "website",
    notes: "",
    budget: "",
    preferred_location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    setLoading(true);
    try {
      await API.post("/leads", form);
      toast.success("Lead created successfully!");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Add New Lead</h2>
          <p className="text-sm text-gray-500">
            Lead will be auto-assigned to an agent via round-robin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Phone number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="email@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="input-field"
              >
                <option value="website">Website</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="call">Call</option>
                <option value="social">Social Media</option>
                <option value="referral">Referral</option>
                <option value="walkin">Walk-in</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <input
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. ₹8000-12000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Location
            </label>
            <input
              name="preferred_location"
              value={form.preferred_location}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Koramangala, HSR Layout"
            />
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
              rows={3}
              placeholder="Additional information..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Lead"}
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

export default LeadForm;