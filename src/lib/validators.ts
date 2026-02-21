import { z } from "zod";

export const STATUS_VALUES = [
  "submitted",
  "in_review",
  "proposal_sent",
  "approved",
  "in_development",
  "completed",
  "rejected",
] as const;

export type ApplicationStatus = (typeof STATUS_VALUES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  in_review: "In Review",
  proposal_sent: "Proposal Sent",
  approved: "Approved",
  in_development: "In Development",
  completed: "Completed",
  rejected: "Rejected",
};

export const PROJECT_TYPES = [
  "Web Application",
  "Mobile Application",
  "E-commerce Store",
  "Landing Page",
  "SaaS Platform",
  "API Development",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
] as const;

export const TIMELINES = [
  "Less than 1 month",
  "1 - 3 months",
  "3 - 6 months",
  "6 - 12 months",
  "12+ months",
] as const;

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  projectType: z.string().min(1, "Project type is required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Timeline is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const trackSchema = z.object({
  applicationId: z
    .string()
    .regex(/^CC-\d{4}-\d{4}$/, "Invalid application ID format (CC-YYYY-XXXX)"),
});

export const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(STATUS_VALUES),
  note: z.string().optional(),
});

export const updateNotesSchema = z.object({
  id: z.string().uuid(),
  adminNotes: z.string(),
});

export const listApplicationsSchema = z.object({
  status: z.enum(STATUS_VALUES).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
