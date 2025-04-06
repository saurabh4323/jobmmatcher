"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Interview() {
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [show, setshow] = useState(false);
  const router = useRouter();

  const topics = [
    {
      topic: "Arrays and Strings",
      link: "https://youtu.be/B2KusJcbVIg?si=AEpzL1_-dOKE_eVC",
      doscs: "https://www.geeksforgeeks.org/array-data-structure/",
    },
    {
      topic: "Linked Lists",
      link: "https://youtu.be/Hj_rA0dhr2I?si=GK0_fS3OGpYtWzp5",
      docs: "https://www.w3schools.com/dsa/dsa_theory_linkedlists.php",
    },
    {
      topic: "Stacks and Queues",
      link: "https://youtu.be/wjI1WNcIntg?si=4peeD52-aU__2e-6",
      docs: "https://www.w3schools.com/dsa/dsa_data_stacks.php",
    },
    {
      topic: "Bit Manipulation",
      link: "https://youtu.be/NLKQEOgBAnw?si=7KYZ_2h2FPuCBLcw",
      docs: "https://www.geeksforgeeks.org/bits-manipulation-important-tactics/",
    },
    {
      topic: "Heap and Priority Queue",
      link: "https://youtu.be/HqPJF2L5h9U?si=EcnK_PHCzjWzpQKO",
      docs: "https://www.geeksforgeeks.org/heap-data-structure/                    heap",
    },
    {
      topic: "Segment Trees",
      link: "https://youtu.be/ZBHKZF5w4YU?si=5m6THsH7x9BQpwbD",
      docs: "https://www.geeksforgeeks.org/segment-tree-data-structure/",
    },
    {
      topic: "JavaScript",
      link: "https://youtu.be/jS4aFq5-91M?si=AKeBgEZJE3y_FnTU",
      docs: "https://www.w3schools.com/js/default.asp",
    },
    {
      topic: "TypeScript",
      link: "https://youtu.be/BCg4U1FzODs?si=AE3EZhCfRa2yLIg2",
      docs: "https://www.geeksforgeeks.org/typescript/",
    },
    {
      topic: "Python",
      link: "https://youtu.be/rfscVS0vtbw?si=pSFkYkd_MxPSNZ4Z",
      docs: "https://www.w3schools.com/python/default.asp",
    },
    {
      topic: "C++",
      link: "https://youtu.be/vLnPwxZdW4Y?si=TxhZAg-KJpR0Gyw7",
      docs: "https://www.w3schools.com/cpp/default.asp",
    },
    {
      topic: "Java",
      link: "https://youtu.be/eIrMbAQSU34?si=uvV_F7VYLsDXKPGn",
      docs: "https://www.w3schools.com/java/default.asp",
    },
    {
      topic: "Go",
      link: "https://youtu.be/YS4e4q9oBaU?si=q1GBZrw4y9Z1RGO2",
      docs: "https://www.geeksforgeeks.org/go/",
    },
    {
      topic: "Rust",
      link: "https://youtu.be/5C_HPTJg5ek?si=wt9jN2_rMlpDWz9S",
      docs: "https://www.geeksforgeeks.org/rust-a-case-of-safe-concurrency/",
    },
    {
      topic: "PHP",
      link: "https://youtu.be/OK_JCtrrv-c?si=QYUT_4zTEA29Zm3E",
      docs: "https://www.w3schools.com/php/",
    },
    {
      topic: "React",
      link: "https://youtu.be/t_ispmWmdjY?si=w7wuJ7FpTULi9U0p",
      docs: "https://www.w3schools.com/react/default.asp",
    },
    {
      topic: "C#",
      link: "https://youtu.be/GhQdlIFylQ8?si=5PpZV4zWg4OICEoP",
      docs: "https://www.w3schools.com/C/#/default.asp",
    },
  ];
  return (
    <div className="min">
      <div className="min-h-screen bg-black text-white">
        {/* Header with particle effect background */}
        <div className="relative overflow-hidden py-12 px-6">
          <div className="absolute inset-0 z-0 opacity-20">
            {/* This would be replaced with actual particle animation in production */}
            <div className="absolute h-32 w-32 rounded-full bg-blue-500 blur-3xl -top-10 -left-10"></div>
            <div className="absolute h-40 w-40 rounded-full bg-purple-500 blur-3xl top-20 right-20"></div>
            <div className="absolute h-24 w-24 rounded-full bg-pink-500 blur-3xl bottom-4 left-1/3"></div>
          </div>

          <div
            className="relative z-10 max-w-6xl mx-auto"
            style={{ marginTop: "70px" }}
          >
            <h1 className="text-4xl font-bold tracking-tight">
              Tech Interview
              <span className="ml-2 relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                  Prep
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-indigo-500"></span>
              </span>
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          {/* Topic Selection Cards */}

          {/* Topic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {topics.map((topicItem, index) => (
              <div
                key={index}
                onClick={() => setSelectedTopic(index)}
                className={`group cursor-pointer perspective-500`}
              >
                <div
                  className={`
                relative rounded-xl overflow-hidden transform transition-all duration-300
                ${
                  selectedTopic === index
                    ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20"
                    : ""
                }
                group-hover:shadow-md group-hover:-translate-y-1
              `}
                >
                  {/* Color overlay + gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-900 z-10"></div>

                  {/* Background effects */}
                  <div
                    className={`absolute inset-0 bg-gray-800 ${
                      selectedTopic === index ? "opacity-30" : "opacity-100"
                    }`}
                  >
                    {/* Abstract pattern per card - simplified here */}
                    <div className="opacity-10">
                      <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-blue-400 blur-xl"></div>
                      <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-purple-400 blur-xl"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-20 p-5">
                    <div className="h-14 flex items-center justify-between">
                      <span className="font-medium">{topicItem.topic}</span>

                      {/* Icon that appears on hover/selection */}
                      <span
                        className={`transform transition-transform ${
                          selectedTopic === index
                            ? "translate-x-0 opacity-100"
                            : "translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>

                    {/* Progress indicator */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Topic Details Panel */}
          {selectedTopic !== null && (
            <div className="mt-12 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-2 mb-8">
                  <div className="h-10 w-1 bg-blue-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold">
                    {topics[selectedTopic].topic}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Start Learning</h3>
                    <div className="space-y-3">
                      <button
                        className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors group"
                        onClick={() => {
                          setshow(true);
                        }}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">Video Tutorials</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <button
                        className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors group"
                        onClick={() => {
                          window.open(
                            (window.location.href = `${topics[selectedTopic].docs}`)
                          );
                        }}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-indigo-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                          </div>
                          <span className="font-medium">Reading Materials</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      window.location.href = `/index/${topics[selectedTopic].topic}`;
                    }}
                  >
                    <h3 className="text-lg font-medium mb-4">Practice</h3>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <div className="text-center" onClick={() => {}}>
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium mb-2">
                          Start Practice Session
                        </h4>
                        <p className="text-gray-400 text-sm mb-6">
                          Test your knowledge with interactive challenges
                        </p>
                        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-medium hover:opacity-90 transition-opacity">
                          Begin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* iframe using  */}
      {show ? (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-lg max-w-2xl w-full">
            {/* Close button */}
            <button
              onClick={() => setshow(false)}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Video container */}
            <div className="relative aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={
                  topics[selectedTopic].link
                    .replace("youtu.be/", "youtube.com/embed/")
                    .replace("?si=", "?") + "&autoplay=1&mute=1"
                }
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>

            {/* Open in YouTube button */}
          </div>
        </div>
      ) : (
        <div className="nn"></div>
      )}
    </div>
  );
}
