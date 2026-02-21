import { auth } from "../src/server/auth";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@codecret.com";
  const password = process.env.ADMIN_PASSWORD || "admin123456";
  const name = process.env.ADMIN_NAME || "Admin";

  console.log(`Creating admin user: ${email}`);

  try {
    // Create user via Better Auth's internal API
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result?.user) {
      console.error("Failed to create user — user may already exist.");
      process.exit(1);
    }

    // Set the admin role
    await auth.api.setRole({
      body: {
        userId: result.user.id,
        role: "admin",
      },
      headers: new Headers(),
    });

    console.log("Admin user created successfully!");
    console.log(`  Email: ${email}`);
    console.log(`  Name: ${name}`);
    console.log(`  Role: admin`);
  } catch (error: any) {
    if (error?.message?.includes("already") || error?.status === 422) {
      console.log("Admin user already exists. Skipping.");
    } else {
      console.error("Error creating admin user:", error);
      process.exit(1);
    }
  }

  process.exit(0);
}

seedAdmin();
