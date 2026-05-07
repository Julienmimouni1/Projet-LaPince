import type { Overview, MonthlyEntry } from "../types/stats";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/stats`;

export async function fetchOverview(): Promise<Overview> {
  const res = await fetch(`${BASE}/overview`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Error ${res.status} (overview)`);
  return res.json();
}

export async function fetchMonthlyStats(): Promise<MonthlyEntry> {
  const res = await fetch(`${BASE}/monthly`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Error ${res.status} (monthly)`);
  return res.json();
}
