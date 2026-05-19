import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export const useUrls = () => {
  const [urls, setUrls] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchUrls = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/api/urls', { params: { page: 1, limit: 10, ...params } });
      setUrls(data.urls);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch URLs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUrl = useCallback(async (payload) => {
    const { data } = await api.post('/api/urls', payload);
    return data.data;
  }, []);

  const updateUrl = useCallback(async (id, payload) => {
    const { data } = await api.patch(`/api/urls/${id}`, payload);
    return data.data;
  }, []);

  const deleteUrl = useCallback(async (id) => {
    await api.delete(`/api/urls/${id}`);
  }, []);

  const toggleUrl = useCallback(async (id) => {
    const { data } = await api.patch(`/api/urls/${id}/toggle`);
    return data.data;
  }, []);

  return {
    urls, setUrls,
    pagination,
    isLoading,
    search, setSearch,
    fetchUrls,
    createUrl,
    updateUrl,
    deleteUrl,
    toggleUrl,
  };
};
