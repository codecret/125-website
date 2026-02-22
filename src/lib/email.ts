import Plunk from "@plunk/node";
import { wrapEmailHtml, type EmailLayoutOptions } from "./email-layout";

// Plunk docs: https://next-wiki.useplunk.com/api-reference/public-api/sendEmail
// Send endpoint requires: Secret key (sk_*), and "from" (verified sender) unless using a template.

const PLUNK_BASE_URL = "https://next-api.useplunk.com/v1/";

type EmailProps = {
  name?: string;
  from?: string;
  to: string;
  subject: string;
  body: string;
  subscribed?: boolean;
  /** Set to true to send raw HTML without wrapping in branded layout (e.g. already full HTML). */
  rawHtml?: boolean;
  /** Optional CTA button in the email layout. */
  cta?: EmailLayoutOptions;
};

export const sendEmail = async ({
  name = "125",
  from = process.env.PLUNK_FROM_EMAIL,
  to,
  subject,
  body,
  subscribed = false,
  rawHtml = false,
  cta,
}: EmailProps) => {
  const rawKey = process.env.PLUNK_API_KEY;
  if (!rawKey || !rawKey.trim()) {
    throw new Error("PLUNK_API_KEY is missing from environment variables");
  }
  const mailer = new Plunk(rawKey.trim(), { baseUrl: PLUNK_BASE_URL });

  const htmlBody = rawHtml ? body : wrapEmailHtml(body, cta);

  await mailer.emails.send({
    ...(from && { from }),
    name,
    to,
    subject,
    body: htmlBody,
    subscribed,
  });
};
