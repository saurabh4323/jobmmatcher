"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, CameraOff, Mic, MicOff, Play, RotateCcw, Send, SkipForward, Square, Timer } from "lucide-react";
import { askAI } from "@/lib/client";
import { Alert, Spinner } from "@/components/ui";

const SESSION_SECONDS = 10 * 60;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function MockInterview({ topic }) {

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  useEffect(() => {
    setSpeechSupported(typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window));
    return () => {
      stopListening();
      stopCamera();
    };
  }, [stopCamera, stopListening]);

  // Session countdown.
  useEffect(() => {
    if (!running) return undefined;
    if (secondsLeft <= 0) {
      setRunning(false);
      stopListening();
      return undefined;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, secondsLeft, stopListening]);

  const toggleCamera = async () => {
    if (cameraOn) return stopCamera();
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch {
      setCameraError("Camera access was blocked. You can still practice without video.");
    }
  };

  const toggleListening = () => {
    if (listening) return stopListening();
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    const base = answer ? `${answer.trim()} ` : "";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join("");
      setAnswer(base + transcript);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") setError(`Microphone: ${event.error}`);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const nextQuestion = async () => {
    setBusy("question");
    setError("");
    stopListening();
    try {
      const asked = history.map((item) => item.question).join(" | ");
      const text = await askAI(
        `Ask one realistic technical interview question about ${topic.name}. Vary difficulty. ` +
          (asked ? `Do not repeat any of these: ${asked}. ` : "") +
          "Reply with only the question.",
        "You are a senior engineer conducting a technical interview."
      );
      setQuestion(text || "Could not generate a question — try again.");
      setAnswer("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const start = async () => {
    setHistory([]);
    setSecondsLeft(SESSION_SECONDS);
    setRunning(true);
    await nextQuestion();
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !question) return;
    setBusy("feedback");
    setError("");
    stopListening();
    try {
      const feedback = await askAI(
        `Question: ${question}\n\nCandidate answer: ${answer}\n\n` +
          "Evaluate the answer. Start with a line 'Score: X/10'. Then give 2-3 short bullet points on strengths and gaps, and one line describing what an ideal answer includes. Keep it under 120 words.",
        "You are a fair, encouraging technical interviewer."
      );
      setHistory((items) => [{ question, answer, feedback }, ...items]);
      setAnswer("");
      setQuestion("");
      if (running) await nextQuestion();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const end = () => {
    setRunning(false);
    stopListening();
    setQuestion("");
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/interview" className="btn-link mb-2"><ArrowLeft size={14} /> All topics</Link>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Mock interview · <span className="neon-text">{topic.name}</span>
          </h1>
        </div>
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-display text-lg font-bold ${secondsLeft < 60 && running ? "border-danger/50 text-danger" : "border-slate-200 text-slate-900"}`}>
          <Timer size={18} className="text-brand" /> {fmt(secondsLeft)}
        </div>
      </div>

      <Alert className="mb-5">{error}</Alert>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Camera */}
        <section className="card overflow-hidden p-3">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full -scale-x-100 object-cover ${cameraOn ? "" : "hidden"}`} />
            {!cameraOn && (
              <div className="grid-bg absolute inset-0 grid place-items-center text-center">
                <div>
                  <CameraOff size={36} className="mx-auto text-slate-400" />
                  <p className="mt-3 text-sm text-slate-500">Camera is off</p>
                  <p className="mt-1 text-xs text-slate-400">Video stays on your device — nothing is recorded or uploaded.</p>
                </div>
              </div>
            )}
            {running && (
              <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-slate-900">
                <span className="h-2 w-2 animate-pulse rounded-full bg-danger" /> Live session
              </span>
            )}
          </div>
          {cameraError && <p className="px-2 pt-3 text-xs text-amber-700">{cameraError}</p>}
          <div className="flex flex-wrap items-center justify-center gap-2 p-3">
            <button type="button" onClick={toggleCamera} className="btn btn-ghost">
              {cameraOn ? <CameraOff size={16} /> : <Camera size={16} />} {cameraOn ? "Camera off" : "Camera on"}
            </button>
            {running ? (
              <button type="button" onClick={end} className="btn btn-danger"><Square size={16} /> End session</button>
            ) : (
              <button type="button" onClick={start} disabled={Boolean(busy)} className="btn btn-primary">
                {busy === "question" ? <Spinner className="!text-ink-950" /> : history.length ? <RotateCcw size={16} /> : <Play size={16} />}
                {history.length ? "New session" : "Start interview"}
              </button>
            )}
          </div>
        </section>

        {/* Q&A */}
        <section className="flex flex-col gap-4">
          <div className="neon-border card rounded-3xl p-6">
            <p className="kicker mb-3">Current question</p>
            {busy === "question" ? (
              <p className="flex items-center gap-2 text-sm text-slate-500"><Spinner /> Thinking of a question…</p>
            ) : question ? (
              <p className="text-lg leading-relaxed text-slate-900">{question}</p>
            ) : (
              <p className="text-sm text-slate-500">{running ? "Loading…" : "Press Start interview to get your first question."}</p>
            )}
          </div>

          <div className="card p-5">
            <label htmlFor="answer" className="label">Your answer</label>
            <textarea
              id="answer"
              rows={6}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={!question || busy === "feedback"}
              placeholder={speechSupported ? "Type, or press the mic and speak your answer…" : "Type your answer…"}
              className="input"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              {speechSupported ? (
                <button type="button" onClick={toggleListening} disabled={!question} className={`btn ${listening ? "btn-pink" : "btn-ghost"}`}>
                  {listening ? <MicOff size={16} /> : <Mic size={16} />} {listening ? "Stop dictation" : "Dictate"}
                </button>
              ) : (
                <span className="text-xs text-slate-500">Voice input isn&apos;t supported in this browser.</span>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={nextQuestion} disabled={!running || Boolean(busy)} className="btn btn-ghost">
                  <SkipForward size={16} /> Skip
                </button>
                <button type="button" onClick={submitAnswer} disabled={!answer.trim() || !question || Boolean(busy)} className="btn btn-primary">
                  {busy === "feedback" ? <Spinner className="!text-ink-950" /> : <Send size={16} />} Submit
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {history.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Session feedback</h2>
          <div className="space-y-4">
            {history.map((item, index) => (
              <article key={index} className="card p-5">
                <p className="text-sm font-semibold text-slate-900">Q{history.length - index}. {item.question}</p>
                <p className="mt-2 border-l-2 border-slate-200 pl-3 text-sm text-slate-500">{item.answer}</p>
                <div className="mt-4 whitespace-pre-line rounded-xl border border-brand/20 bg-brand/[0.05] p-4 text-sm leading-6 text-slate-700">{item.feedback}</div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
