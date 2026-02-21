"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const stats = trpc.admin.getStats.useQuery();
  const applications = trpc.admin.list.useQuery({
    status: (statusFilter || undefined) as ApplicationStatus | undefined,
    search: search || undefined,
    page,
    limit: 20,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

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
                  <th className="p-3"></th>
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
                      {app.applicationId}
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
                      <Link href={`/dashboard/${app.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
