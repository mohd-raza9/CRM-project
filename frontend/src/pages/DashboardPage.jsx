import { useState, useEffect } from "react";
import API from "../api/axios";
import StatCard from "../components/Dashboard/StatCard";
import { LeadsPerDayChart, SourcePieChart } from "../components/Dashboard/Charts";
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineBell,
  HiOutlineHome,
} from "react-icons/hi";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) return <p className="text-center text-gray-500">Failed to load dashboard</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your lead pipeline</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={HiOutlineUserGroup}
          color="blue"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon={HiOutlineSparkles}
          color="indigo"
        />
        <StatCard
          title="Contacted"
          value={stats.contacted}
          icon={HiOutlinePhone}
          color="purple"
        />
        <StatCard
          title="Visits Scheduled"
          value={stats.visitScheduled}
          icon={HiOutlineCalendar}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Visits This Week"
          value={stats.visitsThisWeek}
          icon={HiOutlineHome}
          color="orange"
        />
        <StatCard
          title="Bookings"
          value={stats.booked}
          icon={HiOutlineCheckCircle}
          color="green"
        />
        <StatCard
          title="Lost Leads"
          value={stats.lost}
          icon={HiOutlineXCircle}
          color="red"
        />
        <StatCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          icon={HiOutlineBell}
          color="pink"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsPerDayChart data={stats.leadsPerDay || []} />
        <SourcePieChart data={stats.sourceCounts || []} />
      </div>
    </div>
  );
};

export default DashboardPage;
