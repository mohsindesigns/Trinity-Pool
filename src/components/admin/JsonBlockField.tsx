"use client";

import { useState, useEffect } from "react";

/**
 * Small JSON editor for structured page blocks (product cards, fact tiles...)
 * that don't justify a bespoke form. It only commits valid JSON, so a typo
 * can never overwrite saved content -- the error is shown and the last good
 * value stays in place until the text parses again.
 */
export default function JsonBlockField({
  label,
  help,
  value,
  onChange,
  emptyValue,
  rows = 10,
}: {
  label: string;
  help?: string;
  value: any;
  onChange: (v: any) => void;
  emptyValue: any;
  rows?: number;
}) {
  const pretty = (v: any) => (v === undefined || v === null ? "" : JSON.stringify(v, null, 2));
  const [text, setText] = useState(pretty(value));
  const [error, setError] = useState("");

  // Re-sync when a different service is loaded into the editor.
  useEffect(() => {
    setText(pretty(value));
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-bold">{label}</label>
      {help && <p className="text-[12px] text-[#646970]">{help}</p>}
      <textarea
        value={text}
        rows={rows}
        spellCheck={false}
        onChange={(e) => {
          const t = e.target.value;
          setText(t);
          if (t.trim() === "") {
            setError("");
            onChange(emptyValue);
            return;
          }
          try {
            onChange(JSON.parse(t));
            setError("");
          } catch (err: any) {
            setError("Not valid JSON yet — your last valid version is still what will be saved. " + err.message);
          }
        }}
        className={`w-full border px-3 py-2 text-[12px] font-mono rounded-[3px] ${error ? "border-red-500" : "border-[#8c8f94]"}`}
      />
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
