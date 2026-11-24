"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, BookOpen, Brain, CheckCircle2, Code2, Cpu, ExternalLink, LineChart, Play, Terminal } from "lucide-react";
import { api } from "@/lib/client";
import { Spinner } from "@/components/ui";

const STARTER = `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

# 1. Create a synthetic dataset
X, y = make_classification(n_samples=100, n_features=4, random_state=42)

# 2. Train the model
model = LogisticRegression()
model.fit(X, y)

# 3. Predict on new data
sample = np.array([[0.5, -0.2, 0.1, 0.8]])
print("Prediction:", model.predict(sample)[0])
print("Accuracy on training data:", round(model.score(X, y), 3))
`;

const LESSONS = [
  {
    icon: BookOpen,
    title: "What scikit-learn is",
    body: "A Python library for classical machine learning: classification, regression, clustering, and preprocessing, all behind one consistent API.",
  },
  {
    icon: Brain,
    title: "Estimators & the fit/predict workflow",
    body: "Every model is an estimator. You call fit(X, y) to learn from data and predict(X) to use it. Transformers add transform() for preprocessing.",
  },
  {
    icon: Code2,
    title: "A first model",
    code: "from sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier()\nclf.fit(X_train, y_train)\npreds = clf.predict(X_test)",
  },
  {
    icon: LineChart,
    title: "Evaluating models",
    body: "Measure with accuracy, precision, recall, and F1. Use train/test splits and cross-validation to catch over-fitting before it reaches production.",
  },
];

export default function ScikitLearnPage() {
  const [code, setCode] = useState(STARTER);
  const [result, setResult] = useState({ status: "", text: "" });

  const run = async () => {
    setResult({ status: "running", text: "" });
    try {
      const data = await api("/api/code", { method: "POST", body: { code, language: "python3" } });
      const failed = /Traceback|Error/.test(data.output || "");
      setResult({ status: failed ? "error" : "success", text: data.output || "(no output)" });
    } catch (err) {
      setResult({ status: "error", text: err.message });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <Link href="/learning" className="btn-link mb-4"><ArrowLeft size={14} /> Learning</Link>
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-brand/30 bg-brand/10 text-brand shadow-soft"><Cpu size={26} /></span>
          <div>
            <p className="kicker mb-1">Course · Machine learning</p>
            <h1 className="text-3xl font-bold tracking-tight">Scikit-learn fundamentals</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {LESSONS.map(({ icon: Icon, title, body, code: snippet }, index) => (
          <article key={title} className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-info"><Icon size={18} /></span>
              <span className="font-display text-xs font-bold text-slate-400">0{index + 1}</span>
            </div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {snippet ? (
              <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-ink-950/80 p-4 font-mono text-xs leading-6 text-blue-700">{snippet}</pre>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
            )}
          </article>
        ))}
      </div>

      <section id="lab" className="neon-border card overflow-hidden rounded-3xl">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold"><Terminal size={20} className="text-success" /> Interactive lab</h2>
            <p className="mt-1 text-sm text-slate-500">Edit the Python below and run it on the remote code runner.</p>
          </div>
          <button type="button" onClick={run} disabled={result.status === "running"} className="btn btn-primary">
            {result.status === "running" ? <Spinner className="!text-ink-950" /> : <Play size={16} />} Run Python
          </button>
        </div>
        <div className="grid lg:grid-cols-2">
          <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            <div className="flex justify-between px-4 py-2 font-mono text-xs text-slate-500"><span>main.py</span><span className="text-success">Python 3</span></div>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              rows={18}
              aria-label="Python code"
              className="block w-full resize-y bg-ink-950/80 p-5 font-mono text-[13px] leading-6 text-blue-700 outline-none"
            />
          </div>
          <div className="flex flex-col bg-ink-950/50">
            <div className="px-4 py-2 font-mono text-xs text-slate-500">Console</div>
            <div className="flex-1 p-5 font-mono text-[13px]">
              {result.status === "running" ? (
                <span className="flex items-center gap-2 text-slate-500"><Spinner size={14} /> Executing…</span>
              ) : result.text ? (
                <>
                  <pre className={`whitespace-pre-wrap ${result.status === "error" ? "text-red-700" : "text-emerald-700"}`}>{result.text}</pre>
                  {result.status === "success" && (
                    <p className="mt-6 flex items-start gap-2 rounded-xl border border-success/30 bg-success/10 p-3 font-sans text-sm text-emerald-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> Ran successfully. Try changing the model or the sample input.
                    </p>
                  )}
                  {result.status === "error" && /No module named/.test(result.text) && (
                    <p className="mt-6 font-sans text-xs text-slate-500">The remote runner may not have scikit-learn installed. Run this locally with <code>pip install scikit-learn</code>.</p>
                  )}
                </>
              ) : (
                <span className="text-slate-400">Press Run Python to see the output.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <a href="https://scikit-learn.org/stable/user_guide.html" target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><ExternalLink size={16} /> Official user guide</a>
        <Link href="/learning/scikit-learn/fastapi-demo" className="btn btn-ghost"><Cpu size={16} /> Next: serve it with FastAPI</Link>
      </div>
    </div>
  );
}
