"use client";

import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { submitEnquiry } from "@/lib/actions/enquiry";
import { ENQUIRY_TYPES, MESSAGE_MAX, initialEnquiryState, type EnquiryField, type EnquiryType } from "@/lib/enquiry";
import { cn } from "@/lib/site";

type EnquiryFormProps = {
  defaultType?: EnquiryType;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
};

/** Enquiry form. Re-mounting via `key` gives a clean form after a successful submission. */
export function EnquiryForm(props: EnquiryFormProps) {
  const [round, setRound] = useState(0);
  return <EnquiryFormInner key={round} {...props} onReset={() => setRound((r) => r + 1)} />;
}

function EnquiryFormInner({
  defaultType = "Project or tender enquiry",
  submitLabel = "Send enquiry",
  messageLabel = "How can we help?",
  messagePlaceholder = "Tell us about your project, location, timelines and scope.",
  onReset,
}: EnquiryFormProps & { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const err = (f: EnquiryField) => state.errors?.[f];

  useEffect(() => {
    if (state.status === "error") formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-sm border border-leaf-500/30 bg-leaf-50 p-8 outline-none sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-leaf-600 text-white">
          <Icon name="check" className="size-6" strokeWidth={2} />
        </span>
        <h3 className="mt-6 font-display text-2xl font-semibold text-ink-950">Enquiry received</h3>
        <p className="mt-3 max-w-lg leading-relaxed text-ink-600">{state.message}</p>
        <button type="button" onClick={onReset} className="mt-6 text-sm font-semibold text-gold-700 hover:text-gold-800">
          Send another enquiry
        </button>
      </div>
    );
  }

  const v = state.values ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6" aria-describedby={state.message ? id("status") : undefined}>
      {state.status === "error" && state.message ? (
        <p id={id("status")} role="alert" className="flex items-start gap-3 rounded-sm border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-800">
          <Icon name="info" className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
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

      <Button type="submit" size="lg" icon={pending ? null : "arrow-right"} disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <span className="inline-flex items-center gap-2.5">
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" />
            Sending…
          </span>
        ) : (
          submitLabel
        )}
      </Button>
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
