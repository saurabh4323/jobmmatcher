"use client";
import React, { useState } from "react";
import { Palette, Layers, Grid, Columns, Layout } from "lucide-react";
import { useRouter } from "next/navigation";

const ResumeTemplateSelector = ({ onTemplateSelect }) => {
  const route = useRouter();
  const templates = [
    {
      id: "1",
      name: "Modern Minimal",
      icon: <Palette className="w-12 h-12 text-blue-600" />,
      description: "Clean, professional design with ample white space",
      color: "from-blue-100 to-blue-200",
    },
    {
      id: "2",
      name: "Creative Bold",
      icon: <Layers className="w-12 h-12 text-green-600" />,
      description: "Vibrant layout with striking visual elements",
      color: "from-green-100 to-green-200",
    },
    {
      id: "3",
      name: "Classic Elegant",
      icon: <Grid className="w-12 h-12 text-gray-600" />,
      description: "Traditional format with sophisticated typography",
      color: "from-gray-100 to-gray-200",
    },
    {
      id: "4",
      name: "Tech Forward",
      icon: <Columns className="w-12 h-12 text-purple-600" />,
      description: "Contemporary design for tech professionals",
      color: "from-purple-100 to-purple-200",
    },
    {
      id: "5",
      name: "Minimalist Grid",
      icon: <Layout className="w-12 h-12 text-indigo-600" />,
      description: "Structured layout with precise alignment",
      color: "from-indigo-100 to-indigo-200",
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    route.push(`/resume/${template.id}`);
    onTemplateSelect(template);
  };

  return (
    <div
      className="container mx-auto p-6"
      style={{ backgroundColor: "#1c1d31", height: "100vh" }}
    >
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ marginTop: "100px", color: "#fff" }}
      >
        Choose Your Resume Template
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`
              cursor-pointer 
              border-2 
              rounded-lg 
              p-6 
              text-center 
              transition-all 
              duration-300 
              hover:shadow-lg 
              bg-gradient-to-br 
              ${template.color}
              ${
                selectedTemplate === template.id
                  ? "border-blue-500 ring-4 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300"
              }
            `}
          >
            <div className="flex justify-center mb-4">{template.icon}</div>
            <h3
              style={{ color: "black" }}
              className="text-xl font-semibold mb-2"
            >
              {template.name}
            </h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;
