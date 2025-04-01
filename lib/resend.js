"use server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
// import { NextResponse } from "next/server";

export const sendEmail = async () => {
  await resend.emails.send({
    to: "e23cseu0248@bennett.edu.in",
    from: "saurabhiitr01@gmail.com",

    subject: "hello",
    html: "<h1>hello</h1>",
  });
  console.log("Email sent successfully!");
};
