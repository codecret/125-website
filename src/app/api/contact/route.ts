import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { data } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const emailBody = `
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Message: ${message}
`;

    await sendEmail({
      to: data.socialMedia.email,
      subject: "Contact Us Message",
      body: emailBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
