/**
 * HTML email layout with 125 logo and consistent styling.
 * Use SITE_URL or NEXT_PUBLIC_APP_URL in .env for logo link (e.g. https://125.codecret.com).
 */

const getSiteUrl = (): string => {
  const base =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://125.codecret.com";
  return base.replace(/\/$/, "");
};

const getLogoUrl = (): string => `${getSiteUrl()}/logo.png`;

/** Convert plain text to HTML paragraphs (preserve newlines). */
function textToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const escaped = escapeHtml(p);
      return `<p style="margin: 0 0 1em; color: #374151; line-height: 1.6;">${escaped.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build a CTA button row (table-based for email clients). */
function ctaButtonHtml(url: string, label: string): string {
  const safeUrl = escapeHtml(url);
  const safeLabel = escapeHtml(label);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px auto 8px;">
  <tr>
    <td align="center" style="background-color: #313afb; border-radius: 8px;">
      <a href="${safeUrl}" target="_blank" rel="noopener" style="display: inline-block; padding: 12px 32px; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; letter-spacing: 0.3px;">
        ${safeLabel}
      </a>
    </td>
  </tr>
</table>`;
}

/** Helper to build the track page URL with the application ID pre-filled. */
export function getTrackUrl(applicationId: string): string {
  return `${getSiteUrl()}/track?id=${encodeURIComponent(applicationId)}`;
}

export type EmailLayoutOptions = {
  /** Optional call-to-action button URL. */
  ctaUrl?: string;
  /** Optional call-to-action button label (default: "Track Your Application"). */
  ctaLabel?: string;
};

/**
 * Wrap email body in a branded HTML layout with 125 logo.
 * If body already contains "<html", it is returned as-is (assumed full HTML).
 */
export function wrapEmailHtml(body: string, options?: EmailLayoutOptions): string {
  if (body.trim().toLowerCase().includes("<html")) {
    return body;
  }
  const logoUrl = getLogoUrl();
  const contentHtml = textToHtml(body);
  const ctaHtml = options?.ctaUrl
    ? ctaButtonHtml(options.ctaUrl, options.ctaLabel || "Track Your Application")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>125</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
          <tr>
            <td style="padding: 32px 32px 24px; background: linear-gradient(135deg, #1f2937 0%, #111827 100%); text-align: center;">
              <a href="${escapeHtml(getSiteUrl())}" target="_blank" rel="noopener" style="display: inline-block;">
                <img src="${escapeHtml(logoUrl)}" alt="125" width="180" height="71" style="display: block; max-width: 180px; height: auto;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px;">
              ${contentHtml}
              ${ctaHtml}
              <p style="margin: 1.5em 0 0; padding-top: 1em; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                Best regards,<br/><strong>125 Solutions</strong>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af;">
          You received this email from 125. If you have questions, reply to this message.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
