import { useState, useEffect } from "react";
import API from "../api/axios";

export const useFollowups = () => {
  const [followups, setFollowups] = useState([]);
  const [count, setCount] = useState(0);

  const fetchFollowups = async () => {
    try {
      const { data } = await API.get("/followups");
      setFollowups(data);
      setCount(data.length);
    } catch (err) {
      console.error("Failed to fetch followups", err);
    }
  };

  const markComplete = async (id) => {
    try {
      await API.patch(`/followups/${id}/complete`);
      setFollowups((prev) => prev.filter((f) => f._id !== id));
      setCount((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to complete followup", err);
    }
  };

  useEffect(() => {
    fetchFollowups();
    const interval = setInterval(fetchFollowups, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { followups, count, markComplete, refetch: fetchFollowups };
};