"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { STATUS_VALUES, STATUS_LABELS, type ApplicationStatus } from "@/lib/validators";
import Link from "next/link";

const STATUS_VARIANT: Record<ApplicationStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  submitted: "secondary",
  in_review: "warning",
  proposal_sent: "default",
  approved: "success",
  in_development: "default",
  completed: "success",
  rejected: "destructive",
};

const PROGRESS_STATUSES = STATUS_VALUES.filter((s) => s !== "rejected");

export default function TrackPage() {
  const [applicationId, setApplicationId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading, isError } = trpc.application.track.useQuery(
    { applicationId: searchId },
    { enabled: !!searchId }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = applicationId.trim().toUpperCase();
    if (!/^CC-\d{4}-\d{4}$/.test(trimmed)) {
      setError("Invalid format. Use CC-YYYY-XXXX (e.g., CC-2026-0001)");
      return;
    }

    setSearchId(trimmed);
  };

  const currentStepIndex = data
    ? PROGRESS_STATUSES.indexOf(data.status as (typeof PROGRESS_STATUSES)[number])
    : -1;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Track Your Application</h1>
          <p className="text-gray-600 mt-2">
            Enter your application ID to check the current status.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="applicationId" className="sr-only">Application ID</Label>
                <Input
                  id="applicationId"
                  value={applicationId}
                  onChange={(e) => {
                    setApplicationId(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="CC-2026-0001"
                  className="font-mono"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Searching..." : "Track"}
              </Button>
            </form>
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {isError && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-red-500">Something went wrong. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {searchId && data === null && !isLoading && (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No application found</p>
              <p className="text-sm text-gray-500 mt-1">
                Please check your application ID and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Application Status</CardTitle>
                  <Badge variant={STATUS_VARIANT[data.status as ApplicationStatus] || "secondary"}>
                    {STATUS_LABELS[data.status as ApplicationStatus] || data.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Application ID</p>
                    <p className="font-mono font-semibold">{data.applicationId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Applicant</p>
                    <p className="font-semibold">{data.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Project Type</p>
                    <p className="font-semibold">{data.projectType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Submitted</p>
                    <p className="font-semibold">
                      {new Date(data.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Progress Timeline */}
                {data.status !== "rejected" && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Progress</p>
                    <div className="flex items-center gap-0">
                      {PROGRESS_STATUSES.map((status, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        return (
                          <div key={status} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                  isCurrent
                                    ? "border-primary bg-primary text-white"
                                    : isCompleted
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-gray-300 bg-white text-gray-400"
                                }`}
                              >
                                {isCompleted && !isCurrent ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <p className={`text-[10px] mt-1 text-center leading-tight max-w-[70px] ${
                                isCurrent ? "font-semibold text-primary" : isCompleted ? "text-green-600" : "text-gray-400"
                              }`}>
                                {STATUS_LABELS[status]}
                              </p>
                            </div>
                            {index < PROGRESS_STATUSES.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${
                                index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {data.status === "rejected" && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
                    This application has been declined. Please contact us if you have questions.
                  </div>
                )}

                {data.adminNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes from our team</p>
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm whitespace-pre-wrap">
                      {data.adminNotes}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-400 text-right">
                  Last updated: {new Date(data.updatedAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/apply">
                <Button variant="outline">Submit Another Application</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
