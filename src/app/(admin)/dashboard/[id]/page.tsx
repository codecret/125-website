"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  STATUS_VALUES,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/validators";
import Link from "next/link";

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

  const utils = trpc.useUtils();

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
        </div>
      </div>
    </div>
  );
}
