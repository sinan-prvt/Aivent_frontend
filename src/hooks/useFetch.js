import { useEffect, useState } from "react";
import api from "../core/api/axios";

export default function useFetch(path, deps = [], options = {}) {
  const [data, setData] = useState(options.mock ?? null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!path) return;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await api.get(path);
        if (!mounted) return;
        setData(res.data);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, deps);

  return { data, setData, loading, error };
}
