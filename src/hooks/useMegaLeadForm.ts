"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ───────────────────────────── CONFIG ───────────────────────────── */
interface LeadFormConfig {
  siteId: string;
  customerId: string;
  siteKey: string;
  pagePath?: string;
}

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  errorMessage: string;
}

/* ───────────────────── ATTRIBUTION / UTM ────────────────────────── */
const STORAGE_KEYS = {
  VISITOR_ID: "_mega_vid",
  SESSION_ID: "_mega_sid",
  ATTRIBUTION: "_mega_attr",
};

interface Attribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  fbp: string | null;
  fbc: string | null;
}

const generateId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  )}`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const getVisitorId = (): string => {
  if (typeof localStorage === "undefined") return generateId("vis");
  let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!visitorId) {
    visitorId = generateId("vis");
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
  }
  return visitorId;
};

const getSessionId = (): string => {
  if (typeof sessionStorage === "undefined") return generateId("sess");
  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = generateId("sess");
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }
  return sessionId;
};

const captureAttribution = (): Attribution => {
  if (typeof window === "undefined") {
    return {
      utm_source: null, utm_medium: null, utm_campaign: null,
      utm_term: null, utm_content: null, gclid: null,
      gbraid: null, wbraid: null, fbclid: null, fbp: null, fbc: null,
    };
  }
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const attribution: Attribution = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    gclid: params.get("gclid"),
    gbraid: params.get("gbraid"),
    wbraid: params.get("wbraid"),
    fbclid: params.get("fbclid"),
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
  };
  if (attribution.fbclid && !attribution.fbc) {
    attribution.fbc = `fb.1.${Date.now()}.${attribution.fbclid}`;
  }
  return attribution;
};

const initAttribution = (): Attribution => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return captureAttribution();
  }
  const trackingParams = ["utm_source", "gclid", "fbclid", "gbraid", "wbraid"];
  const url = new URL(window.location.href);
  const hasTrackingParams = trackingParams.some((param) => url.searchParams.has(param));
  if (hasTrackingParams) {
    const attribution = captureAttribution();
    localStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(attribution));
    return attribution;
  }
  const stored = localStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  if (stored) {
    try { return JSON.parse(stored) as Attribution; } catch { /* ignore */ }
  }
  const attribution = captureAttribution();
  localStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(attribution));
  return attribution;
};

/* ───────────────────────────── HOOK ─────────────────────────────── */
export function useMegaLeadForm(config: LeadFormConfig) {
  const [state, setState] = useState<FormState>({
    status: "idle",
    errorMessage: "",
  });
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      initAttribution();
      isInitialized.current = true;
    }
  }, []);

  const submitLead = useCallback(
    async (formData: Record<string, string>) => {
      if (state.status === "submitting") return;

      setState({ status: "submitting", errorMessage: "" });

      const attribution = initAttribution();

      const payload = {
        site_id: config.siteId,
        customer_id: config.customerId,
        site_key: config.siteKey,
        page_path: config.pagePath || window.location.pathname,
        page_url: window.location.href,
        form_data: formData,
        submitted_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || "",
        referrer_url: document.referrer || null,
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        ...attribution,
      };

      try {
        const response = await fetch(
          "https://analytics.gomega.ai/submission/submit",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`Submission failed: ${response.status}`);
        }

        // Fire MegaTag event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== "undefined" && (window as any).MEGA_TAG_CONFIG) {
          try {
            const megaEvent = new CustomEvent("mega:form_submit", {
              detail: { form_data: formData, page_path: config.pagePath || window.location.pathname },
            });
            window.dispatchEvent(megaEvent);
          } catch {
            // silent
          }
        }

        setState({ status: "success", errorMessage: "" });
      } catch (error) {
        setState({
          status: "error",
          errorMessage:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        });
      }
    },
    [config, state.status]
  );

  const reset = useCallback(() => {
    setState({ status: "idle", errorMessage: "" });
  }, []);

  return { ...state, submitLead, reset };
}
