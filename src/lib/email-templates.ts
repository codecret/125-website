export interface EmailTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

/**
 * Placeholders: {name}, {applicationId}
 * Replaced at render time with actual values.
 */
export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "received",
    label: "Application Received",
    subject: "We've Received Your Application - {applicationId}",
    body: `Thank you for submitting your project application. We've received it and our team will review it shortly.

Your application ID is {applicationId}. You can use this to track the status of your project at any time.

We'll be in touch within 1-2 business days with next steps.`,
  },
  {
    id: "more_info",
    label: "Request More Information",
    subject: "Additional Information Needed - {applicationId}",
    body: `We've reviewed your application ({applicationId}) and we'd love to move forward. However, we need a bit more information to prepare an accurate proposal.

Could you please provide:
- More details about the core features you need
- Any design references or examples you like
- Your preferred communication channel (email, Slack, etc.)

Please reply to this email with the details and we'll get back to you promptly.`,
  },
  {
    id: "proposal_sent",
    label: "Proposal Ready",
    subject: "Your Project Proposal is Ready - {applicationId}",
    body: `Great news! We've prepared a proposal for your project ({applicationId}).

Please review the attached proposal at your earliest convenience. It includes:
- Project scope and deliverables
- Timeline and milestones
- Investment breakdown

Let us know if you have any questions or would like to schedule a call to discuss.`,
  },
  {
    id: "approved",
    label: "Project Approved",
    subject: "Project Approved - Let's Get Started! - {applicationId}",
    body: `We're excited to confirm that your project ({applicationId}) has been approved and we're ready to begin!

Here's what happens next:
- Our team will begin the initial setup and planning phase
- You'll receive a project kickoff email with timeline details
- We'll schedule a kickoff call to align on priorities

Looking forward to building something great together.`,
  },
  {
    id: "in_development",
    label: "Development Update",
    subject: "Development Update - {applicationId}",
    body: `Here's a quick update on your project ({applicationId}).

Progress:
- [Describe what was completed]
- [Current milestone/phase]

Next steps:
- [What's coming next]
- [Expected timeline for next update]

If you have any questions or feedback, don't hesitate to reach out.`,
  },
  {
    id: "review_ready",
    label: "Ready for Review",
    subject: "Your Project is Ready for Review - {applicationId}",
    body: `Your project ({applicationId}) is ready for your review!

Please take a look and let us know:
- Does everything meet your expectations?
- Are there any changes or adjustments needed?
- Any feedback on the overall experience?

We want to make sure everything is perfect before we finalize.`,
  },
  {
    id: "completed",
    label: "Project Completed",
    subject: "Project Completed - {applicationId}",
    body: `We're happy to let you know that your project ({applicationId}) has been completed!

Deliverables:
- [List deliverables]
- All source files and documentation have been prepared

Next steps:
- Please review everything and confirm you're satisfied
- We'll provide 30 days of post-launch support
- Feel free to reach out anytime if you need further assistance

Thank you for choosing us for your project. We'd love to work with you again!`,
  },
  {
    id: "rejected",
    label: "Application Declined",
    subject: "Regarding Your Application - {applicationId}",
    body: `Thank you for your interest in working with us. After careful review of your application ({applicationId}), we've decided we're not the best fit for this particular project at this time.

This could be due to:
- Current capacity and scheduling constraints
- The project scope falling outside our core expertise

We appreciate you considering us and wish you the best with your project. Feel free to reach out in the future for other projects.`,
  },
  {
    id: "follow_up",
    label: "Follow Up",
    subject: "Following Up - {applicationId}",
    body: `Just checking in regarding your application ({applicationId}).

We wanted to follow up and see if you had any questions or if there's anything we can help with.

Please don't hesitate to reach out — we're here to help.`,
  },
  {
    id: "payment_reminder",
    label: "Payment Reminder",
    subject: "Payment Reminder - {applicationId}",
    body: `This is a friendly reminder regarding the payment for your project ({applicationId}).

If you've already made the payment, please disregard this message. Otherwise, kindly process it at your earliest convenience.

If you have any questions about the invoice or need to discuss payment arrangements, please let us know.`,
  },
];

export function applyTemplate(
  template: EmailTemplate,
  vars: { name: string; applicationId: string }
): { subject: string; body: string } {
  const replace = (text: string) =>
    text
      .replace(/\{name\}/g, vars.name)
      .replace(/\{applicationId\}/g, vars.applicationId);

  return {
    subject: replace(template.subject),
    body: replace(template.body),
  };
}
