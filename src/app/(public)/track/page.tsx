"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import { STATUS_VALUES, STATUS_LABELS, type ApplicationStatus } from "@/lib/validators";
import Link from "next/link";
import Logo from "@/components/Logo";

const STATUS_VARIANT: Record<ApplicationStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  submitted: "secondary",
  in_review: "warning",
  proposal_sent: "default",
  approved: "success",
  in_development: "default",
  completed: "success",
  rejected: "destructive",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  submitted: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  in_review: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  proposal_sent: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  approved: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  in_development: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  completed: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
};

const PROGRESS_STATUSES = STATUS_VALUES.filter((s) => s !== "rejected");

export default function TrackPage() {
  return (
    <Suspense>
      <TrackPageContent />
    </Suspense>
  );
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");

  // Auto-fill and search when ?id= is present in the URL (e.g. from email CTA)
  useEffect(() => {
    const idParam = searchParams.get("id")?.trim().toUpperCase();
    if (idParam && /^CC-\d{4}-\d{4}$/.test(idParam)) {
      setApplicationId(idParam);
      setSearchId(idParam);
    }
  }, [searchParams]);

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0 bg-primary backgroundblue" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('/codingwallpaperoptimized1.com-optimize.gif')" }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Nav */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          <Link href="/" className="block [&_svg]:w-[70px]">
            <Logo color="#fff" />
          </Link>
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Home
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
          {/* Title section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm">Live Status Tracking</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 font-main">
              Track Your Project
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-md mx-auto">
              Enter your application ID to see real-time progress updates
            </p>
          </div>

          {/* Search box */}
          <div className="w-full max-w-xl mb-8">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 focus-within:border-white/40 transition-colors">
                <div className="pl-4 pr-2">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  value={applicationId}
                  onChange={(e) => {
                    setApplicationId(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="CC-2026-0001"
                  className="flex-1 bg-transparent text-white placeholder-white/30 font-mono text-lg py-3 px-2 outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : "Track"}
                </button>
              </div>
              {error && (
                <p className="text-red-300 text-sm mt-3 pl-4">{error}</p>
              )}
            </form>
          </div>

          {/* Error state */}
          {isError && (
            <div className="w-full max-w-xl">
              <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-6 text-center">
                <p className="text-red-300">Something went wrong. Please try again.</p>
              </div>
            </div>
          )}

          {/* Not found state */}
          {searchId && data === null && !isLoading && (
            <div className="w-full max-w-xl">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center">
                <div className="mx-auto mb-5 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <p className="text-white text-lg font-semibold mb-1">No application found</p>
                <p className="text-white/50 text-sm">
                  Please check your application ID and try again.
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {data && (
            <div className="w-full max-w-2xl space-y-5">
              {/* Status card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Application</p>
                    <p className="text-white font-mono text-2xl font-bold">{data.applicationId}</p>
                  </div>
                  <Badge
                    variant={STATUS_VARIANT[data.status as ApplicationStatus] || "secondary"}
                    className="text-sm px-4 py-1.5 rounded-full"
                  >
                    {STATUS_LABELS[data.status as ApplicationStatus] || data.status}
                  </Badge>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5">
                  <div className="bg-white/5 p-4 text-center">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Applicant</p>
                    <p className="text-white font-medium text-sm truncate">{data.fullName}</p>
                  </div>
                  <div className="bg-white/5 p-4 text-center">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Project</p>
                    <p className="text-white font-medium text-sm truncate">{data.projectType}</p>
                  </div>
                  <div className="bg-white/5 p-4 text-center">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Submitted</p>
                    <p className="text-white font-medium text-sm">{new Date(data.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white/5 p-4 text-center">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Updated</p>
                    <p className="text-white font-medium text-sm">{new Date(data.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Progress timeline */}
              {data.status !== "rejected" && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6">
                  <p className="text-white/60 text-sm font-medium mb-6 uppercase tracking-wider">Progress Timeline</p>
                  <div className="space-y-0">
                    {PROGRESS_STATUSES.map((status, index) => {
                      const isCompleted = index < currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      return (
                        <div key={status} className="flex items-start gap-4">
                          {/* Connector line + dot */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                isCurrent
                                  ? "bg-white text-primary shadow-lg shadow-white/20"
                                  : isCompleted
                                  ? "bg-green-500/20 text-green-400 border-2 border-green-500/40"
                                  : "bg-white/5 text-white/20 border border-white/10"
                              }`}
                            >
                              {isCompleted ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              ) : (
                                STATUS_ICONS[status] || <span className="text-sm font-bold">{index + 1}</span>
                              )}
                            </div>
                            {index < PROGRESS_STATUSES.length - 1 && (
                              <div className={`w-0.5 h-8 my-1 ${
                                isCompleted ? "bg-green-500/40" : "bg-white/10"
                              }`} />
                            )}
                          </div>
                          {/* Label */}
                          <div className="pt-2 pb-4">
                            <p className={`text-sm font-medium ${
                              isCurrent
                                ? "text-white"
                                : isCompleted
                                ? "text-green-400/80"
                                : "text-white/30"
                            }`}>
                              {STATUS_LABELS[status]}
                            </p>
                            {isCurrent && (
                              <p className="text-white/40 text-xs mt-0.5">Current stage</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rejected notice */}
              {data.status === "rejected" && (
                <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-red-300 font-medium">Application Declined</p>
                      <p className="text-red-300/60 text-sm mt-1">
                        This application has been declined. Please contact us if you have questions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin notes */}
              {data.adminNotes && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/60 text-sm font-medium mb-2">Message from our team</p>
                      <div
                        className="text-white/80 text-sm leading-relaxed [&_a]:text-blue-300 [&_a]:underline"
                        dangerouslySetInnerHTML={{
                          __html: data.adminNotes
                            .replace(/\n/g, "<br/>")
                            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Status history / updates */}
              {data.history && data.history.filter((h) => h.note).length > 0 && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6">
                  <p className="text-white/60 text-sm font-medium mb-5 uppercase tracking-wider">Updates</p>
                  <div className="space-y-4">
                    {data.history
                      .filter((h) => h.note)
                      .map((entry) => (
                        <div key={entry.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 mt-2 rounded-full bg-white/30 shrink-0" />
                            <div className="w-px flex-1 bg-white/10 mt-1" />
                          </div>
                          <div className="pb-4 min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={STATUS_VARIANT[entry.toStatus as ApplicationStatus] || "secondary"}
                                className="text-xs px-2 py-0.5 rounded-full"
                              >
                                {STATUS_LABELS[entry.toStatus as ApplicationStatus] || entry.toStatus}
                              </Badge>
                              <span className="text-white/30 text-xs">
                                {new Date(entry.createdAt).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">{entry.note}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center gap-4 pt-2">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Application
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-colors text-sm"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
