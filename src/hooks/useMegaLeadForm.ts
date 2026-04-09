"use client";

import { useState, useCallback } from "react";

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

export function useMegaLeadForm(config: LeadFormConfig) {
  const [state, setState] = useState<FormState>({
    status: "idle",
    errorMessage: "",
  });

  const submitLead = useCallback(
    async (formData: Record<string, string>) => {
      if (state.status === "submitting") return;

      setState({ status: "submitting", errorMessage: "" });

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
