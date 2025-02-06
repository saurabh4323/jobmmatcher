// app/api/proxycurl/[linkedinUrl]/route.js
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { linkedinUrl } = params;

  if (!linkedinUrl) {
    return NextResponse.json(
      { error: "No LinkedIn URL provided" },
      { status: 400 }
    );
  }

  try {
    const api_endpoint = "https://nubela.co/proxycurl/api/v2/linkedin";
    const api_key = "zwgixWRwh_Yla3W8P-d62w";

    // Remove any remaining 'https://' or 'http://' if present
    const cleanUrl = linkedinUrl.replace(/^https?:\/\//, "");

    const response = await fetch(
      `${api_endpoint}?url=${encodeURIComponent(
        `https://${cleanUrl}`
      )}&skills=include`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${api_key}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from Proxycurl: ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
