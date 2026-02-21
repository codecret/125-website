import { router, createCallerFactory } from "./init";
import { applicationRouter } from "./routers/application";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  application: applicationRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
