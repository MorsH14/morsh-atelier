"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Config } from "@/lib/products";
import type { SelectionItem } from "@/lib/whatsapp";

type Ctx = {
  items: SelectionItem[];
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, cfg?: Config) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  has: (id: string) => boolean;
};

const SelectionContext = createContext<Ctx | null>(null);
const KEY = "morsh-selection-v2";
const keyOf = (id: string, cfg?: Config) => (cfg ? `${id}:${cfg.size}:${cfg.fabric}:${cfg.frame}` : id);

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

  const add = useCallback((id: string, cfg?: Config) => {
    const key = keyOf(id, cfg);
    setItems((cur) =>
      cur.some((i) => i.key === key)
        ? cur.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
        : [...cur, { key, id, qty: 1, cfg }]
    );
    setOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((cur) =>
      qty <= 0 ? cur.filter((i) => i.key !== key) : cur.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  }, []);

  const remove = useCallback((key: string) => setItems((cur) => cur.filter((i) => i.key !== key)), []);

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
