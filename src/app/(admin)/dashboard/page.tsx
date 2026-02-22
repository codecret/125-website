"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { trpc } from "@/trpc/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  STATUS_VALUES,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/validators";
import Link from "next/link";
import { EMAIL_TEMPLATES, applyTemplate } from "@/lib/email-templates";
import { ApplicationEditDialog } from "@/components/ApplicationEditDialog";

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

function ActionsMenu({
  app,
  onStatusChange,
  onDelete,
  onSendEmail,
  onEdit,
  isUpdating,
}: {
  app: { id: string; applicationId: string; status: string; email: string; fullName: string };
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string, label: string) => void;
  onSendEmail: (id: string) => void;
  onEdit: (id: string) => void;
  isUpdating: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.right - 192 });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [open, updatePos]);

  return (
    <>
      <Button
        ref={btnRef}
        variant="ghost"
        size="sm"
        onClick={() => {
          if (!open) updatePos();
          setOpen(!open);
          setStatusOpen(false);
        }}
        className="px-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </Button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed w-48 bg-white rounded-md shadow-lg border z-9999"
            style={{ top: pos.top, left: pos.left }}
          >
            {/* Edit (opens dialog) */}
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                onEdit(app.id);
                setOpen(false);
              }}
            >
              Edit
            </button>

            {/* Copy ID */}
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                navigator.clipboard.writeText(app.applicationId);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copied!" : "Copy ID"}
            </button>

            {/* Copy Email */}
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                navigator.clipboard.writeText(app.email);
                setOpen(false);
              }}
            >
              Copy Email
            </button>

            {/* Send Email */}
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                onSendEmail(app.id);
                setOpen(false);
              }}
            >
              Send Email
            </button>

            {/* Status submenu */}
            <div className="border-t">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                onClick={() => setStatusOpen(!statusOpen)}
                disabled={isUpdating}
              >
                <span>{isUpdating ? "Updating..." : "Change Status"}</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {statusOpen && (
                <div className="border-t bg-gray-50">
                  {STATUS_VALUES.filter((s) => s !== app.status).map((s) => (
                    <button
                      key={s}
                      className="w-full text-left px-6 py-1.5 text-xs hover:bg-gray-100"
                      onClick={() => {
                        onStatusChange(app.id, s);
                        setOpen(false);
                        setStatusOpen(false);
                      }}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Delete */}
            <div className="border-t">
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  onDelete(app.id, app.applicationId);
                  setOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [emailTarget, setEmailTarget] = useState<{ id: string; email: string; applicationId: string; fullName: string } | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [editDialogAppId, setEditDialogAppId] = useState<string | null>(null);

  useEffect(() => {
    if (!emailTarget) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEmailTarget(null);
        setEmailSubject("");
        setEmailBody("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [emailTarget]);

  const utils = trpc.useUtils();
  const stats = trpc.admin.getStats.useQuery();
  const exportQuery = trpc.admin.export.useQuery(undefined, { enabled: false });

  const applications = trpc.admin.list.useQuery({
    status: (statusFilter || undefined) as ApplicationStatus | undefined,
    search: search || undefined,
    page,
    limit: 20,
  });

  const updateStatusMutation = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      applications.refetch();
      stats.refetch();
    },
  });

  const deleteMutation = trpc.admin.delete.useMutation({
    onSuccess: () => {
      applications.refetch();
      stats.refetch();
    },
  });

  const sendEmailMutation = trpc.admin.sendEmail.useMutation({
    onSuccess: () => {
      setEmailTarget(null);
      setEmailSubject("");
      setEmailBody("");
    },
  });

  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`Delete ${label}? This cannot be undone.`)) {
      deleteMutation.mutate({ id });
    }
  };

  const handleSendEmail = (id: string) => {
    const app = applications.data?.items.find((a) => a.id === id);
    if (app) {
      setEmailTarget({ id: app.id, email: app.email, applicationId: app.applicationId, fullName: app.fullName });
      setEmailSubject("");
      setEmailBody("");
    }
  };

  const handleExportCSV = async () => {
    const result = await exportQuery.refetch();
    if (!result.data) return;

    const headers = [
      "Application ID",
      "Name",
      "Email",
      "Project Type",
      "Budget",
      "Timeline",
      "Status",
      "Description",

      "Created",
      "Updated",
    ];

    const rows = result.data.map((app) => [
      app.applicationId,
      app.fullName,
      app.email,
      app.projectType,
      app.budgetRange,
      app.timeline,
      STATUS_LABELS[app.status as ApplicationStatus] || app.status,
      `"${(app.description || "").replace(/"/g, '""')}"`,

      new Date(app.createdAt).toLocaleString(),
      new Date(app.updatedAt).toLocaleString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Link href="/dashboard/new">
            <Button>+ New Ticket</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-3xl font-bold">{stats.data?.total ?? "—"}</p>
          </CardContent>
        </Card>
        {(["submitted", "in_review", "in_development", "completed"] as const).map(
          (status) => (
            <Card key={status}>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">{STATUS_LABELS[status]}</p>
                <p className="text-3xl font-bold">
                  {stats.data?.byStatus[status] ?? 0}
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search by name, email, or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-[200px]"
        >
          <option value="">All Statuses</option>
          {STATUS_VALUES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">ID</th>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">
                    Project
                  </th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">
                    Date
                  </th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {applications.isLoading && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                )}
                {applications.data?.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                )}
                {applications.data?.items.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-mono text-xs">
                      <Link
                        href={`/dashboard/${app.id}`}
                        className="hover:underline text-primary"
                      >
                        {app.applicationId}
                      </Link>
                    </td>
                    <td className="p-3 font-medium">{app.fullName}</td>
                    <td className="p-3 hidden sm:table-cell text-gray-500">
                      {app.email}
                    </td>
                    <td className="p-3 hidden md:table-cell text-gray-500">
                      {app.projectType}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          STATUS_VARIANT[app.status as ApplicationStatus] ||
                          "secondary"
                        }
                      >
                        {STATUS_LABELS[app.status as ApplicationStatus] ||
                          app.status}
                      </Badge>
                    </td>
                    <td className="p-3 hidden md:table-cell text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <ActionsMenu
                        app={app}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onSendEmail={handleSendEmail}
                        onEdit={(id) => setEditDialogAppId(id)}
                        isUpdating={updateStatusMutation.isPending}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Application Dialog */}
      {editDialogAppId && (
        <ApplicationEditDialog
          appId={editDialogAppId}
          onClose={() => setEditDialogAppId(null)}
        />
      )}

      {/* Email Modal - window-style */}
      {emailTarget &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
            onClick={(e) => e.target === e.currentTarget && (setEmailTarget(null), setEmailSubject(""), setEmailBody(""))}
          >
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
              {/* Window title bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Send Email</h3>
                <button
                  type="button"
                  onClick={() => {
                    setEmailTarget(null);
                    setEmailSubject("");
                    setEmailBody("");
                  }}
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
              <p className="text-sm text-gray-500 mb-4">To: {emailTarget.fullName} &lt;{emailTarget.email}&gt;</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Template</label>
                  <Select
                    value=""
                    onChange={(e) => {
                      const tpl = EMAIL_TEMPLATES.find((t) => t.id === e.target.value);
                      if (tpl) {
                        const filled = applyTemplate(tpl, {
                          name: emailTarget.fullName,
                          applicationId: emailTarget.applicationId,
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
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder={`Re: ${emailTarget.applicationId}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Write your message or pick a template above..."
                    className="w-full min-h-[180px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEmailTarget(null);
                      setEmailSubject("");
                      setEmailBody("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!emailSubject || !emailBody || sendEmailMutation.isPending}
                    onClick={() => {
                      sendEmailMutation.mutate({
                        id: emailTarget.id,
                        subject: emailSubject,
                        body: emailBody,
                      });
                    }}
                  >
                    {sendEmailMutation.isPending ? "Sending..." : "Send"}
                  </Button>
                </div>
                {sendEmailMutation.isSuccess && (
                  <p className="text-sm text-green-600">Email sent successfully.</p>
                )}
                {sendEmailMutation.error && (
                  <p className="text-sm text-red-500">Failed to send email.</p>
                )}
              </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Pagination */}
      {applications.data && applications.data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {applications.data.page} of {applications.data.totalPages} (
            {applications.data.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= applications.data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
