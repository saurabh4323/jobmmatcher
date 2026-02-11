"use client";
import React, { useState } from "react";
import axios from "axios";
import { 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Database,
  Terminal,
  BarChart3
} from "lucide-react";
import Navbar from "@/components/Navbar";

const FastAPIDemo = () => {
    const [status, setStatus] = useState("idle");
    const [result, setResult] = useState(null);
    const [features, setFeatures] = useState([0.8, 5.0, 0.9, 3.0]); // Default values

    const trainModel = async () => {
        setStatus("training");
        try {
            const res = await axios.post("/api/ml/train");
            setResult({ type: "success", message: res.data.message });
        } catch (err) {
            setResult({ type: "error", message: err.response?.data?.error || "Failed to connect to FastAPI" });
        } finally {
            setStatus("idle");
        }
    };

    const getPrediction = async () => {
        setStatus("predicting");
        try {
            const res = await axios.post("/api/ml/predict", { features });
            setResult({ type: "prediction", data: res.data });
        } catch (err) {
            setResult({ type: "error", message: err.response?.data?.error || "Failed to connect to FastAPI" });
        } finally {
            setStatus("idle");
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <Navbar />
            <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold mb-4 uppercase tracking-widest border border-blue-500/20">
                        <Cpu className="h-3 w-3" /> External Python Service
                    </div>
                    <h1 className="text-4xl font-bold mb-4">FastAPI + Scikit-Learn</h1>
                    <p className="text-gray-400">
                        This demo connects your Next.js frontend to a dedicated Python microservice via FastAPI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                                <Database className="h-5 w-5 mr-2 text-blue-500" /> Model Control
                            </h3>
                            <button 
                                onClick={trainModel}
                                disabled={status !== "idle"}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                {status === "training" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                Train Scikit-Learn Model
                            </button>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-green-500" /> Run Prediction
                            </h3>
                            <div className="space-y-4 mb-6">
                                {["Skill Score", "Years Exp", "Performance", "Education"].map((label, idx) => (
                                    <div key={label}>
                                        <label className="text-xs text-gray-500 block mb-1">{label}</label>
                                        <input 
                                            type="number" 
                                            value={features[idx]}
                                            onChange={(e) => {
                                                const newF = [...features];
                                                newF[idx] = parseFloat(e.target.value);
                                                setFeatures(newF);
                                            }}
                                            className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={getPrediction}
                                disabled={status !== "idle"}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                {status === "predicting" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}
                                Predict Outcome
                            </button>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="bg-black/40 border border-gray-800 rounded-xl p-6 flex flex-col">
                        <h3 className="text-sm font-mono text-gray-500 mb-4 uppercase tracking-widest border-b border-gray-800 pb-2">FastAPI Response</h3>
                        <div className="flex-1 overflow-auto">
                            {!result && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-700 italic text-sm">
                                    Waiting for server action...
                                </div>
                            )}

                            {result?.type === "success" && (
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    <p className="text-blue-400 text-sm font-medium">{result.message}</p>
                                </div>
                            )}

                            {result?.type === "error" && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-red-400 text-sm font-bold">Connection Error</p>
                                        <p className="text-gray-500 text-xs mt-1">{result.message}</p>
                                        <div className="mt-4 p-2 bg-black/50 rounded text-[10px] font-mono whitespace-pre-wrap">
                                            Tip: Open python_backend folder and run:<br/>
                                            pip install -r requirements.txt<br/>
                                            python main.py
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result?.type === "prediction" && (
                                <div className="space-y-6">
                                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                        <div className="text-xs text-green-500/60 uppercase font-bold mb-2">Class Prediction</div>
                                        <div className="text-5xl font-black text-green-500 mb-2">{result.data.prediction}</div>
                                        <div className="text-sm text-gray-400">Confidence: {(result.data.confidence * 100).toFixed(1)}%</div>
                                    </div>
                                    
                                    <div>
                                        <div className="text-xs text-gray-500 mb-3 font-mono">Input Vector:</div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {features.map((f, i) => (
                                                <div key={i} className="bg-gray-900 border border-gray-800 p-2 rounded text-center">
                                                    <div className="text-[10px] text-gray-600 truncate">{result.data.features_used[i]}</div>
                                                    <div className="text-blue-400 font-bold">{f}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FastAPIDemo;
