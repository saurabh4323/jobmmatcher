"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ArrowLeft, BarChart3, CheckCircle2, Database, Play, Server, Terminal } from "lucide-react";
import { api } from "@/lib/client";
import { Spinner } from "@/components/ui";

const FEATURES = ["Skill score", "Years of experience", "Interview performance", "Education level"];

export default function FastAPIDemoPage() {
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const [features, setFeatures] = useState(["0.8", "5", "0.9", "3"]);

  const call = async (kind) => {
    setStatus(kind);
    try {
      if (kind === "train") {
        const data = await api("/api/ml/train", { method: "POST" });
        setResult({ type: "success", message: data.message });
      } else {
        const values = features.map(Number);
        if (values.some((value) => !Number.isFinite(value))) throw new Error("Every feature needs a numeric value.");
        const data = await api("/api/ml/predict", { method: "POST", body: { features: values } });
        setResult({ type: "prediction", data, values });
      }
    } catch (err) {
      setResult({ type: "error", message: err.message, offline: err.status === 503 });
    } finally {
      setStatus("");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/learning/scikit-learn" className="btn-link mb-4"><ArrowLeft size={14} /> Scikit-learn course</Link>
        <p className="kicker mb-2">Course · MLOps</p>
        <h1 className="text-3xl font-bold tracking-tight">Serve a model with FastAPI</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          This page talks to the Python microservice in <code className="text-brand">python_backend/</code> through the Next.js API, the same way a production app calls a model server.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <section className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold"><Database size={18} className="text-brand" /> Model</h2>
            <button type="button" onClick={() => call("train")} disabled={Boolean(status)} className="btn btn-primary w-full">
              {status === "train" ? <Spinner className="!text-ink-950" /> : <Play size={16} />} Train model
            </button>
          </section>
          <section className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold"><BarChart3 size={18} className="text-accent" /> Predict</h2>
            <div className="space-y-3">
              {FEATURES.map((label, index) => (
                <div key={label}>
                  <label htmlFor={`f-${index}`} className="label">{label}</label>
                  <input
                    id={`f-${index}`}
                    type="number"
                    step="any"
                    value={features[index]}
                    onChange={(event) => setFeatures((current) => current.map((value, i) => (i === index ? event.target.value : value)))}
                    className="input"
                  />
                </div>
              ))}
            </div>
            <button type="button" onClick={() => call("predict")} disabled={Boolean(status)} className="btn btn-pink mt-5 w-full">
              {status === "predict" ? <Spinner className="!text-ink-950" /> : <Terminal size={16} />} Predict outcome
            </button>
          </section>
        </div>

        <section className="neon-border card flex flex-col rounded-3xl p-6">
          <h2 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-500"><Server size={14} /> Service response</h2>
          {!result && <p className="m-auto text-sm text-slate-400">Train the model or run a prediction.</p>}
          {result?.type === "success" && (
            <p className="flex items-start gap-2 rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm text-blue-700"><CheckCircle2 size={16} className="mt-0.5 shrink-0" /> {result.message}</p>
          )}
          {result?.type === "error" && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-red-700">
              <p className="flex items-center gap-2 font-semibold"><AlertCircle size={16} /> {result.offline ? "Service offline" : "Request failed"}</p>
              <p className="mt-1 text-xs text-red-600">{result.message}</p>
              {result.offline && (
                <pre className="mt-3 rounded-lg bg-black/40 p-3 font-mono text-[11px] text-slate-600">cd python_backend{"\n"}pip install -r requirements.txt{"\n"}python main.py</pre>
              )}
            </div>
          )}
          {result?.type === "prediction" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Predicted class</p>
                <p className="neon-text mt-2 font-display text-5xl font-extrabold">{result.data.prediction}</p>
                <p className="mt-2 text-sm text-slate-500">Confidence {(result.data.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {result.values.map((value, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-ink-950/60 p-3 text-center">
                    <p className="truncate text-[10px] text-slate-500">{result.data.features_used?.[index] || FEATURES[index]}</p>
                    <p className="font-semibold text-brand">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
