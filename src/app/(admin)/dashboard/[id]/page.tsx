"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  STATUS_VALUES,
  STATUS_LABELS,
  PROJECT_TYPES,
  BUDGET_RANGES,
  TIMELINES,
  type ApplicationStatus,
} from "@/lib/validators";
import Link from "next/link";
import { EMAIL_TEMPLATES, applyTemplate } from "@/lib/email-templates";

const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  submitted: "secondary",
  in_review: "warning",
  proposal_sent: "default",
  approved: "success",
  in_development: "default",
  completed: "success",
  rejected: "destructive",
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: app, isLoading, refetch } = trpc.admin.getById.useQuery({ id });

  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");
  const [detailsInitialized, setDetailsInitialized] = useState(false);

  const utils = trpc.useUtils();

  useEffect(() => {
    if (app && !detailsInitialized) {
      setFullName(app.fullName);
      setEmail(app.email);
      setProjectType(app.projectType);
      setBudgetRange(app.budgetRange);
      setTimeline(app.timeline);
      setDescription(app.description);
      setDetailsInitialized(true);
    }
  }, [app, detailsInitialized]);

  const updateStatusMutation = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      setNewStatus("");
      setStatusNote("");
      refetch();
      utils.admin.list.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  const updateApplicationMutation = trpc.admin.updateApplication.useMutation({
    onSuccess: () => {
      refetch();
      utils.admin.list.invalidate();
    },
  });

  const sendEmailMutation = trpc.admin.sendEmail.useMutation({
    onSuccess: () => {
      setEmailSubject("");
      setEmailBody("");
    },
  });

  const deleteHistoryMutation = trpc.admin.deleteStatusHistory.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMutation = trpc.admin.delete.useMutation({
    onSuccess: () => {
      utils.admin.list.invalidate();
      utils.admin.getStats.invalidate();
      router.replace("/dashboard");
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Application not found.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          &larr; Back
        </Button>
        <h1 className="text-xl font-bold font-mono">{app.applicationId}</h1>
        <Badge
          variant={STATUS_VARIANT[app.status as ApplicationStatus] || "secondary"}
        >
          {STATUS_LABELS[app.status as ApplicationStatus] || app.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Project Type</Label>
                <Select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <option value="">Select...</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                  >
                    <option value="">Select...</option>
                    {BUDGET_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  >
                    <option value="">Select...</option>
                    {TIMELINES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(app.createdAt).toLocaleString()}
              </p>
              <Button
                disabled={
                  updateApplicationMutation.isPending ||
                  !fullName.trim() ||
                  !email.trim() ||
                  !projectType ||
                  !budgetRange ||
                  !timeline ||
                  !description.trim()
                }
                onClick={() => {
                  updateApplicationMutation.mutate({
                    id: app.id,
                    fullName: fullName.trim(),
                    email: email.trim(),
                    projectType,
                    budgetRange,
                    timeline,
                    description: description.trim(),
                  });
                }}
              >
                {updateApplicationMutation.isPending ? "Saving..." : "Save details"}
              </Button>
              {updateApplicationMutation.isSuccess && (
                <p className="text-sm text-green-600">Details saved.</p>
              )}
              {updateApplicationMutation.error && (
                <p className="text-sm text-red-500">Failed to save details.</p>
              )}
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              {app.history.length === 0 ? (
                <p className="text-sm text-gray-500">No status changes yet.</p>
              ) : (
                <div className="space-y-4">
                  {app.history.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex gap-3 text-sm border-l-2 border-gray-200 pl-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {entry.fromStatus ? (
                            <>
                              <Badge variant="outline" className="text-xs">
                                {STATUS_LABELS[entry.fromStatus as ApplicationStatus] || entry.fromStatus}
                              </Badge>
                              <span className="text-gray-400">&rarr;</span>
                            </>
                          ) : null}
                          <Badge
                            variant={
                              STATUS_VARIANT[entry.toStatus as ApplicationStatus] || "secondary"
                            }
                            className="text-xs"
                          >
                            {STATUS_LABELS[entry.toStatus as ApplicationStatus] || entry.toStatus}
                          </Badge>
                        </div>
                        {entry.note && (
                          <p className="text-gray-600 mt-1">{entry.note}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(entry.createdAt).toLocaleString()}
                          {entry.changedByName && ` by ${entry.changedByName}`}
                        </p>
                      </div>
                      <button
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0 self-start mt-0.5 cursor-pointer"
                        title="Delete this entry"
                        disabled={deleteHistoryMutation.isPending}
                        onClick={() => {
                          if (window.confirm("Delete this status history entry?")) {
                            deleteHistoryMutation.mutate({ id: entry.id });
                          }
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Select status</option>
                  {STATUS_VALUES.filter((s) => s !== app.status).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Note (optional)</Label>
                <Textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this status change..."
                  className="min-h-[80px]"
                />
              </div>
              <Button
                className="w-full"
                disabled={!newStatus || updateStatusMutation.isPending}
                onClick={() => {
                  updateStatusMutation.mutate({
                    id: app.id,
                    status: newStatus as ApplicationStatus,
                    note: statusNote || undefined,
                  });
                }}
              >
                {updateStatusMutation.isPending
                  ? "Updating..."
                  : "Update Status"}
              </Button>
              {updateStatusMutation.error && (
                <p className="text-sm text-red-500">
                  Failed to update status. Try again.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Send Email */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Send Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-500">To: {app.fullName} &lt;{app.email}&gt;</p>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select
                  value=""
                  onChange={(e) => {
                    const tpl = EMAIL_TEMPLATES.find((t) => t.id === e.target.value);
                    if (tpl) {
                      const filled = applyTemplate(tpl, {
                        name: app.fullName,
                        applicationId: app.applicationId,
                      });
                      setEmailSubject(filled.subject);
                      setEmailBody(filled.body);
                    }
                  }}
                >
                  <option value="">Choose a template...</option>
                  {EMAIL_TEMPLATES.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder={`Re: ${app.applicationId}`}
                />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Write your message or pick a template above..."
                  className="min-h-[120px]"
                />
              </div>
              <Button
                className="w-full"
                disabled={
                  !emailSubject ||
                  !emailBody ||
                  sendEmailMutation.isPending
                }
                onClick={() => {
                  sendEmailMutation.mutate({
                    id: app.id,
                    subject: emailSubject,
                    body: emailBody,
                  });
                }}
              >
                {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
              </Button>
              {sendEmailMutation.isSuccess && (
                <p className="text-sm text-green-600">Email sent.</p>
              )}
              {sendEmailMutation.error && (
                <p className="text-sm text-red-500">Failed to send email.</p>
              )}
            </CardContent>
          </Card>

          {/* Delete */}
          <Card>
            <CardContent className="pt-6">
              <Button
                variant="destructive"
                className="w-full"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete application ${app.applicationId}? This cannot be undone.`
                    )
                  ) {
                    deleteMutation.mutate({ id: app.id });
                  }
                }}
              >
                {deleteMutation.isPending
                  ? "Deleting..."
                  : "Delete Application"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
