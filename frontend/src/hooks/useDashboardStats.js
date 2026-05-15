import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { calculateDashboardStats } from '../lib/weddingUtils';
import {
  PLANNER_STORAGE_CHANGE,
  PLANNER_STORAGE_KEYS,
} from '../lib/plannerStorage';
import { fetchPlannerList, hasPlannerApiSession } from '../lib/plannerApi';

export function useDashboardStats(exchangeRate = 83.5) {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingEvents: 0,
    totalBudget: 0,
    spent: 0,
    totalGuests: 0,
    rsvpYes: 0,
  });
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [syncError, setSyncError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    let tasks = [];
    let budgetItems = [];
    let events = [];
    let guests = [];

    if (!hasPlannerApiSession()) {
      setSyncError('Sign in to load planner data from the server.');
    } else {
      try {
        [tasks, budgetItems, events, guests] = await Promise.all([
          fetchPlannerList(PLANNER_STORAGE_KEYS.tasks),
          fetchPlannerList(PLANNER_STORAGE_KEYS.budgetItems),
          fetchPlannerList(PLANNER_STORAGE_KEYS.events),
          fetchPlannerList(PLANNER_STORAGE_KEYS.guests),
        ]);
        setSyncError(null);
      } catch (error) {
        setSyncError(error.message || 'Could not load planner data from server');
      }
    }

    const computed = calculateDashboardStats({
      tasks,
      events,
      budgetItems,
      guests,
      exchangeRate,
    });

    setStats({
      totalTasks: computed.totalTasks,
      completedTasks: computed.completedTasks,
      upcomingEvents: computed.upcomingEvents,
      totalBudget: computed.totalBudget,
      spent: computed.spent,
      totalGuests: computed.totalGuests,
      rsvpYes: computed.rsvpYes,
    });

    setPriorityTasks(
      tasks
        .filter((task) => task.status !== 'completed' && task.priority === 'high')
        .slice(0, 5)
    );
    setLoading(false);
  }, [exchangeRate]);

  useEffect(() => {
    refresh();
  }, [refresh, location.pathname]);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener(PLANNER_STORAGE_CHANGE, onChange);
    return () => window.removeEventListener(PLANNER_STORAGE_CHANGE, onChange);
  }, [refresh]);

  return { stats, priorityTasks, refresh, syncError, loading };
}

export default useDashboardStats;
