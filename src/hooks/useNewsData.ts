import { useState, useEffect } from 'react';
import type { NewsData } from '../types/news';

export function useNewsData() {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/data/current.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json() as NewsData;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load news data');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return { data, loading, error };
}
