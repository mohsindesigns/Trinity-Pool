"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

/* Cloudflare Turnstile. Renders only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set;
   with no key the widget is absent and `turnstileEnabled` is false so forms
   don't wait on a token. The token is single-use: call reset() after each submit. */

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const turnstileEnabled = !!TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    __turnstileLoading?: Promise<void>;
  }
}

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (window.__turnstileLoading) return window.__turnstileLoading;
  window.__turnstileLoading = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      window.__turnstileLoading = undefined;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return window.__turnstileLoading;
}

export interface TurnstileHandle {
  reset: () => void;
}

interface Props {
  onToken: (token: string) => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

const TurnstileWidget = forwardRef<TurnstileHandle, Props>(function TurnstileWidget(
  { onToken, theme = "auto", className },
  ref
) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const cb = useRef(onToken);
  const [failed, setFailed] = useState(false);
  cb.current = onToken;

  const reset = useCallback(() => {
    cb.current("");
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }, []);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  useEffect(() => {
    if (!turnstileEnabled) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(box.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme,
          callback: (t: string) => { setFailed(false); cb.current(t); },
          "expired-callback": () => cb.current(""),
          "error-callback": () => { setFailed(true); cb.current(""); return true; },
        });
      })
      .catch((e) => { console.error(e); setFailed(true); });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [theme]);

  if (!turnstileEnabled) return null;
  return (
    <>
      <div ref={box} className={className} />
      {failed && (
        <p role="alert" className="text-[12.5px] text-red-600">
          The security check could not load. Please refresh the page, or call us at 830-279-3996.
        </p>
      )}
    </>
  );
});

export default TurnstileWidget;
