export const CONTACT_TYPES = ["Job", "Freelance", "Collaboration", "Other"];

export type ContactInput = { type: string; name: string; email: string; subject: string; message: string };
export type ContactField = "name" | "email" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the form (on blur and submit) and the API route, so both agree. */
export function validateField(field: ContactField, value: string): string | undefined {
  const v = value.trim();
  if (field === "name") {
    if (!v) return "Enter your name";
    if (v.length > 120) return "Keep your name under 120 characters";
  }
  if (field === "email") {
    if (!EMAIL.test(v) || v.length > 254) return "Enter an email address like name@example.com";
  }
  if (field === "message") {
    if (!v) return "Enter a message";
    if (v.length > 5000) return "Keep your message under 5,000 characters";
  }
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  for (const f of ["name", "email", "message"] as const) {
    const e = validateField(f, input[f]);
    if (e) errors[f] = e;
  }
  return errors;
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0];
