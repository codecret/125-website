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
  const [adminNotes, setAdminNotes] = useState("");
  const [notesInitialized, setNotesInitialized] = useState(false);
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

  const updateNotesMutation = trpc.admin.updateNotes.useMutation({
    onSuccess: () => {
      refetch();
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

  const deleteMutation = trpc.admin.delete.useMutation({
    onSuccess: () => {
      utils.admin.list.invalidate();
      utils.admin.getStats.invalidate();
      router.replace("/dashboard");
    },
  });

  // Initialize admin notes when data loads
  if (app && !notesInitialized) {
    setAdminNotes(app.adminNotes || "");
    setNotesInitialized(true);
  }

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
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium">{app.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{app.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Project Type</p>
                  <p className="font-medium">{app.projectType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Budget Range</p>
                  <p className="font-medium">{app.budgetRange}</p>
                </div>
                <div>
                  <p className="text-gray-500">Timeline</p>
                  <p className="font-medium">{app.timeline}</p>
                </div>
                <div>
                  <p className="text-gray-500">Submitted</p>
                  <p className="font-medium">
                    {new Date(app.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-sm">Description</p>
                <p className="mt-1 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                  {app.description}
                </p>
              </div>
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

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this application..."
                className="min-h-[120px]"
              />
              <Button
                variant="outline"
                className="w-full"
                disabled={updateNotesMutation.isPending}
                onClick={() => {
                  updateNotesMutation.mutate({
                    id: app.id,
                    adminNotes,
                  });
                }}
              >
                {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
              </Button>
              {updateNotesMutation.isSuccess && (
                <p className="text-sm text-green-600">Notes saved.</p>
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
