"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SelectionItem } from "@/lib/whatsapp";

type Ctx = {
  items: SelectionItem[];
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
};

const SelectionContext = createContext<Ctx | null>(null);
const KEY = "morsh-selection-v1";

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SelectionItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((id: string) => {
    setItems((cur) =>
      cur.some((i) => i.id === id)
        ? cur.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...cur, { id, qty: 1 }]
    );
    setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((cur) =>
      qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const remove = useCallback((id: string) => setItems((cur) => cur.filter((i) => i.id !== id)), []);

  const value = useMemo<Ctx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      has: (id) => items.some((i) => i.id === id),
    }),
    [items, open, add, setQty, remove]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used inside SelectionProvider");
  return ctx;
}
