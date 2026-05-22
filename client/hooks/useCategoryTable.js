"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import { categoryAPI } from "../lib/api";

const PER_PAGE = 8;

export function useCategoryTable() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetch = useCallback(async (q, p) => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryAPI.getAll({ search: q, page: p, perPage: PER_PAGE });
      setRows(res.data);
      setTotal(res.total ?? res.data.length);
      setTotalPages(res.totalPages ?? 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // refetch when debounced search or page changes
  useEffect(() => {
    fetch(debouncedSearch, page);
  }, [debouncedSearch, page, fetch]);

  // when search changes reset to page 1
  function handleSearch(val) {
    setSearch(val);
    setPage(1);
  }

  function refetch() {
    fetch(debouncedSearch, page);
  }

  return {
    rows, total, totalPages, page, setPage,
    search, setSearch: handleSearch,
    loading, error, refetch, perPage: PER_PAGE,
  };
}
