/** Shared types and options for the enquiry form (client) and its server action. */

export const ENQUIRY_TYPES = [
  "Project or tender enquiry",
  "Partnership / joint venture",
  "Vendor or subcontractor registration",
  "Careers",
  "Media",
  "Other",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export type EnquiryField = "name" | "organisation" | "email" | "phone" | "enquiryType" | "message" | "consent";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<EnquiryField, string>>;
  /** Echoed back on error so the form can be re-populated after React resets it. */
  values?: Partial<Record<Exclude<EnquiryField, "consent">, string>>;
};

export const initialEnquiryState: EnquiryState = { status: "idle" };

export const MESSAGE_MAX = 4000;
