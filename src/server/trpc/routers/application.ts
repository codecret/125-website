import { router, publicProcedure } from "../init";
import { applicationSchema, trackSchema } from "@/lib/validators";
import { application, statusHistory } from "@/server/db/schema";
import { eq, sql, and, like, desc } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { getTrackUrl } from "@/lib/email-layout";

export async function generateApplicationId(
  db: any
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `CC-${year}-`;

  const result = await db
    .select({ applicationId: application.applicationId })
    .from(application)
    .where(like(application.applicationId, `${prefix}%`))
    .orderBy(sql`${application.applicationId} DESC`)
    .limit(1);

  let nextNum = 1;
  if (result.length > 0) {
    const lastId = result[0].applicationId;
    const lastNum = parseInt(lastId.split("-")[2], 10);
    nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, "0")}`;
}

export const applicationRouter = router({
  submit: publicProcedure
    .input(applicationSchema)
    .mutation(async ({ ctx, input }) => {
      const appId = await generateApplicationId(ctx.db);

      const [inserted] = await ctx.db
        .insert(application)
        .values({
          applicationId: appId,
          fullName: input.fullName,
          email: input.email,
          projectType: input.projectType,
          budgetRange: input.budgetRange,
          timeline: input.timeline,
          description: input.description,
          status: "submitted",
        })
        .returning();

      // Record initial status
      await ctx.db.insert(statusHistory).values({
        applicationUuid: inserted.id,
        fromStatus: null,
        toStatus: "submitted",
        note: "Application submitted",
      });

      // Send confirmation email
      try {
        await sendEmail({
          to: input.email,
          subject: `Application Received - ${appId}`,
          body: `Dear ${input.fullName},\n\nThank you for submitting your project application. Your application ID is: ${appId}\n\nProject Type: ${input.projectType}\nBudget: ${input.budgetRange}\nTimeline: ${input.timeline}\n\nWe will review your application and get back to you soon. You can track the status of your application at any time using the button below.`,
          cta: { ctaUrl: getTrackUrl(appId) },
        });
      } catch (e) {
        // Don't fail the submission if email fails
        console.error("Failed to send confirmation email:", e);
      }

      return { applicationId: appId };
    }),

  track: publicProcedure
    .input(trackSchema)
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select({
          id: application.id,
          applicationId: application.applicationId,
          fullName: application.fullName,
          projectType: application.projectType,
          status: application.status,
          createdAt: application.createdAt,
          updatedAt: application.updatedAt,
        })
        .from(application)
        .where(eq(application.applicationId, input.applicationId))
        .limit(1);

      if (!result) {
        return null;
      }

      // Fetch notes left by admin on status changes
      const notes = await ctx.db
        .select({
          note: statusHistory.note,
          createdAt: statusHistory.createdAt,
        })
        .from(statusHistory)
        .where(
          and(
            eq(statusHistory.applicationUuid, result.id),
            sql`${statusHistory.note} IS NOT NULL`,
            sql`${statusHistory.changedBy} IS NOT NULL`
          )
        )
        .orderBy(desc(statusHistory.createdAt));

      const { id: _id, ...app } = result;
      return { ...app, notes };
    }),
});
