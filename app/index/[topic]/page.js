"use client";
import React, { useEffect, useRef, useState } from "react";
import { PlayCircle, StopCircle, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ModernAIInterview() {
  const [countdown, setCountdown] = useState(null);
  const countdownRef = useRef(null);

  const startTenMinuteTimer = () => {
    let timeLeft = 600; // 10 minutes in seconds
    setCountdown(timeLeft);

    countdownRef.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdownRef.current);
      }
    }, 1000);
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const { topic } = useParams();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [to, setto] = useState(topic);
  const recognitionRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionHistory, setQuestionHistory] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef(null);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();

    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setText(transcript);
    };
    recognition.onerror = (event) => console.error("Error:", event.error);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();

    setTimeout(() => {
      recognition.stop();
    }, 30000);
  };

  const fetchAIQuestion = async () => {
    try {
      const response = await axios.post("/api/gemini", {
        prompt: `give me a 1 question on topic ${to} for interview and just write the question not anything else just that question`,
      });

      let questionText = "";
      if (response.data.candidates && response.data.candidates.length > 0) {
        questionText =
          response.data.candidates[0].content?.parts?.[0]?.text ||
          response.data.candidates[0].text ||
          "Could not retrieve question";
      } else if (typeof response.data === "string") {
        questionText = response.data;
      } else {
        questionText = "Could not retrieve question";
      }

      questionText = questionText.trim();

      setCurrentQuestion(questionText);
      setQuestionHistory((prev) => [
        ...prev,
        { question: questionText, timestamp: new Date().toLocaleString() },
      ]);

      startListening();
    } catch (error) {
      console.error("Error fetching AI question:", error);
      setCurrentQuestion("Unable to fetch question. Please try again.");
    }
  };

  useEffect(() => {
    async function setupMediaRecording() {
      try {
        console.log("Requesting camera and mic access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Stream received:", stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const chunks = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          setVideoURL(URL.createObjectURL(blob));
        };
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    }

    setupMediaRecording();

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const startRecording = () => {
    fetchAIQuestion();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();

    setTimer(0);
    setText("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800"
      style={{ marginTop: "80px" }}
    >
      <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-3">
        {countdown !== null ? (
          <span>⏳ {formatCountdown(countdown)}</span>
        ) : (
          <button
            onClick={startTenMinuteTimer}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
          >
            Start 10-min Timer
          </button>
        )}
      </div>
      {/* LEFT PANEL */}
      <div className="w-3/5 p-6 border-r border-gray-700">
        <div className="relative h-full bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Timer Bubble */}
          {recording && (
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center bg-red-600/80 text-white px-3 py-1 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse" />
                {formatTime(timer)}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex space-x-4">
              {recording ? (
                <button
                  onClick={stopRecording}
                  className="bg-red-600 text-white px-6 py-3 rounded-full flex items-center hover:bg-red-700 transition-colors"
                >
                  <StopCircle className="mr-2" /> End Interview
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="bg-green-600 text-white px-6 py-3 rounded-full flex items-center hover:bg-green-700 transition-colors"
                >
                  <PlayCircle className="mr-2" /> Start Interview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* RIGHT PANEL */}
      <div className="w-2/5 p-6 overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 z-10 pb-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            AI Interview Companion
          </h2>

          <div className="bg-gray-800 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4 flex justify-between items-center">
            <p className="text-blue-300 font-medium text-lg">
              {currentQuestion}
            </p>
            <button
              onClick={fetchAIQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-700 transition-colors"
              disabled={!recording}
            >
              <ArrowRight className="mr-2" /> Next Question
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Your Response
            </h3>
            <p className="text-white">
              {text || "Your speech will appear here..."}
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-300">
            Interview History
          </h3>
          {questionHistory.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <p className="text-white font-medium">{item.question}</p>
              <p className="text-gray-400 text-sm">{item.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
