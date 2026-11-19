"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { CircleAlert, Check } from "lucide-react";
import { contactTypes, site } from "@/lib/content";
import { firstName, validateContact, validateField, type ContactErrors, type ContactField } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "failed";
const EMPTY = { name: "", email: "", subject: "", message: "" };

const stamp = (d: Date) => {
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(d);
  return `${date} · ${time}`;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-error mt-1.5 flex items-center gap-1.5 text-[13px] leading-[18px]">
      <CircleAlert size={16} strokeWidth={1.75} aria-hidden className="shrink-0" />
      {message}
    </p>
  );
}

export function ContactForm() {
  const [type, setType] = useState(0);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [slip, setSlip] = useState<{ type: string; from: string; at: string } | null>(null);
  const [hint, setHint] = useState<number | null>(null);
  const opened = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const fields = useRef<Partial<Record<ContactField, HTMLElement | null>>>({});
  const slipRef = useRef<HTMLDivElement>(null);
  const returning = useRef(false);

  // The form and slip replace each other, so move focus with them.
  useEffect(() => {
    opened.current = Date.now();
    if (slip) slipRef.current?.focus();
    else if (returning.current) fields.current.name?.focus();
    returning.current = false;
  }, [slip]);

  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (k !== "subject" && errors[k]) setErrors((all) => ({ ...all, [k]: undefined }));
  };
  const blur = (k: ContactField) => () => setErrors((all) => ({ ...all, [k]: validateField(k, values[k]) }));

  const fieldProps = (k: ContactField) => ({
    ref: (el: HTMLElement | null) => { fields.current[k] = el; },
    id: k,
    name: k,
    value: values[k],
    onChange: set(k),
    onBlur: blur(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
    required: true,
    className: "field",
  });

  const onRadioKey = (e: KeyboardEvent, i: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const n = (i + step + contactTypes.length) % contactTypes.length;
    setType(n);
    radios.current[n]?.focus();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const input = { type: contactTypes[type].value, ...values };
    const found = validateContact(input);
    setErrors(found);
    const first = (["name", "email", "message"] as const).find((k) => found[k]);
    if (first) {
      fields.current[first]?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website: honeypot.current?.value ?? "", elapsedMs: Date.now() - opened.current }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setStatus("failed");
      return;
    }
    setStatus("sent");
    // Hold "Sent ✓" just long enough to read, then print the slip.
    setTimeout(() => setSlip({ type: input.type, from: firstName(input.name), at: stamp(new Date()) }), 500);
  };

  const reset = () => {
    returning.current = true;
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
    setSlip(null);
  };

  if (slip) {
    return (
      <div className="bg-surface shadow-e2 flex flex-col items-center rounded-[28px] p-6 md:min-h-[520px] md:p-10">
        <div ref={slipRef} tabIndex={-1} role="group" aria-label="Message received" className="slip-shadow print-in w-full max-w-[360px] outline-none">
          <div className="slip">
            <p className="t-label">Message received</p>
            <div className="border-line my-4 border-t border-dashed" />
            <p>Type: {slip.type}</p>
            <p className="mt-1.5">From: {slip.from}</p>
            <p className="mt-1.5">{slip.at}</p>
            <div className="border-line my-4 border-t border-dashed" />
            <p>Thanks. I&apos;ll be in touch soon.</p>
          </div>
        </div>
        <button type="button" onClick={reset} className="link mt-8">Send another</button>
      </div>
    );
  }

  const shownHint = contactTypes[hint ?? type].hint;

  return (
    <form method="post" action="/api/contact" onSubmit={onSubmit} noValidate className="bg-surface shadow-e2 rounded-[28px] p-5 md:p-10">
      <p id="type-label" className="t-ui">What&apos;s this about?</p>
      <div role="radiogroup" aria-labelledby="type-label" className="bg-surface-alt mt-2 grid grid-cols-2 rounded-[24px] p-1 md:h-12 md:grid-cols-4 md:rounded-full">
        {contactTypes.map((t, i) => (
          <button
            key={t.value}
            ref={(el) => { radios.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={type === i}
            tabIndex={type === i ? 0 : -1}
            onClick={() => setType(i)}
            onKeyDown={(e) => onRadioKey(e, i)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHint(i)}
            onPointerLeave={() => setHint(null)}
            onFocus={() => setHint(i)}
            onBlur={() => setHint(null)}
            className={`t-ui h-10 rounded-full transition-colors duration-200 ${type === i ? "bg-surface shadow-e1 text-ink" : "text-muted hover:text-ink"}`}
          >
            {t.value}
          </button>
        ))}
      </div>
      <p className="t-caption mt-2">{shownHint}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-muted mb-2 block text-[14px] leading-5 font-medium">Name</label>
          <input {...fieldProps("name")} type="text" autoComplete="name" maxLength={120} />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="email" className="text-muted mb-2 block text-[14px] leading-5 font-medium">Email</label>
          <input {...fieldProps("email")} type="email" autoComplete="email" maxLength={254} />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="subject" className="text-muted mb-2 block text-[14px] leading-5 font-medium">Subject</label>
        <input id="subject" name="subject" type="text" value={values.subject} onChange={set("subject")} maxLength={200} className="field" />
      </div>

      <div className="mt-6">
        <label htmlFor="message" className="text-muted mb-2 block text-[14px] leading-5 font-medium">Message</label>
        <textarea {...fieldProps("message")} placeholder={contactTypes[type].placeholder} maxLength={5000} />
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div className="absolute size-px overflow-hidden opacity-0" aria-hidden>
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "failed" && (
        <div role="alert" className="border-error text-error mt-6 flex items-start gap-2 rounded-[8px] border px-4 py-3 text-[15px] leading-[22px]">
          <CircleAlert size={18} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0" />
          <p>
            Your message didn&apos;t send, and it&apos;s still here. Try again, or email me directly at{" "}
            <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button type="submit" disabled={status === "sending" || status === "sent"} aria-live="polite" className="btn btn-primary btn-block disabled:opacity-100">
          {status === "sending" && (
            <svg className="spin" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeDasharray="28 14" strokeLinecap="round" />
            </svg>
          )}
          {status === "sent" ? <>Sent <Check size={18} strokeWidth={1.75} aria-hidden /></> : status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
