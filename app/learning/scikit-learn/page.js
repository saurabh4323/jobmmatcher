"use client";
import React, { useState } from "react";
import axios from "axios";
import { 
  Brain, 
  BookOpen, 
  Code, 
  LineChart, 
  Settings, 
  PlayCircle,
  ChevronRight,
  ExternalLink,
  Cpu,
  Loader2,
  Terminal,
  CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";

const ScikitLearnPage = () => {
  const [code, setCode] = useState(`import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

# 1. Create a synthetic dataset
X, y = make_classification(n_samples=100, n_features=4, random_state=42)

# 2. Initialize and train the model
model = LogisticRegression()
model.fit(X, y)

# 3. Make a prediction
new_data = np.array([[0.5, -0.2, 0.1, 0.8]])
prediction = model.predict(new_data)

print(f"Model trained successfully!")
print(f"Prediction for input {new_data[0]}: {prediction[0]}")
print(f"Model coefficients: {model.coef_[0]}")`);

  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const runCode = async () => {
    setIsLoading(true);
    setOutput("");
    setIsSuccess(false);
    try {
      const response = await axios.post("/api/code", {
        code: code,
        language: "python3"
      });
      setOutput(response.data.output);
      setIsSuccess(true);
    } catch (error) {
      setOutput(error.response?.data?.error || "Error executing code. Make sure scikit-learn is available in the environment.");
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    {
      title: "Introduction to Scikit-Learn",
      icon: BookOpen,
      content: "Scikit-learn is a free software machine learning library for the Python programming language. It features various classification, regression and clustering algorithms including support vector machines, random forests, gradient boosting, k-means and DBSCAN.",
      color: "blue"
    },
    {
      title: "Core Concepts",
      icon: Brain,
      content: "Learn about the Estimator API, Transformers, and Predictors. Understand the 'fit-transform-predict' workflow that makes scikit-learn so powerful and consistent.",
      color: "purple"
    },
    {
      title: "Getting Started with Code",
      icon: Code,
      content: "import sklearn\nfrom sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier()\nclf.fit(X_train, y_train)\npredictions = clf.predict(X_test)",
      isCode: true,
      color: "green"
    },
    {
      title: "Model Evaluation",
      icon: LineChart,
      content: "Use metrics like Accuracy, Precision, Recall, and F1-score to evaluate your models. Learn about cross-validation and over-fitting.",
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Cpu className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold">Scikit-Learn Mastery Path</h1>
          </div>
          <p className="text-xl text-gray-400">
            Everything you need to go from a beginner to building production-ready machine learning models.
          </p>
        </div>

        {/* Learning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-all group">
              <div className={`p-3 rounded-lg bg-${section.color}-600/10 w-fit mb-6`}>
                <section.icon className={`h-6 w-6 text-${section.color}-500`} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
              {section.isCode ? (
                <pre className="bg-black/50 p-4 rounded-lg font-mono text-sm text-blue-400 border border-gray-800 overflow-x-auto">
                  {section.content}
                </pre>
              ) : (
                <p className="text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              )}
              <button className="mt-6 flex items-center text-blue-500 hover:text-blue-400 transition-colors">
                <span>View Details</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Interactive Lab Section */}
        <div id="lab" className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="border-b border-gray-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/50">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Terminal className="h-6 w-6 mr-2 text-green-500" />
                Interactive Scikit-Learn Lab
              </h2>
              <p className="text-gray-400 text-sm">Write Python code and run it on our AI backend.</p>
            </div>
            <button 
              onClick={runCode}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-bold transition-all transform active:scale-95 shadow-lg shadow-green-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5" />
                  <span>Run Python Code</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px]">
            {/* Editor Area */}
            <div className="border-r border-gray-800 flex flex-col">
              <div className="bg-gray-800/50 px-4 py-2 text-xs font-mono text-gray-400 flex justify-between items-center">
                <span>main.py</span>
                <span className="text-green-500 font-bold">PYTHON 3.x</span>
              </div>
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full bg-black/40 p-6 font-mono text-sm text-emerald-400 focus:outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>

            {/* Output Area */}
            <div className="bg-black/60 flex flex-col">
              <div className="bg-gray-800/50 px-4 py-2 text-xs font-mono text-gray-400">
                Console Output
              </div>
              <div className="flex-1 p-6 font-mono text-sm overflow-auto">
                {output ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center text-gray-500 mb-4 pb-2 border-b border-gray-800">
                      <span className="mr-2">Status:</span>
                      <span className={isSuccess ? "text-green-500" : "text-red-500"}>
                        {isSuccess ? "Success" : "Error"}
                      </span>
                    </div>
                    <pre className={isSuccess ? "text-white whitespace-pre-wrap" : "text-red-400 whitespace-pre-wrap"}>
                      {output}
                    </pre>
                    {isSuccess && (
                      <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-400 font-bold text-sm">Challenge Completed!</p>
                          <p className="text-gray-400 text-xs mt-1">You've successfully trained a Logistic Regression model using Scikit-Learn.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50 italic">
                    <Terminal className="h-12 w-12 mb-4" />
                    <p>Click "Run Python Code" to see the results here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* External Resources */}
        <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-800/50 p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Deepen Your Knowledge</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Scikit-learn is vast. Explore the official documentation to master complex pipelines and feature engineering.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://scikit-learn.org/stable/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Official Documentation</span>
            </a>
            <a 
              href="/learning/scikit-learn/fastapi-demo" 
              className="px-8 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all"
            >
              <Cpu className="h-5 w-5" />
              <span>Advanced FastAPI Demo</span>
            </a>
          </div>
        </div>
      </main>

      {/* Tailwind color mapping for dynamic classes */}
      <div className="hidden bg-blue-600/10 text-blue-500 bg-purple-600/10 text-purple-500 bg-green-600/10 text-green-500 bg-orange-600/10 text-orange-500"></div>
    </div>
  );
};

export default ScikitLearnPage;
