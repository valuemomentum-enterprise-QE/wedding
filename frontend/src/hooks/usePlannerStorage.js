import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  PLANNER_STORAGE_CHANGE,
  notifyPlannerDataChanged,
} from '../lib/plannerStorage';
import { fetchPlannerList, savePlannerList, hasPlannerApiSession } from '../lib/plannerApi';

/**
 * Planner lists — MongoDB via API only (no localStorage).
 */
export function usePlannerStorage(storageKey) {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const loadFromApi = useCallback(async () => {
    if (!hasPlannerApiSession()) {
      setData([]);
      setSyncError('Sign in required to load planner data.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setSyncError(null);
    try {
      const items = await fetchPlannerList(storageKey);
      setData(items);
    } catch (error) {
      setSyncError(error.message || 'Could not load from server');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [storageKey]);

  const saveData = useCallback(
    (next) => {
      if (!hasPlannerApiSession()) {
        setSyncError('Sign in required to save planner data.');
        return;
      }

      setData((prev) => {
        const value = typeof next === 'function' ? next(prev) : next;

        setSyncing(true);
        setSyncError(null);
        savePlannerList(storageKey, value)
          .then((saved) => {
            setData(saved);
            notifyPlannerDataChanged(storageKey);
          })
          .catch((error) => {
            setSyncError(error.message || 'Could not save to server');
            loadFromApi();
          })
          .finally(() => setSyncing(false));

        return value;
      });
    },
    [storageKey, loadFromApi]
  );

  useEffect(() => {
    const onChange = (event) => {
      if (!event.detail?.key || event.detail.key === storageKey) {
        loadFromApi();
      }
    };
    window.addEventListener(PLANNER_STORAGE_CHANGE, onChange);
    return () => window.removeEventListener(PLANNER_STORAGE_CHANGE, onChange);
  }, [storageKey, loadFromApi]);

  useEffect(() => {
    loadFromApi();
  }, [loadFromApi, location.pathname]);

  return [data, saveData, loadFromApi, { loading, syncing, syncError }];
}

export default usePlannerStorage;
