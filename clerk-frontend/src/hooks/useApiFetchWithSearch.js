import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";



export function useApiFetchWithSearch(endpoint, options = {}, itemsPerPage = 10) {
  const { getToken } = useAuth();
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Missing Clerk token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();
      setOriginalData(data);
      setFilteredData(data); // initial full load
    } catch (err) {
      // console.error("API Fetch Error:", err); //okay for development
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [endpoint, options, getToken]); //exclude endpoint from dep array to prevent crashing

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply search filtering
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = originalData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1); // reset to page 1 on new search
  }, [searchTerm, originalData]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return {
    data: paginatedData,
    error,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    refetch: fetchData,
  };
}
