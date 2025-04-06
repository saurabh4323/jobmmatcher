"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import {
  Camera,
  Code,
  CheckCircle,
  Play,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Clock,
  FileText,
  Send,
  Save,
} from "lucide-react";

const OnlineInterviewCompiler = () => {
  // Camera and recording states
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Code editor states
  const [data, setData] = useState({
    code: "",
    language: "python3",
  });
  const [output, setOutput] = useState("");
  const [executionStatus, setExecutionStatus] = useState(null); // null, "running", "success", "error"

  // Interview states
  const [interviewMode, setInterviewMode] = useState("code"); // "code", "theory", "behavioral"
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("");

  // Timer states
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes by default
  const [isRunning, setIsRunning] = useState(false);

  // AI interaction
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Enhanced coding questions
  const questions = {
    code: [
      {
        question:
          "Design a function that validates if a string is a valid email address (following the standard format: username@domain.extension).",
        difficulty: "medium",
        time: 180,
        output: "true",
        testCases: [
          { input: "test@example.com", expected: "true" },
          { input: "invalid-email", expected: "false" },
        ],
        hints: [
          "Consider using regular expressions",
          "Check for the presence of @ and domain extension",
        ],
      },
      {
        question:
          "Implement a function to find all pairs in an array that sum to a specific target value. For array [1, 4, 6, 8, 9, 2] and target 10, return all valid pairs.",
        difficulty: "medium",
        time: 210,
        output: "[[1,9],[4,6],[8,2]]",
        hints: [
          "Try using a hash map to improve efficiency",
          "Consider edge cases like duplicates",
        ],
      },
      {
        question:
          "Create a function that determines if a binary tree is balanced. A balanced tree is defined as a tree where the height of the two subtrees of any node never differs by more than one.",
        difficulty: "hard",
        time: 300,
        output: "depends on implementation",
        hints: [
          "Consider a recursive approach",
          "Track height while checking balance",
        ],
      },
      {
        question:
          "Implement a caching mechanism using the LRU (Least Recently Used) algorithm with a fixed capacity. It should support get and put operations in O(1) time.",
        difficulty: "hard",
        time: 360,
        output: "depends on implementation",
        hints: [
          "Consider using a combination of hash map and doubly linked list",
          "Track both access order and quick lookups",
        ],
      },
      {
        question:
          "Write a function to detect and resolve a deadlock situation in a simplified resource allocation system with multiple processes competing for resources.",
        difficulty: "expert",
        time: 420,
        output: "depends on implementation",
        hints: [
          "Consider implementing a resource allocation graph",
          "Look into cycle detection algorithms",
        ],
      },
    ],
    theory: [
      {
        question:
          "Explain the differences between REST and GraphQL APIs, highlighting the advantages and disadvantages of each approach.",
        difficulty: "medium",
        time: 180,
        keywords: [
          "over-fetching",
          "under-fetching",
          "endpoints",
          "schema",
          "query language",
        ],
      },
      {
        question:
          "Describe the concepts of horizontal and vertical scaling in distributed systems. When would you choose one over the other?",
        difficulty: "medium",
        time: 210,
        keywords: [
          "load balancing",
          "sharding",
          "replication",
          "resource utilization",
          "elasticity",
        ],
      },
      {
        question:
          "Explain the CAP theorem and its implications for distributed database design.",
        difficulty: "hard",
        time: 240,
        keywords: [
          "consistency",
          "availability",
          "partition tolerance",
          "trade-offs",
          "eventual consistency",
        ],
      },
    ],
    behavioral: [
      {
        question:
          "Describe a challenging project you worked on and how you overcame obstacles to deliver it successfully.",
        difficulty: "medium",
        time: 180,
        keywords: [
          "problem-solving",
          "teamwork",
          "communication",
          "resilience",
        ],
      },
      {
        question:
          "Give an example of a time when you had to make a difficult technical decision with incomplete information. How did you approach it?",
        difficulty: "medium",
        time: 210,
        keywords: [
          "decision-making",
          "risk assessment",
          "trade-offs",
          "communication",
        ],
      },
    ],
  };

  // Get current question based on mode
  const currentQuestion =
    questions[interviewMode][currentQuestionIndex] || questions.code[0];

  // Start/stop camera functions
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      if (isRecording) stopRecording();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: isAudioOn,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions.");
      }
    }
  };

  const toggleAudio = async () => {
    if (isAudioOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getAudioTracks();
        tracks.forEach((track) => (track.enabled = false));
      }
      setIsAudioOn(false);
    } else {
      if (isCameraOn && videoRef.current && videoRef.current.srcObject) {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const currentStream = videoRef.current.srcObject;
          const videoTracks = currentStream.getVideoTracks();
          const audioTracks = newStream.getAudioTracks();

          // Create a new stream with both video and audio
          const combinedStream = new MediaStream([
            ...videoTracks,
            ...audioTracks,
          ]);
          videoRef.current.srcObject = combinedStream;
          setIsAudioOn(true);
        } catch (err) {
          console.error("Error accessing microphone:", err);
          alert("Could not access microphone. Please check permissions.");
        }
      } else {
        // If camera is off, just toggle the state for when camera is turned on
        setIsAudioOn(true);
      }
    }
  };

  // Recording functions
  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    recordedChunksRef.current = [];
    const stream = videoRef.current.srcObject;
    const options = { mimeType: "video/webm; codecs=vp9" };

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = saveRecording;

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Error starting recording:", e);
      alert("Could not start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveRecording = () => {
    if (!recordedChunksRef.current.length) return;

    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = `interview-recording-${new Date().toISOString()}.webm`;
    a.click();

    URL.revokeObjectURL(url);
    window.setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  };

  // Timer functions
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentQuestion.time || 300);
  };

  // Format time in MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Navigation functions
  const nextQuestion = () => {
    const maxIndex = questions[interviewMode].length - 1;
    setCurrentQuestionIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
    resetData();
  };

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    resetData();
  };

  const resetData = () => {
    setData({ ...data, code: "" });
    setOutput("");
    setExecutionStatus(null);
    setFeedback("");
    setTimeLeft(
      questions[interviewMode][
        Math.min(currentQuestionIndex + 1, questions[interviewMode].length - 1)
      ].time || 300
    );
    stopTimer();
  };

  // Code execution function
  const executeCode = async () => {
    try {
      setExecutionStatus("running");

      const response = await axios.post("/api/code", data);

      setOutput(response.data.output || "No output");

      // Check if output matches expected output for code questions
      if (interviewMode === "code" && currentQuestion.output) {
        const expectedOutput = currentQuestion.output.trim();
        const actualOutput = response.data.output.trim();

        if (actualOutput === expectedOutput) {
          setFeedback("Correct! Great job!");
          setExecutionStatus("success");
        } else {
          setFeedback("Output doesn't match expected result. Try again!");
          setExecutionStatus("error");
        }
      } else {
        setExecutionStatus("success");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(error.message || "Error executing code");
      setExecutionStatus("error");
    }
  };

  // Handle AI analysis of code or response
  const getAIAnalysis = async () => {
    try {
      setIsAnalyzing(true);

      const prompt =
        interviewMode === "code"
          ? `Analyze this code and provide feedback: ${data.code}\nThe question was: ${currentQuestion.question}`
          : `Analyze this response: ${notes}\nThe question was: ${currentQuestion.question}`;

      const response = await axios.post("/api/gemini", {
        prompt: prompt,
      });

      const analysis =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No analysis available";
      setAiAnalysis(analysis.trim());
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      setAiAnalysis("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle code input changes
  const handleCodeChange = (e) => {
    if (!isRunning) setIsRunning(true);
    setData({ ...data, code: e.target.value });
  };

  // Handle language selection
  const handleLanguageChange = (e) => {
    setData({ ...data, language: e.target.value });
  };

  // Handle notes input changes
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  // Handle mode changes
  const changeMode = (mode) => {
    setInterviewMode(mode);
    setCurrentQuestionIndex(0);
    resetData();
  };

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      if (interviewMode === "code") {
        executeCode();
      } else {
        setFeedback("Time's up! Let's review your answer.");
      }
      stopTimer();
    }
  }, [timeLeft]);

  // Set initial time when question changes
  useEffect(() => {
    setTimeLeft(currentQuestion.time || 300);
  }, [currentQuestion, currentQuestionIndex, interviewMode]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Online Coding Interview
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => changeMode("code")}
              className={`px-4 py-2 rounded-md ${interviewMode === "code" ? "bg-indigo-600 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <Code className="inline mr-2 h-4 w-4" />
              Coding
            </button>
            <button
              onClick={() => changeMode("theory")}
              className={`px-4 py-2 rounded-md ${interviewMode === "theory" ? "bg-indigo-600 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <FileText className="inline mr-2 h-4 w-4" />
              Theory
            </button>
            <button
              onClick={() => changeMode("behavioral")}
              className={`px-4 py-2 rounded-md ${interviewMode === "behavioral" ? "bg-indigo-600 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              <Clock className="inline mr-2 h-4 w-4" />
              Behavioral
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Panel: Video and Controls */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
            <div className="text-lg font-medium mb-4 flex justify-between items-center">
              <span>Candidate Video</span>
              <div className="flex gap-2">
                <button
                  onClick={toggleCamera}
                  className={`p-2 rounded-full ${isCameraOn ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-500"}`}
                  title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {isCameraOn ? (
                    <Video className="h-5 w-5" />
                  ) : (
                    <VideoOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-full ${isAudioOn ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-500"}`}
                  title={isAudioOn ? "Mute Microphone" : "Unmute Microphone"}
                  disabled={!isCameraOn}
                >
                  {isAudioOn ? (
                    <Mic className="h-5 w-5" />
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-full ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-500"}`}
                  title={isRecording ? "Stop Recording" : "Start Recording"}
                  disabled={!isCameraOn}
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-grow bg-black rounded-lg relative overflow-hidden flex items-center justify-center min-h-64">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <Camera className="mx-auto h-16 w-16 text-gray-600 mb-2" />
                  <p>Camera is turned off</p>
                  <button
                    onClick={toggleCamera}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  >
                    Turn On Camera
                  </button>
                </div>
              )}
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center bg-red-600 text-white px-2 py-1 rounded-md text-sm">
                  <span className="animate-pulse mr-1">●</span> Recording
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Timer</h3>
                  <span
                    className={`text-xl font-bold ${timeLeft < 30 ? "text-red-500" : "text-white"}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={startTimer}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-md"
                    disabled={isRunning}
                  >
                    Start
                  </button>
                  <button
                    onClick={stopTimer}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-md"
                    disabled={!isRunning}
                  >
                    Pause
                  </button>
                  <button
                    onClick={resetTimer}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-md"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Panel: Question and Code Editor */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 flex flex-col">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium">
                Question ({currentQuestionIndex + 1}/
                {questions[interviewMode].length})
              </h2>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    currentQuestion.difficulty === "easy"
                      ? "bg-green-600"
                      : currentQuestion.difficulty === "medium"
                        ? "bg-yellow-600"
                        : currentQuestion.difficulty === "hard"
                          ? "bg-orange-600"
                          : "bg-red-600"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <p>{currentQuestion.question}</p>

              {currentQuestion.testCases && (
                <div className="mt-2 text-gray-400 text-sm">
                  <p className="font-medium mb-1">Test Cases:</p>
                  <ul className="list-disc pl-5">
                    {currentQuestion.testCases.map((testCase, index) => (
                      <li key={index}>
                        Input: {testCase.input}, Expected: {testCase.expected}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                <button
                  onClick={prevQuestion}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center"
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </button>
                <button
                  onClick={nextQuestion}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center"
                  disabled={
                    currentQuestionIndex === questions[interviewMode].length - 1
                  }
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              {interviewMode === "code" && (
                <select
                  value={data.language}
                  onChange={handleLanguageChange}
                  className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                >
                  <option value="python3">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="c++">C++</option>
                </select>
              )}
            </div>

            {interviewMode === "code" ? (
              <div className="flex-grow flex flex-col">
                <textarea
                  value={data.code}
                  onChange={handleCodeChange}
                  placeholder="Write your code here..."
                  className="flex-grow bg-gray-900 text-gray-100 font-mono p-4 rounded-lg resize-none border border-gray-700 mb-4 focus:border-indigo-500 focus:outline-none"
                  onClick={() => !isRunning && startTimer()}
                />

                <div className="flex justify-between items-center">
                  <button
                    onClick={executeCode}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center"
                  >
                    <Play className="h-4 w-4 mr-2" /> Run Code
                  </button>

                  <button
                    onClick={getAIAnalysis}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
                    disabled={!data.code || isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Get AI Feedback"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col">
                <textarea
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Type your answer here..."
                  className="flex-grow bg-gray-900 text-gray-100 p-4 rounded-lg resize-none border border-gray-700 mb-4 focus:border-indigo-500 focus:outline-none"
                  onClick={() => !isRunning && startTimer()}
                />

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setFeedback("Answer submitted for review.")}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" /> Submit Answer
                  </button>

                  <button
                    onClick={getAIAnalysis}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
                    disabled={!notes || isAnalyzing}
                  >
                    {isAnalyzing ? "Analyzing..." : "Get AI Feedback"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results and Feedback Panel */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Output Panel */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Output</h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 min-h-32">
              {executionStatus === "running" ? (
                <div className="flex items-center text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running code...
                </div>
              ) : output ? (
                <pre className="font-mono whitespace-pre-wrap text-gray-300">
                  {output}
                </pre>
              ) : (
                <p className="text-gray-500">Run your code to see output</p>
              )}

              {feedback && (
                <div
                  className={`mt-4 p-3 rounded-md ${
                    feedback.includes("Correct") ||
                    feedback.includes("submitted")
                      ? "bg-green-800/30 border border-green-700"
                      : "bg-red-800/30 border border-red-700"
                  }`}
                >
                  <div className="flex items-start">
                    {feedback.includes("Correct") ||
                    feedback.includes("submitted") ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    )}
                    <p>{feedback}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 min-h-32">
              {isAnalyzing ? (
                <div className="flex items-center text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing your solution...
                </div>
              ) : aiAnalysis ? (
                <div className="text-gray-300 whitespace-pre-line">
                  {aiAnalysis}
                </div>
              ) : (
                <p className="text-gray-500">
                  Request AI feedback to get analysis of your solution
                </p>
              )}
            </div>

            {currentQuestion.hints && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Hints:
                </h4>
                <ul className="list-disc pl-5 text-sm text-gray-400">
                  {currentQuestion.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineInterviewCompiler;
