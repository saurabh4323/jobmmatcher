// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import * as pdfjsLib from "pdfjs-dist/esm/build/pdf";
// import pdfjsWorker from "pdfjs-dist/esm/build/pdf.worker.mjs";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// export default function PdfTextExtractor() {
//   const [text, setText] = useState("");
//   const [score, setScore] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fileName, setFileName] = useState("");

//   const getScoreColor = (score) => {
//     if (!score) return "text-gray-400";
//     const numScore = parseInt(score);
//     if (numScore >= 80) return "text-emerald-400";
//     if (numScore >= 60) return "text-amber-400";
//     return "text-rose-400";
//   };

//   const sending = async () => {
//     if (!text) return;

//     setLoading(true);
//     try {
//       const response = await axios.post("/api/gemini", {
//         prompt: `Give me in response just an ATS score of this resume. Do not write anything else other than the score. ${text}`,
//       });

//       const summarizedText =
//         response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "No score available";
//       setScore(summarizedText.trim());
//     } catch (error) {
//       console.error("Error calling API:", error);
//       setScore("Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const extractText = async (file) => {
//     if (!file) return;
//     setFileName(file.name);
//     setLoading(true);

//     const reader = new FileReader();
//     reader.readAsArrayBuffer(file);

//     reader.onload = async function () {
//       try {
//         const pdfData = new Uint8Array(reader.result);
//         const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

//         let extractedText = "";
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const textContent = await page.getTextContent();
//           extractedText +=
//             textContent.items.map((item) => item.str).join(" ") + "\n";
//         }

//         setText(extractedText);
//       } catch (error) {
//         console.error("Error extracting text from PDF:", error);
//         setText("Failed to extract text from the PDF.");
//       } finally {
//         setLoading(false);
//       }
//     };
//   };
//   return (
//     <div className="min-h-screen  text-gray-100" style={{ paddingTop: "10px" }}>
//       <div className="max-w-4xl mx-auto p-8  rounded-xl shadow-2xl border border-slate-800">
//         <div className="flex items-center mb-8">
//           <div className="w-12 h-12 bg-indigo-600 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
//             ATS Score
//           </h1>
//         </div>

//         {score !== null && (
//           <div className="mb-8 bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-lg">
//             <div className="text-center">
//               <h2 className="text-xl font-medium mb-6 text-slate-200">
//                 Your ATS Score
//               </h2>
//               <div className="flex justify-center items-center">
//                 <div className={`text-7xl font-bold ${getScoreColor(score)}`}>
//                   {score}
//                 </div>
//                 <div className="text-2xl ml-2 text-slate-400">/100</div>
//               </div>
//               {parseInt(score) >= 80 ? (
//                 <p className="mt-6 text-emerald-400 bg-emerald-950/30 p-3 rounded-lg inline-block">
//                   Excellent! Your resume is well-optimized for ATS systems.
//                 </p>
//               ) : parseInt(score) >= 60 ? (
//                 <p className="mt-6 text-amber-400 bg-amber-950/30 p-3 rounded-lg inline-block">
//                   Good start, but there's room for improvement.
//                 </p>
//               ) : (
//                 <p className="mt-6 text-rose-400 bg-rose-950/30 p-3 rounded-lg inline-block">
//                   Your resume needs significant optimization for ATS systems.
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="grid md:grid-cols-2 gap-8">
//           <div>
//             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6 shadow-lg">
//               <h2 className="text-xl font-medium mb-5 text-slate-200">
//                 Upload Your Resume
//               </h2>
//               <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-indigo-500 transition duration-300 bg-slate-850/50">
//                 {fileName ? (
//                   <div>
//                     <div className="text-indigo-400 mb-3">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-12 w-12 mx-auto"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                     </div>
//                     <p className="text-sm text-slate-300">{fileName}</p>
//                   </div>
//                 ) : (
//                   <div>
//                     <div className="text-slate-400 mb-3">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-12 w-12 mx-auto"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                         />
//                       </svg>
//                     </div>
//                     <p className="text-sm text-slate-400">
//                       Drag & drop your PDF or click to browse
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => extractText(e.target.files[0])}
//                   className="opacity-0 cursor-pointer"
//                   style={{
//                     position: "absolute",
//                     marginTop: "-100px",
//                     width: "100px",
//                     height: "100px",
//                   }}
//                 />
//               </div>
//             </div>

//             <button
//               onClick={sending}
//               disabled={loading || !text}
//               className={`w-full p-4 rounded-xl text-white font-medium transition duration-300 flex items-center justify-center shadow-lg
//                 ${!text || loading ? "bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"}`}
//             >
//               {loading ? (
//                 <svg
//                   className="animate-spin h-5 w-5 mr-3 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               ) : null}
//               {loading ? "Processing..." : "Get ATS Score"}
//             </button>
//           </div>

//           <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
//             <div className="p-4 bg-slate-850 border-b border-slate-700 flex items-center">
//               <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
//               <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
//               <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
//               <span className="text-sm text-slate-400 ml-1">Resume Text</span>
//             </div>
//             <textarea
//               className="w-full h-72 bg-slate-900 text-slate-300 p-5 focus:outline-none resize-none font-mono text-sm"
//               value={text}
//               readOnly
//               placeholder="Extracted text from your resume will appear here..."
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
