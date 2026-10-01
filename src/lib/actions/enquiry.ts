"use server";

import { ENQUIRY_TYPES, MESSAGE_MAX, type EnquiryField, type EnquiryState } from "@/lib/enquiry";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;
const SUCCESS = "Thank you — your enquiry has been received. Our team will get back to you shortly.";

/**
 * Validates an enquiry and forwards it to CONTACT_WEBHOOK_URL (any HTTPS endpoint that accepts
 * JSON — a CRM, a form service or an email relay).
 *
 * Without a webhook the enquiry is only logged in development; in production the visitor is
 * told that online enquiries are unavailable, so no message is ever silently dropped.
 */
export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const values = {
    name: get("name"),
    organisation: get("organisation"),
    email: get("email"),
    phone: get("phone"),
    enquiryType: get("enquiryType"),
    message: get("message"),
  };

  // Honeypot: bots fill the hidden field; respond as if successful and do nothing.
  if (get("website")) return { status: "success", message: SUCCESS };

  const errors: Partial<Record<EnquiryField, string>> = {};
  if (values.name.length < 2 || values.name.length > 120) errors.name = "Please enter your full name.";
  if (values.organisation.length > 160) errors.organisation = "Please shorten the organisation name.";
  if (!EMAIL_RE.test(values.email) || values.email.length > 200) errors.email = "Please enter a valid email address.";
  if (values.phone && !PHONE_RE.test(values.phone)) errors.phone = "Please enter a valid phone number.";
  if (!(ENQUIRY_TYPES as readonly string[]).includes(values.enquiryType)) errors.enquiryType = "Please choose an enquiry type.";
  if (values.message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  if (values.message.length > MESSAGE_MAX) errors.message = `Please keep your message under ${MESSAGE_MAX.toLocaleString("en-IN")} characters.`;
  if (formData.get("consent") !== "on") errors.consent = "Please confirm so that we can respond to your enquiry.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please correct the highlighted fields and try again.", errors, values };
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[enquiry] CONTACT_WEBHOOK_URL is not set — "${values.enquiryType}" enquiry accepted in development but not delivered.`);
      return { status: "success", message: SUCCESS };
    }
    return {
      status: "error",
      message: "Online enquiries are not available at the moment. Please contact us by phone or email instead.",
      values,
    };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Enquiry webhook responded with ${res.status}`);
  } catch (error) {
    console.error("[enquiry] delivery failed", error);
    return { status: "error", message: "We could not send your enquiry just now. Please try again in a few minutes.", values };
  }

  return { status: "success", message: SUCCESS };
}
