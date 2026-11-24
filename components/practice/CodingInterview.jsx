"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  Circle,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Timer,
} from "lucide-react";
import { api, askAI } from "@/lib/client";
import { LANGUAGES, PRACTICE_MODES, QUESTIONS } from "@/lib/practiceQuestions";
import { Spinner } from "@/components/ui";

const DIFFICULTY = {
  easy: "border-success/40 bg-success/10 text-emerald-700",
  medium: "border-warning/40 bg-warning/10 text-amber-700",
  hard: "border-danger/40 bg-danger/10 text-red-700",
};
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function CodingInterview({ title = "Coding practice", subtitle }) {
  const [mode, setMode] = useState("code");
  const [index, setIndex] = useState(0);
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(LANGUAGES[0].starter);
  const [notes, setNotes] = useState("");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState({ status: "", text: "" });
  const [analysis, setAnalysis] = useState({ loading: false, text: "", error: "" });
  const [showHints, setShowHints] = useState(false);

  const list = QUESTIONS[mode];
  const question = list[index] || list[0];
  const [timeLeft, setTimeLeft] = useState(question.time);
  const [timerOn, setTimerOn] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [cameraOn, setCameraOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaError, setMediaError] = useState("");

  const resetFor = useCallback((nextMode, nextIndex) => {
    const nextQuestion = QUESTIONS[nextMode][nextIndex];
    setTimeLeft(nextQuestion.time);
    setTimerOn(false);
    setOutput({ status: "", text: "" });
    setAnalysis({ loading: false, text: "", error: "" });
    setShowHints(false);
    setNotes("");
  }, []);

  const goTo = (nextIndex) => {
    setIndex(nextIndex);
    resetFor(mode, nextIndex);
  };
  const changeMode = (nextMode) => {
    setMode(nextMode);
    setIndex(0);
    resetFor(nextMode, 0);
  };
  const changeLanguage = (id) => {
    const current = LANGUAGES.find((item) => item.id === language);
    // Swap the starter only if the user hasn't written anything yet.
    if (!code.trim() || code === current?.starter) setCode(LANGUAGES.find((item) => item.id === id).starter);
    setLanguage(id);
  };

  // Timer
  useEffect(() => {
    if (!timerOn || timeLeft <= 0) {
      if (timeLeft <= 0) setTimerOn(false);
      return undefined;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timerOn, timeLeft]);

  // Camera cleanup
  useEffect(
    () => () => {
      recorderRef.current?.state === "recording" && recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    []
  );

  const toggleCamera = async () => {
    setMediaError("");
    if (cameraOn) {
      if (recording) stopRecording();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch {
      setMediaError("Camera or microphone access was blocked.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    try {
      chunksRef.current = [];
      const recorder = new MediaRecorder(streamRef.current);
      recorder.ondataavailable = (event) => event.data.size && chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `interview-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.webm`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setMediaError("Recording isn't supported in this browser.");
    }
  };
  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const run = async () => {
    setOutput({ status: "running", text: "" });
    try {
      const data = await api("/api/code", { method: "POST", body: { code, language, stdin } });
      const meta = [data.cpuTime && `${data.cpuTime}s CPU`, data.memory && `${data.memory} KB`].filter(Boolean).join(" · ");
      setOutput({ status: "done", text: data.output || "(no output)", meta });
    } catch (err) {
      setOutput({ status: "error", text: err.message });
    }
  };

  const review = async () => {
    setAnalysis({ loading: true, text: "", error: "" });
    try {
      const prompt =
        mode === "code"
          ? `Interview question: ${question.question}\n\nCandidate's ${LANGUAGES.find((l) => l.id === language)?.label} solution:\n${code}\n\n` +
            (output.text ? `Program output: ${output.text}\n\n` : "") +
            "Review it like an interviewer: correctness (with any failing edge cases), time/space complexity, code quality, and one concrete improvement. Start with 'Verdict:' and a one-line summary. Be concise."
          : `Interview question: ${question.question}\n\nCandidate's answer:\n${notes}\n\nGive a score out of 10, two strengths, two gaps, and what an excellent answer would cover. Be concise.`;
      const text = await askAI(prompt, "You are a senior engineer giving candid, constructive interview feedback.");
      setAnalysis({ loading: false, text, error: "" });
    } catch (err) {
      setAnalysis({ loading: false, text: "", error: err.message });
    }
  };

  const startTimerOnInput = () => !timerOn && timeLeft === question.time && setTimerOn(true);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="kicker mb-3">Practice room</p>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-ink-900/70 p-1">
          {PRACTICE_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => changeMode(item.id)}
              aria-pressed={mode === item.id}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                mode === item.id ? "bg-brand/10 text-slate-900 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.4)]" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        {/* Left column: camera + timer */}
        <div className="space-y-5">
          <section className="card p-3">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full -scale-x-100 object-cover ${cameraOn ? "" : "hidden"}`} />
              {!cameraOn && (
                <div className="grid-bg absolute inset-0 grid place-items-center">
                  <CameraOff size={28} className="text-slate-400" />
                </div>
              )}
              {recording && (
                <span className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-danger px-2 py-0.5 text-[11px] font-bold text-slate-900">
                  <Circle size={8} className="animate-pulse fill-current" /> REC
                </span>
              )}
            </div>
            {mediaError && <p className="px-1 pt-2 text-xs text-amber-700">{mediaError}</p>}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={toggleCamera} className="btn btn-ghost btn-sm">
                {cameraOn ? <CameraOff size={14} /> : <Camera size={14} />} {cameraOn ? "Stop camera" : "Camera"}
              </button>
              <button type="button" onClick={recording ? stopRecording : startRecording} disabled={!cameraOn} className={`btn btn-sm ${recording ? "btn-danger" : "btn-ghost"}`}>
                <Circle size={12} className={recording ? "fill-current" : ""} /> {recording ? "Stop & save" : "Record"}
              </button>
            </div>
          </section>

          <section className="card p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Timer size={16} className="text-brand" /> Timer</span>
              <span className={`font-display text-2xl font-bold ${timeLeft < 30 ? "text-danger" : "text-slate-900"}`}>{fmt(timeLeft)}</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(timeLeft / question.time) * 100}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setTimerOn((on) => !on)} disabled={timeLeft <= 0} className="btn btn-ghost btn-sm">
                {timerOn ? <Pause size={14} /> : <Play size={14} />} {timerOn ? "Pause" : "Start"}
              </button>
              <button type="button" onClick={() => { setTimerOn(false); setTimeLeft(question.time); }} className="btn btn-ghost btn-sm">
                <RotateCcw size={14} /> Reset
              </button>
            </div>
            {timeLeft <= 0 && <p className="mt-3 text-xs text-danger">Time&apos;s up — wrap up and request a review.</p>}
          </section>
        </div>

        {/* Right column: question + editor */}
        <div className="space-y-5">
          <section className="neon-border card rounded-3xl p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Question {index + 1} of {list.length}</span>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${DIFFICULTY[question.difficulty]}`}>{question.difficulty}</span>
                <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className="btn btn-ghost btn-sm" aria-label="Previous question"><ChevronLeft size={14} /></button>
                <button type="button" onClick={() => goTo(index + 1)} disabled={index === list.length - 1} className="btn btn-ghost btn-sm" aria-label="Next question"><ChevronRight size={14} /></button>
              </div>
            </div>
            <p className="text-base leading-7 text-slate-900">{question.question}</p>
            {question.examples && (
              <ul className="mt-3 space-y-1 font-mono text-xs text-slate-500">
                {question.examples.map((example) => <li key={example}>{example}</li>)}
              </ul>
            )}
            <button type="button" onClick={() => setShowHints((value) => !value)} className="btn-link mt-4 !text-xs">
              <Lightbulb size={13} /> {showHints ? "Hide hints" : "Show hints"}
            </button>
            {showHints && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-500">
                {question.hints.map((hint) => <li key={hint}>{hint}</li>)}
              </ul>
            )}
          </section>

          {mode === "code" ? (
            <section className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                  <span className="ml-2 font-mono text-xs text-slate-500">solution</span>
                </div>
                <select value={language} onChange={(event) => changeLanguage(event.target.value)} className="input !w-auto !py-1.5 text-xs" aria-label="Language">
                  {LANGUAGES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </div>
              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                onFocus={startTimerOnInput}
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    event.preventDefault();
                    const { selectionStart: start, selectionEnd: end } = event.currentTarget;
                    const next = `${code.slice(0, start)}    ${code.slice(end)}`;
                    setCode(next);
                    requestAnimationFrame(() => event.target.setSelectionRange(start + 4, start + 4));
                  }
                }}
                spellCheck={false}
                rows={16}
                aria-label="Code editor"
                className="block w-full resize-y bg-ink-950/80 p-4 font-mono text-[13px] leading-6 text-blue-700 outline-none"
              />
              <div className="border-t border-slate-200 p-3">
                <details className="mb-3">
                  <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">Program input (stdin)</summary>
                  <textarea value={stdin} onChange={(event) => setStdin(event.target.value)} rows={2} className="input mt-2 font-mono text-xs" />
                </details>
                <div className="flex flex-wrap justify-end gap-2">
                  <button type="button" onClick={review} disabled={!code.trim() || analysis.loading} className="btn btn-ghost">
                    {analysis.loading ? <Spinner /> : <Sparkles size={16} className="text-accent" />} AI review
                  </button>
                  <button type="button" onClick={run} disabled={!code.trim() || output.status === "running"} className="btn btn-primary">
                    {output.status === "running" ? <Spinner className="!text-ink-950" /> : <Play size={16} />} Run code
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="card p-5">
              <label htmlFor="notes" className="label">Your answer</label>
              <textarea id="notes" rows={10} value={notes} onChange={(event) => setNotes(event.target.value)} onFocus={startTimerOnInput} className="input" placeholder="Structure your answer as you would say it out loud…" />
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={review} disabled={!notes.trim() || analysis.loading} className="btn btn-primary">
                  {analysis.loading ? <Spinner className="!text-ink-950" /> : <Sparkles size={16} />} Get feedback
                </button>
              </div>
            </section>
          )}

          <div className={`grid gap-5 ${mode === "code" ? "lg:grid-cols-2" : ""}`}>
            {mode === "code" && (
              <section className="card p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Terminal size={15} className="text-brand" /> Output</h3>
                <div className="min-h-[7rem] rounded-xl border border-slate-200 bg-ink-950/80 p-4 font-mono text-xs">
                  {output.status === "running" ? (
                    <span className="flex items-center gap-2 text-slate-500"><Spinner size={14} /> Running…</span>
                  ) : output.text ? (
                    <>
                      <pre className={`whitespace-pre-wrap ${output.status === "error" ? "text-red-700" : "text-emerald-700"}`}>{output.text}</pre>
                      {output.meta && <p className="mt-3 text-slate-400">{output.meta}</p>}
                    </>
                  ) : (
                    <span className="text-slate-400">Run your code to see output here.</span>
                  )}
                </div>
              </section>
            )}
            <section className="card p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles size={15} className="text-accent" /> AI feedback</h3>
              <div className="min-h-[7rem] whitespace-pre-line rounded-xl border border-slate-200 bg-ink-950/80 p-4 text-sm leading-6 text-slate-600">
                {analysis.loading ? (
                  <span className="flex items-center gap-2 text-slate-500"><Spinner size={14} /> Reviewing…</span>
                ) : analysis.error ? (
                  <span className="text-red-700">{analysis.error}</span>
                ) : (
                  analysis.text || <span className="text-slate-400">Request a review when you&apos;re ready.</span>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
