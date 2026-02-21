import { auth } from "../src/server/auth";
import { db } from "../src/server/db";
import { user } from "../src/server/db/schema";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@codecret.com";
  const password = process.env.ADMIN_PASSWORD || "admin123456";
  const name = process.env.ADMIN_NAME || "Admin";

  console.log(`Setting up admin user: ${email}`);

  try {
    // Check if user already exists
    const [existing] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!existing) {
      // Create user via Better Auth's internal API
      const result = await auth.api.signUpEmail({
        body: { email, password, name },
        headers: new Headers(),
      });

      if (!result?.user) {
        console.error("Failed to create user.");
        process.exit(1);
      }
      console.log("User created.");
    } else {
      console.log("User already exists.");
    }

    // Set admin role directly in the database
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.email, email));

    console.log("Admin user ready!");
    console.log(`  Email: ${email}`);
    console.log(`  Role: admin`);
  } catch (error: any) {
    console.error("Error:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedAdmin();
