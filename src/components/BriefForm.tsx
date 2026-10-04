"use client";

import { useState } from "react";
import { BUDGETS, ROOM_TYPES } from "@/lib/content";
import { buildBriefUrl } from "@/lib/whatsapp";

export default function BriefForm() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [room, setRoom] = useState(ROOM_TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[4]);
  const [note, setNote] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    window.open(buildBriefUrl({ name: name.trim(), city: city.trim(), room, budget, note: note.trim() }), "_blank", "noopener");
  };

  return (
    <form className="brief" onSubmit={submit}>
      <label>
        <span>Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="given-name" placeholder="What should I call you?" />
      </label>
      <label>
        <span>Your city</span>
        <input value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" placeholder="Lagos, Abuja, Port Harcourt…" />
      </label>
      <label>
        <span>Which space?</span>
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          {ROOM_TYPES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Rough budget</span>
        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
          {BUDGETS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label className="brief-wide">
        <span>Anything I should know? (optional)</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Colours you love, who lives there, what bothers you now…" />
      </label>
      <div className="brief-wide brief-act">
        <button type="submit" className="btn btn-solid">
          Continue on WhatsApp
        </button>
        <small>Free, no obligation. This opens WhatsApp with your details already written, so you don&rsquo;t have to retype anything.</small>
      </div>
    </form>
  );
}
