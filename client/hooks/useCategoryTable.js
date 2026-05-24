"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "./useDebounce";
import { categoryAPI } from "../lib/api";

const PER_PAGE = 8;
const MAX_RETRIES = 2;

export function useCategoryTable() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const abortRef = useRef(null);
  const retryRef = useRef(0);

  const fetchData = useCallback(async (q, p, attempt = 0) => {
    // Cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await categoryAPI.getAll(
        { search: q, page: p, perPage: PER_PAGE },
        controller.signal
      );
      if (controller.signal.aborted) return;
      setRows(res.data);
      setTotal(res.total ?? res.data.length);
      setTotalPages(res.totalPages ?? 1);
      retryRef.current = 0;
    } catch (err) {
      if (err.name === "AbortError") return;
      // Retry on network errors
      if (attempt < MAX_RETRIES) {
        const delay = 500 * 2 ** attempt; // exponential backoff: 500ms, 1000ms
        setTimeout(() => fetchData(q, p, attempt + 1), delay);
        return;
      }
      setError(err.message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(debouncedSearch, page);
    return () => abortRef.current?.abort();
  }, [debouncedSearch, page, fetchData]);

  function handleSearch(val) {
    setSearch(val);
    setPage(1);
  }

  // Optimistic delete — remove row instantly, refetch on failure
  function optimisticDelete(id) {
    setRows((prev) => prev.filter((r) => r._id !== id));
    setTotal((t) => t - 1);
  }

  function revertDelete(row) {
    setRows((prev) => [row, ...prev]);
    setTotal((t) => t + 1);
  }

  // Optimistic toggle
  function optimisticToggle(id) {
    setRows((prev) =>
      prev.map((r) => (r._id === id ? { ...r, active: !r.active } : r))
    );
  }

  function refetch() {
    fetchData(debouncedSearch, page);
  }

  return {
    rows, total, totalPages, page, setPage,
    search, setSearch: handleSearch,
    loading, error, refetch, perPage: PER_PAGE,
    optimisticDelete, revertDelete, optimisticToggle,
  };
}
