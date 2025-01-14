import Plunk from "@plunk/node";

type EmailProps = {
  name?: string;
  to: string;
  subject: string;
  body: string;
  subscribed?: boolean;
};
export const sendEmail = async ({
  name = "125 inquiry",
  to,
  subject,
  body,
  subscribed = false,
}: EmailProps) => {
  if (!process.env.PLUNK_API_KEY) {
    throw new Error("PLUNK_API_KEY is missing from environment variables");
  }
  const mailer = new Plunk(process.env.PLUNK_API_KEY);

  await mailer.emails.send({ name, to, subject, body, subscribed });
};
