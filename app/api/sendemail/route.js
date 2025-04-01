import { Resend } from "resend";

export async function POST(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log(resend);
  try {
    const { email } = await req.json();

    console.log(`Attempting to send email to: ${email}`);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Hello",
      text: "Hello plain text version",
      html: "<h1>Hello</h1>",
    });

    console.log("Resend API response:", response);

    return new Response(
      JSON.stringify({
        success: true,
        data: response,
      }),
      { status: 200 }
    );
  } catch (error) {
    // Enhanced error logging
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }),
      {
        status: 500,
      }
    );
  }
}
