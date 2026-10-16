"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { contact } from "@/content/company";
import { ENQUIRY_TYPES, MESSAGE_MAX, initialEnquiryState, type EnquiryState, type EnquiryField, type EnquiryType } from "@/lib/enquiry";
import { cn } from "@/lib/site";

type EnquiryFormProps = {
  defaultType?: EnquiryType;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
};

/** Validates locally and opens a formatted WhatsApp draft without a backend. */
export function EnquiryForm({
  defaultType = "Project or tender enquiry",
  submitLabel = "Send enquiry",
  messageLabel = "How can we help?",
  messagePlaceholder = "Tell us about your project, location, timelines and scope.",
}: EnquiryFormProps) {
  const [state, setState] = useState<EnquiryState>(initialEnquiryState);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const err = (f: EnquiryField) => state.errors?.[f];

  useEffect(() => {
    if (state.status === "error") formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    if (get("website")) return;
    const errors: Partial<Record<EnquiryField, string>> = {};
    if (get("name").length < 2 || get("name").length > 120) errors.name = "Please enter your full name (2–120 characters).";
    if (get("organisation").length > 160) errors.organisation = "Please shorten the organisation name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get("email")) || get("email").length > 200) errors.email = "Please enter a valid email address.";
    if (get("phone") && !/^[+()\d\s-]{7,20}$/.test(get("phone"))) errors.phone = "Please enter a valid phone number.";
    if (!(ENQUIRY_TYPES as readonly string[]).includes(get("enquiryType"))) errors.enquiryType = "Please choose an enquiry type.";
    if (get("message").length < 10 || get("message").length > MESSAGE_MAX) errors.message = `Please enter between 10 and ${MESSAGE_MAX} characters.`;
    if (data.get("consent") !== "on") errors.consent = "Please confirm so that we can respond to your enquiry.";
    if (Object.keys(errors).length) {
      setState({ status: "error", message: "Please correct the highlighted fields and try again.", errors });
      return;
    }
    const number = contact.phone?.replace(/\D/g, "");
    if (!number) {
      setState({ status: "error", message: "WhatsApp is unavailable. Please contact us by email.", values: {
        name: get("name"), organisation: get("organisation"), email: get("email"),
        phone: get("phone"), enquiryType: get("enquiryType"), message: get("message"),
      } });
      return;
    }
    const message = [
      "*New enquiry | Raghav Buildcon*",
      "",
      `*Full name:* ${get("name")}`,
      `*Organisation:* ${get("organisation") || "Not provided"}`,
      `*Email:* ${get("email")}`,
      `*Phone:* ${get("phone") || "Not provided"}`,
      `*Enquiry type:* ${get("enquiryType")}`,
      "",
      "*Message:*",
      get("message"),
      "",
      "Consent given to respond to this enquiry.",
    ].join("\n");
    setState(initialEnquiryState);
    window.location.assign(`https://wa.me/${number}?text=${encodeURIComponent(message)}`);
  }

  const v = state.values ?? {};

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6" aria-describedby={state.message ? id("status") : undefined}>
      {state.status === "error" && state.message ? (
        <div id={id("status")} role="alert" className="flex items-start gap-3 rounded-sm border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-800">
          <Icon name="info" className="mt-0.5 size-4 shrink-0" />
          <div>
            <p>{state.message}</p>
            {!state.errors && contact.email ? (
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(v.enquiryType ?? defaultType)}&body=${encodeURIComponent(`${v.message ?? ""}\n\nName: ${v.name ?? ""}\nOrganisation: ${v.organisation ?? ""}\nEmail: ${v.email ?? ""}\nPhone: ${v.phone ?? ""}`)}`}
                className="mt-2 inline-block font-semibold underline underline-offset-4"
              >
                Open your email app with this enquiry
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={id("name")} label="Full name" required error={err("name")}>
          <input id={id("name")} name="name" type="text" autoComplete="name" required maxLength={120} defaultValue={v.name} {...invalid(id("name"), err("name"))} className={inputClass} />
        </Field>
        <Field id={id("organisation")} label="Organisation" error={err("organisation")}>
          <input id={id("organisation")} name="organisation" type="text" autoComplete="organization" maxLength={160} defaultValue={v.organisation} {...invalid(id("organisation"), err("organisation"))} className={inputClass} />
        </Field>
        <Field id={id("email")} label="Email address" required error={err("email")}>
          <input id={id("email")} name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={v.email} {...invalid(id("email"), err("email"))} className={inputClass} />
        </Field>
        <Field id={id("phone")} label="Phone" error={err("phone")}>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} defaultValue={v.phone} {...invalid(id("phone"), err("phone"))} className={inputClass} />
        </Field>
      </div>

      <Field id={id("enquiryType")} label="Enquiry type" required error={err("enquiryType")}>
        <div className="relative">
          <select id={id("enquiryType")} name="enquiryType" required defaultValue={v.enquiryType ?? defaultType} {...invalid(id("enquiryType"), err("enquiryType"))} className={cn(inputClass, "appearance-none pr-10")}>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" className="pointer-events-none absolute top-1/2 right-3.5 size-4.5 -translate-y-1/2 text-ink-400" />
        </div>
      </Field>

      <Field id={id("message")} label={messageLabel} required error={err("message")}>
        <textarea id={id("message")} name="message" rows={6} required minLength={10} maxLength={MESSAGE_MAX} placeholder={messagePlaceholder} defaultValue={v.message} {...invalid(id("message"), err("message"))} className={cn(inputClass, "h-auto resize-y py-3")} />
      </Field>

      {/* Honeypot — hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-600">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            required
            {...invalid(id("consent"), err("consent"))}
            className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded-sm border-ink-300 accent-gold-600"
          />
          I agree that Raghav Buildcon may use these details to respond to my enquiry.
        </label>
        {err("consent") ? (
          <p id={`${id("consent")}-error`} className="mt-2 text-sm font-medium text-red-700">
            {err("consent")}
          </p>
        ) : null}
      </div>

      <div>
        <Button type="submit" size="lg" icon="arrow-right" className="w-full sm:w-auto">
          {submitLabel}
        </Button>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Opens WhatsApp with your enquiry ready for {contact.phone}. Tap Send in WhatsApp to submit it.
        </p>
      </div>
    </form>
  );
}

const inputClass =
  "block h-12 w-full rounded-sm border border-ink-200 bg-white px-4 text-[0.95rem] text-ink-950 placeholder:text-ink-300 transition-[border-color,box-shadow] outline-none hover:border-ink-300 focus:border-gold-500 focus:ring-3 focus:ring-gold-500/20 aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-red-600/10";

function invalid(fieldId: string, error?: string) {
  return error ? { "aria-invalid": true as const, "aria-describedby": `${fieldId}-error` } : {};
}

function Field({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink-800">
        {label}
        {required ? (
          <span className="ml-1 text-gold-700" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-ink-400">(optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
