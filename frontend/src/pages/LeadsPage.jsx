import { useState, useEffect } from "react";
import API from "../api/axios";
import KanbanBoard from "../components/Leads/KanbanBoard";
import LeadForm from "../components/Leads/LeadForm";
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    try {
      const params = { limit: 500 };
      if (search) params.search = search;
      const { data } = await API.get("/leads", { params });
      setLeads(data.leads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
          <p className="text-sm text-gray-500">
            Drag leads between stages to update status
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search leads by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <KanbanBoard leads={leads} setLeads={setLeads} />
      )}

      {/* New Lead Modal */}
      {showForm && (
        <LeadForm
          onSuccess={fetchLeads}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default LeadsPage;