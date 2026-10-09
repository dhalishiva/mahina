"use client";
import { useCallback, useEffect, useRef, useState } from "react";

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

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const captchaEnabled = !!SITE_KEY;

function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!window.__turnstileLoading) {
    window.__turnstileLoading = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("turnstile failed to load"));
      document.head.appendChild(s);
    });
  }
  return window.__turnstileLoading;
}

/**
 * Cloudflare Turnstile bot check. Invisible for most people; shows a checkbox only when Cloudflare is unsure.
 * Tokens are single-use: call reset() after every request that consumed one.
 * When NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, it renders nothing and `ready` is always true.
 */
export function useTurnstile(action: string) {
  // Callback ref: the widget is re-rendered whenever its container mounts somewhere new (e.g. a form step changes).
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!SITE_KEY || !el) return;
    let cancelled = false;
    setToken(undefined);
    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widget.current = window.turnstile.render(el, {
          sitekey: SITE_KEY,
          action,
          appearance: "interaction-only",
          theme: "light",
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(undefined),
          "error-callback": () => setToken(undefined),
        });
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [el, action]);

  const reset = useCallback(() => {
    setToken(undefined);
    if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
  }, []);

  const Widget = useCallback(() => (SITE_KEY ? <div ref={setEl} /> : null), []);

  return {
    token,
    ready: !SITE_KEY || !!token,
    failed,
    reset,
    Widget,
    /** Spread into Supabase auth options. */
    opts: SITE_KEY ? { captchaToken: token } : {},
  };
}
