"use client";

import React, { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("ankitasingh6112002@gmail.com");
  const [responseDetails, setResponseDetails] = useState(null);

  async function send(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResponseDetails(null);

    try {
      const res = await fetch("/api/sendemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Email sent successfully!");
        setResponseDetails(data);
      } else {
        setMessage(`Failed to send email: ${data.error || "Unknown error"}`);
        setResponseDetails(data);
      }
    } catch (error) {
      setMessage(`Error sending email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: "150px",
        width: "50%",
        margin: "150px auto",
        padding: "20px",
      }}
    >
      <h1>Email Sender</h1>
      <form
        style={{
          backgroundColor: "#f74",
          padding: "20px",
          borderRadius: "8px",
        }}
        onSubmit={send}
      >
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "green",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: message.includes("successfully")
              ? "#d4edda"
              : "#f8d7da",
            color: message.includes("successfully") ? "#155724" : "#721c24",
            borderRadius: "4px",
          }}
        >
          <p>{message}</p>
        </div>
      )}

      {responseDetails && (
        <div style={{ marginTop: "20px" }}>
          <h3>Response Details:</h3>
          <pre
            style={{
              background: "#f8f",
              padding: "10px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(responseDetails, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
