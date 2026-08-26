import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../lib/api";

const PropertyContext = createContext(null);

export function PropertyProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { properties } = await api.get("/properties");
      setProperties(properties);
    } catch (err) { setError(err.message || "Could not load properties."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addProperty = useCallback(async (data) => {
    const { property } = await api.post("/properties", data, { auth: true });
    setProperties((prev) => [property, ...prev]);
    return property;
  }, []);

  const updateProperty = useCallback(async (id, data) => {
    const { property } = await api.put(`/properties/${id}`, data, { auth: true });
    setProperties((prev) => prev.map((p) => (p.id === id ? property : p)));
    return property;
  }, []);

  const deleteProperty = useCallback(async (id) => {
    await api.delete(`/properties/${id}`, { auth: true });
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(() => ({
    properties, loading, error, refresh, addProperty, updateProperty, deleteProperty,
  }), [properties, loading, error, refresh, addProperty, updateProperty, deleteProperty]);

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
}

export function useProperties() {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error("useProperties must be used within a PropertyProvider");
  return ctx;
}
