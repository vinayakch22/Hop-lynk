import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAnalytics = (urlId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!urlId) return;
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/analytics/${urlId}`);
        if (!cancelled) setData(res.data.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [urlId]);

  return { data, isLoading, error };
};
