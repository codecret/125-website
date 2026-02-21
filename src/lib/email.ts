import Plunk from "@plunk/node";

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
};

export const sendEmail = async ({
  name = "125 inquiry",
  from = process.env.PLUNK_FROM_EMAIL,
  to,
  subject,
  body,
  subscribed = false,
}: EmailProps) => {
  const rawKey = process.env.PLUNK_API_KEY;
  if (!rawKey || !rawKey.trim()) {
    throw new Error("PLUNK_API_KEY is missing from environment variables");
  }
  const mailer = new Plunk(rawKey.trim(), { baseUrl: PLUNK_BASE_URL });

  await mailer.emails.send({
    ...(from && { from }),
    name,
    to,
    subject,
    body,
    subscribed,
  });
};
