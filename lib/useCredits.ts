// lib/useCredits.ts
// Client-side hook for fetching and managing credit balance.
"use client";
import { useState, useEffect, useCallback } from "react";

export function useCredits() {
  const [credits, setCredits]   = useState<number | null>(null);
  const [loading, setLoading]   = useState(true);

  const fetchCredits = useCallback(async () => {
    try {
      const res  = await fetch("/api/credits");
      const data = await res.json();
      setCredits(data.credits ?? 0);
    } catch {
      setCredits(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  // Deduct one credit — called just before model engine starts
  const deductCredit = useCallback(async (): Promise<boolean> => {
    const res  = await fetch("/api/credits", { method: "POST" });
    const data = await res.json();
    if (res.status === 402) return false;   // no credits
    if (data.credits !== undefined) setCredits(data.credits);
    return res.ok;
  }, []);

  // Called after successful purchase
  const addCredits = useCallback((n: number) => {
    setCredits(prev => (prev ?? 0) + n);
  }, []);

  return { credits, loading, fetchCredits, deductCredit, addCredits };
}
