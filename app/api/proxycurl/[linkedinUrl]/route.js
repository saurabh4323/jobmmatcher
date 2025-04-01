import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { linkedinUrl } = params;

  console.log("Received LinkedIn URL:", linkedinUrl); // Debug log

  // Validate input
  if (!linkedinUrl) {
    console.log("No LinkedIn URL provided");
    return NextResponse.json(
      { error: "No LinkedIn URL provided" },
      { status: 400 }
    );
  }

  // Validate URL format
  const linkedinUrlRegex = /^(?:www\.)?linkedin\.com\/in\/[\w\-_%]+\/?$/;
  const cleanUrl = linkedinUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  console.log("Cleaned URL:", cleanUrl); // Debug log

  if (!linkedinUrlRegex.test(cleanUrl)) {
    console.log("Invalid URL format:", cleanUrl); // Debug log
    return NextResponse.json(
      { error: "Invalid LinkedIn profile URL format" },
      { status: 400 }
    );
  }

  try {
    // const api_endpoint = "https://nubela.co/proxycurl/api/v2/linkedin";
    // const api_key = "y9jD8371rfNTvGs8zogF8w";

    // Validate API key
    if (!api_key) {
      console.log("Missing API key");
      throw new Error("ProxyCurl API key is not configured");
    }

    const requestUrl = `${api_endpoint}?url=${encodeURIComponent(
      `https://${cleanUrl}`
    )}&skills=include`;

    console.log("Requesting URL:", requestUrl); // Debug log

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${api_key}`,
      },
    });

    console.log("ProxyCurl Response Status:", response.status); // Debug log

    // Handle different response status codes
    if (response.status === 401) {
      throw new Error("Invalid ProxyCurl API key");
    }

    if (response.status === 429) {
      throw new Error("ProxyCurl API rate limit exceeded");
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.log("ProxyCurl Error Response:", errorData); // Debug log
      throw new Error(`ProxyCurl API error (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    console.log("Successfully fetched data"); // Debug log
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // Detailed error logging
    console.error("ProxyCurl API Error:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    // Return appropriate error messages based on error type
    if (error.message.includes("API key")) {
      return NextResponse.json(
        {
          error: "API configuration error. Please contact support.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (error.message.includes("rate limit")) {
      return NextResponse.json(
        {
          error: "Service temporarily unavailable. Please try again later.",
          details: error.message,
        },
        { status: 429 }
      );
    }

    // More specific error response
    return NextResponse.json(
      {
        error: "Failed to fetch LinkedIn profile data",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
