import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { application, statusHistory } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { STATUS_VALUES, STATUS_LABELS } from "@/lib/validators";
import { sendEmail } from "@/lib/email";

const API_SECRET = process.env.BETTER_AUTH_SECRET;

export async function POST(req: NextRequest) {
  // Authenticate via API key in header
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { applicationId, status, note } = body;

    // Validate input
    if (!applicationId || typeof applicationId !== "string") {
      return NextResponse.json(
        { error: "applicationId is required (e.g. CC-2026-0001)" },
        { status: 400 }
      );
    }

    if (!status || !STATUS_VALUES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${STATUS_VALUES.join(", ")}` },
        { status: 400 }
      );
    }

    // Find the application
    const [app] = await db
      .select()
      .from(application)
      .where(eq(application.applicationId, applicationId))
      .limit(1);

    if (!app) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const previousStatus = app.status;

    // Update status
    await db
      .update(application)
      .set({ status, updatedAt: new Date() })
      .where(eq(application.id, app.id));

    // Record history
    await db.insert(statusHistory).values({
      applicationUuid: app.id,
      fromStatus: previousStatus,
      toStatus: status,
      note: note || "Updated via API",
    });

    // Send email notification
    try {
      const statusLabel =
        STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
      await sendEmail({
        to: app.email,
        subject: `Application ${app.applicationId} - Status Update`,
        body: `Dear ${app.fullName},\n\nYour application (${app.applicationId}) status has been updated to: ${statusLabel}\n\n${note ? `Note: ${note}\n\n` : ""}You can track your application status at any time using your application ID.\n\nBest regards,\nCodecret Team`,
      });
    } catch {
      // Don't fail the API call if email fails
    }

    return NextResponse.json({
      success: true,
      applicationId: app.applicationId,
      previousStatus,
      newStatus: status,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
