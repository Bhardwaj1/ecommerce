"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "./useDebounce";
import { productAPI } from "../lib/api";

const PER_PAGE = 10;

export function useProductTable() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const abortRef = useRef(null);

  const fetchData = useCallback(async (q, p) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const res = await productAPI.getAll({ search: q, page: p, perPage: PER_PAGE }, controller.signal);
      if (controller.signal.aborted) return;
      setRows(res.data);
      setTotal(res.meta?.totalRecords ?? res.data.length);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      if (err.name === "AbortError") return;
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

  function optimisticDelete(id) {
    setRows((prev) => prev.filter((r) => r._id !== id));
    setTotal((t) => t - 1);
  }

  function refetch() {
    fetchData(debouncedSearch, page);
  }

  return {
    rows, total, totalPages, page, setPage,
    search, setSearch: handleSearch,
    loading, error, refetch, perPage: PER_PAGE,
    optimisticDelete,
  };
}
