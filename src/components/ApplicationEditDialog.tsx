"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { Dialog } from "@/components/ui/dialog";
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

export function ApplicationEditDialog({
  appId,
  onClose,
}: {
  appId: string;
  onClose: () => void;
}) {
  const { data: app, isLoading } = trpc.admin.getById.useQuery({ id: appId });
  const utils = trpc.useUtils();

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

  useEffect(() => {
    setDetailsInitialized(false);
  }, [appId]);

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
      utils.admin.list.invalidate();
      utils.admin.getStats.invalidate();
      utils.admin.getById.invalidate({ id: appId });
    },
  });

  const updateApplicationMutation = trpc.admin.updateApplication.useMutation({
    onSuccess: () => {
      utils.admin.getById.invalidate({ id: appId });
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
      onClose();
    },
  });

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={
        isLoading ? (
          "Loading..."
        ) : app ? (
          <span className="font-mono flex items-center gap-2">
            {app.applicationId}
            <Badge
              variant={STATUS_VARIANT[app.status as ApplicationStatus] || "secondary"}
              className="text-xs"
            >
              {STATUS_LABELS[app.status as ApplicationStatus] || app.status}
            </Badge>
          </span>
        ) : (
          "Application"
        )
      }
    >
      {isLoading && (
        <div className="animate-pulse space-y-4 py-8">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      )}
      {!isLoading && !app && (
        <p className="text-gray-500 py-4">Application not found.</p>
      )}
      {!isLoading && app && (
        <div className="space-y-4">
          {/* Applicant details (editable) */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Applicant details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 py-0 pb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Full name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Project type</Label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Budget</Label>
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
                <div className="space-y-1">
                  <Label className="text-xs">Timeline</Label>
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
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
              </div>
              <Button
                size="sm"
                className="w-full"
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
                <p className="text-xs text-green-600">Details saved.</p>
              )}
              {updateApplicationMutation.error && (
                <p className="text-xs text-red-500">
                  {updateApplicationMutation.error.message || "Failed to save."}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 py-0 pb-3">
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
              <Textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Note (optional)"
                className="min-h-[60px] text-sm"
              />
              <Button
                size="sm"
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
                {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
              </Button>
            </CardContent>
          </Card>

          {/* Send Email */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Send Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 py-0 pb-3">
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
                <option value="">Template...</option>
                {EMAIL_TEMPLATES.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.label}
                  </option>
                ))}
              </Select>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Subject"
                className="text-sm"
              />
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Message"
                className="min-h-[80px] text-sm"
              />
              <Button
                size="sm"
                className="w-full"
                disabled={
                  !emailSubject ||
                  !emailBody ||
                  sendEmailMutation.isPending
                }
                onClick={() =>
                  sendEmailMutation.mutate({
                    id: app.id,
                    subject: emailSubject,
                    body: emailBody,
                  })
                }
              >
                {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
              </Button>
              {sendEmailMutation.isSuccess && (
                <p className="text-xs text-green-600">Email sent.</p>
              )}
              {sendEmailMutation.error && (
                <p className="text-xs text-red-500">Failed to send.</p>
              )}
            </CardContent>
          </Card>

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (
                window.confirm(
                  `Delete ${app.applicationId}? This cannot be undone.`
                )
              ) {
                deleteMutation.mutate({ id: app.id });
              }
            }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Application"}
          </Button>
        </div>
      )}
    </Dialog>
  );
}
