"use client";
import React from "react";
import { 
  BookOpen, 
  Brain, 
  Cpu, 
  Database, 
  Layout, 
  Code, 
  CheckCircle,
  TrendingUp,
  Search
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const LearningHub = () => {
  const courses = [
    {
      id: "scikit-learn",
      title: "Scikit-Learn Fundamentals",
      category: "Machine Learning",
      icon: Cpu,
      level: "Intermediate",
      duration: "4 hours",
      description: "Master the most popular ML library for Python. Learn classification, regression, and model evaluation.",
      progress: 0,
      color: "blue"
    },
    {
      id: "react-basics",
      title: "React Modern Patterns",
      category: "Frontend Development",
      icon: Layout,
      level: "Beginner",
      duration: "6 hours",
      description: "Build dynamic user interfaces with Hooks, Context API, and modern React best practices.",
      progress: 0,
      color: "purple"
    },
    {
      id: "python-automation",
      title: "Python for Automation",
      category: "Scripting",
      icon: Code,
      level: "Beginner",
      duration: "3 hours",
      description: "Automate repetitive tasks and streamline your workflow using Python's extensive standard library.",
      progress: 100,
      color: "green"
    },
    {
      id: "sql-mastery",
      title: "Advanced SQL & Database Design",
      category: "Data Engineering",
      icon: Database,
      level: "Hard",
      duration: "5 hours",
      description: "Complex queries, indexing strategies, and database schema design for performance.",
      progress: 45,
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Learning Hub</h1>
            <p className="text-gray-400">Expand your skillset with personalized technical courses.</p>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 w-full md:w-64 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12">
          {["All Courses", "Machine Learning", "Frontend", "Backend", "Data Science", "DevOps"].map((cat) => (
            <button key={cat} className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <Link key={course.id} href={`/learning/${course.id}`} className="group h-full">
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden h-full flex flex-col hover:border-blue-500/30 transition-all transform hover:-translate-y-1 shadow-lg shadow-black/20">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg bg-${course.color}-600/10`}>
                      <course.icon className={`h-6 w-6 text-${course.color}-500`} />
                    </div>
                    {course.progress === 100 && (
                      <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                        <CheckCircle className="h-3 w-3 mr-1" /> COMPLETED
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">{course.category}</div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4">
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" /> {course.level}
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" /> {course.duration}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {course.progress > 0 && course.progress < 100 && (
                  <div className="w-full bg-gray-800 h-1 mt-auto">
                    <div className="bg-blue-600 h-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="h-20 w-20 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
            <Brain className="h-10 w-10 text-blue-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">AI-Powered Curriculum</h2>
            <p className="text-gray-400 max-w-2xl">Based on your LinkedIn profile and skills analysis, we recommend starting with <span className="text-blue-400 font-bold">Scikit-Learn Fundamentals</span> to boost your Machine Learning score.</p>
          </div>
          <Link href="/learning/scikit-learn" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20 flex-shrink-0">
            Start Personalized Path
          </Link>
        </div>
      </main>

      {/* Tailwind color mapping for dynamic classes */}
      <div className="hidden bg-blue-600/10 text-blue-500 bg-purple-600/10 text-purple-500 bg-green-600/10 text-green-500 bg-orange-600/10 text-orange-500"></div>
    </div>
  );
};

export default LearningHub;
