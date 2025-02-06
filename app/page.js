import JobPlatform from "@/components/Home";
import React from "react";
import Head from "next/head";
export default function page() {
  <Head>
    <title>JOb Matcher</title>
    <meta name="description" content="Build yoir resume and get insight." />
    <meta name="robots" content="index, follow" />
  </Head>;
  return (
    <div>
      <JobPlatform></JobPlatform>
    </div>
  );
}
