import { z } from "zod";
import { router, adminProcedure } from "../init";
import {
  listApplicationsSchema,
  updateStatusSchema,
  updateNotesSchema,
  updateApplicationSchema,
  adminCreateSchema,
  STATUS_VALUES,
  STATUS_LABELS,
} from "@/lib/validators";
import { application, statusHistory, user } from "@/server/db/schema";
import { eq, and, ilike, or, desc, count } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { generateApplicationId } from "./application";

export const adminRouter = router({
  list: adminProcedure
    .input(listApplicationsSchema)
    .query(async ({ ctx, input }) => {
      const { status, search, page, limit } = input;
      const offset = (page - 1) * limit;

      const statusCondition = status
        ? eq(application.status, status)
        : undefined;
      const searchCondition = search
        ? or(
            ilike(application.fullName, `%${search}%`),
            ilike(application.email, `%${search}%`),
            ilike(application.applicationId, `%${search}%`)
          )
        : undefined;

      const where = and(statusCondition, searchCondition);

      const [items, totalResult] = await Promise.all([
        ctx.db
          .select()
          .from(application)
          .where(where)
          .orderBy(desc(application.createdAt))
          .limit(limit)
          .offset(offset),
        ctx.db
          .select({ count: count() })
          .from(application)
          .where(where),
      ]);

      return {
        items,
        total: totalResult[0].count,
        page,
        totalPages: Math.ceil(totalResult[0].count / limit),
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [app] = await ctx.db
        .select()
        .from(application)
        .where(eq(application.id, input.id))
        .limit(1);

      if (!app) return null;

      const history = await ctx.db
        .select({
          id: statusHistory.id,
          fromStatus: statusHistory.fromStatus,
          toStatus: statusHistory.toStatus,
          note: statusHistory.note,
          createdAt: statusHistory.createdAt,
          changedByName: user.name,
        })
        .from(statusHistory)
        .leftJoin(user, eq(statusHistory.changedBy, user.id))
        .where(eq(statusHistory.applicationUuid, input.id))
        .orderBy(desc(statusHistory.createdAt));

      return { ...app, history };
    }),

  updateStatus: adminProcedure
    .input(updateStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const [app] = await ctx.db
        .select()
        .from(application)
        .where(eq(application.id, input.id))
        .limit(1);

      if (!app) {
        throw new Error("Application not found");
      }

      const previousStatus = app.status;

      await ctx.db
        .update(application)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(application.id, input.id));

      await ctx.db.insert(statusHistory).values({
        applicationUuid: input.id,
        fromStatus: previousStatus,
        toStatus: input.status,
        changedBy: ctx.session.user.id,
        note: input.note || null,
      });

      // Send email notification
      try {
        const statusLabel =
          STATUS_LABELS[input.status as keyof typeof STATUS_LABELS] ||
          input.status;
        await sendEmail({
          to: app.email,
          subject: `Application ${app.applicationId} - Status Update`,
          body: `Dear ${app.fullName},\n\nYour application (${app.applicationId}) status has been updated to: ${statusLabel}\n\n${input.note ? `Note: ${input.note}\n\n` : ""}You can track your application status at any time using your application ID.\n\nBest regards,\nCodecret Team`,
        });
      } catch (e) {
        console.error("Failed to send status update email:", e);
      }

      return { success: true };
    }),

  updateNotes: adminProcedure
    .input(updateNotesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(application)
        .set({
          adminNotes: input.adminNotes,
          updatedAt: new Date(),
        })
        .where(eq(application.id, input.id));

      return { success: true };
    }),

  updateApplication: adminProcedure
    .input(updateApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(application)
        .where(eq(application.id, input.id))
        .limit(1);

      if (!existing) {
        throw new Error("Application not found");
      }

      await ctx.db
        .update(application)
        .set({
          fullName: input.fullName,
          email: input.email,
          projectType: input.projectType,
          budgetRange: input.budgetRange,
          timeline: input.timeline,
          description: input.description,
          updatedAt: new Date(),
        })
        .where(eq(application.id, input.id));

      return { success: true };
    }),

  create: adminProcedure
    .input(adminCreateSchema)
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
          status: input.status,
          adminNotes: input.adminNotes || null,
        })
        .returning();

      // Record initial status
      await ctx.db.insert(statusHistory).values({
        applicationUuid: inserted.id,
        fromStatus: null,
        toStatus: input.status,
        changedBy: ctx.session.user.id,
        note: "Created by admin",
      });

      // Send notification email to client
      try {
        const statusLabel =
          STATUS_LABELS[input.status as keyof typeof STATUS_LABELS] ||
          input.status;
        await sendEmail({
          to: input.email,
          subject: `Project Application Created - ${appId}`,
          body: `Dear ${input.fullName},\n\nA project application has been created on your behalf. Your application ID is: ${appId}\n\nCurrent Status: ${statusLabel}\nProject Type: ${input.projectType}\nBudget: ${input.budgetRange}\nTimeline: ${input.timeline}\n\nYou can track the status of your application at any time using this ID.\n\nBest regards,\nCodecret Team`,
        });
      } catch (e) {
        console.error("Failed to send notification email:", e);
      }

      return { applicationId: appId, id: inserted.id };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [app] = await ctx.db
        .select()
        .from(application)
        .where(eq(application.id, input.id))
        .limit(1);

      if (!app) {
        throw new Error("Application not found");
      }

      // Status history is cascade-deleted via FK
      await ctx.db
        .delete(application)
        .where(eq(application.id, input.id));

      return { success: true, applicationId: app.applicationId };
    }),

  sendEmail: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        subject: z.string().min(1, "Subject is required"),
        body: z.string().min(1, "Message is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [app] = await ctx.db
        .select()
        .from(application)
        .where(eq(application.id, input.id))
        .limit(1);

      if (!app) {
        throw new Error("Application not found");
      }

      await sendEmail({
        to: app.email,
        subject: input.subject,
        body: `Dear ${app.fullName},\n\n${input.body}\n\nBest regards,\nCodecret Team`,
      });

      return { success: true };
    }),

  export: adminProcedure.query(async ({ ctx }) => {
    const items = await ctx.db
      .select()
      .from(application)
      .orderBy(desc(application.createdAt));

    return items;
  }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const stats = await ctx.db
      .select({
        status: application.status,
        count: count(),
      })
      .from(application)
      .groupBy(application.status);

    const totalResult = await ctx.db
      .select({ count: count() })
      .from(application);

    return {
      total: totalResult[0].count,
      byStatus: Object.fromEntries(
        stats.map((s) => [s.status, s.count])
      ) as Record<string, number>,
    };
  }),
});
