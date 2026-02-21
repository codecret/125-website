import { createCaller } from "@/server/trpc/router";
import { createTRPCContext } from "@/server/trpc/init";

export async function getServerCaller() {
  const context = await createTRPCContext();
  return createCaller(context);
}
