"use client";
import React, { useState, useEffect, useRef } from "react";
import { Pencil, Trash, Plus, Save, X, Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Navbar from "@/components/Navbar";

export default function Resume() {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState({});
  const componentRef = useRef();

  useEffect(() => {
    const profileData = localStorage.getItem("profiledata");
    if (profileData) {
      setData(JSON.parse(profileData));
    }
  }, []);

  // Print to PDF functionality

  const saveToLocalStorage = (newData) => {
    localStorage.setItem("profiledatas", JSON.stringify(newData));
    setData(newData);
  };

  const handleEdit = (section, index, field, value) => {
    const newData = { ...data };
    if (Array.isArray(newData[section])) {
      newData[section][index][field] = value;
    } else {
      newData[section] = value;
    }
    saveToLocalStorage(newData);
  };

  const handleDelete = (section, index) => {
    const newData = { ...data };
    newData[section].splice(index, 1);
    saveToLocalStorage(newData);
  };

  const addNew = (section, template) => {
    const newData = { ...data };
    newData[section] = [...(newData[section] || []), template];
    saveToLocalStorage(newData);
  };

  if (!data) return <div className="p-4 text-black">Loading...</div>;
  const handlePrint = () => {
    window.print(); // Triggers the browser's print dialog
  };
  return (
    <>
      {/* <Navbar></Navbar> */}
      <div className="min-h-screen ">
        {/* Header with controls */}
        <div className="shadow-md ">
          <div className="max-w-5xl mx-auto p-4 ">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-black">Resume Editor</h1>
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center mt-20 gap-2"
              >
                {/* <Download size={16} /> */}
                Download PDF
              </button>
            </div>
          </div>
        </div>
        {/* Printable Resume Content */}
        <div ref={componentRef} className="max-w-5xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {/* Personal Info Section */}
            <div className="mb-8 ">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() =>
                    setEditMode({ ...editMode, personal: !editMode.personal })
                  }
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Pencil size={16} />
                </button>
              </div>
              {editMode.personal ? (
                <div className="space-y-4">
                  <input
                    className="w-full p-2 border rounded text-black "
                    value={data.full_name}
                    onChange={(e) =>
                      handleEdit("full_name", null, null, e.target.value)
                    }
                    placeholder="Full Name"
                  />
                  <input
                    className="w-full p-2 border rounded text-black"
                    value={data.headline}
                    onChange={(e) =>
                      handleEdit("headline", null, null, e.target.value)
                    }
                    placeholder="Headline"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      className="p-2 border rounded text-black"
                      value={data.city}
                      onChange={(e) =>
                        handleEdit("city", null, null, e.target.value)
                      }
                      placeholder="City"
                    />
                    <input
                      className="p-2 border rounded text-black"
                      value={data.state}
                      onChange={(e) =>
                        handleEdit("state", null, null, e.target.value)
                      }
                      placeholder="State"
                    />
                    <input
                      className="p-2 border rounded text-black"
                      value={data.country_full_name}
                      onChange={(e) =>
                        handleEdit(
                          "country_full_name",
                          null,
                          null,
                          e.target.value
                        )
                      }
                      placeholder="Country"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-black">
                    {data.full_name}
                  </h3>
                  <p className="text-black">{data.headline}</p>
                  <p className="text-black">
                    {data.city}, {data.state}, {data.country_full_name}
                  </p>
                </div>
              )}
              <div class="border-t border-gray-500"></div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Education</h2>
                <button
                  onClick={() =>
                    addNew("education", {
                      school: "",
                      field_of_study: "",
                      starts_at: { year: new Date().getFullYear() },
                      ends_at: { year: new Date().getFullYear() + 4 },
                    })
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
              {data.education?.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  {editMode[`education-${index}`] ? (
                    <div className="space-y-4">
                      <input
                        className="w-full p-2 border rounded text-black"
                        value={edu.school}
                        onChange={(e) =>
                          handleEdit(
                            "education",
                            index,
                            "school",
                            e.target.value
                          )
                        }
                        placeholder="School"
                      />
                      <input
                        className="w-full p-2 border rounded text-black"
                        value={edu.field_of_study}
                        onChange={(e) =>
                          handleEdit(
                            "education",
                            index,
                            "field_of_study",
                            e.target.value
                          )
                        }
                        placeholder="Field of Study"
                      />
                      <div className="flex gap-4">
                        <input
                          type="number"
                          className="p-2 border rounded text-black"
                          value={edu.starts_at?.year}
                          onChange={(e) =>
                            handleEdit("education", index, "starts_at", {
                              year: e.target.value,
                            })
                          }
                          placeholder="Start Year"
                        />
                        <input
                          type="number"
                          className="p-2 border rounded text-black"
                          value={edu.ends_at?.year}
                          onChange={(e) =>
                            handleEdit("education", index, "ends_at", {
                              year: e.target.value,
                            })
                          }
                          placeholder="End Year"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-black">
                          {edu.school}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setEditMode({
                                ...editMode,
                                [`education-${index}`]: true,
                              })
                            }
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete("education", index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-black">{edu.field_of_study}</p>
                      <p className="text-black">
                        {edu.starts_at?.year} - {edu.ends_at?.year || "Present"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Experience Section */}

            {/* Skills Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Skills</h2>
                <button
                  onClick={() => addNew("skills", "")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills?.map((skill, index) => (
                  <div key={index} className="group relative">
                    {editMode[`skill-${index}`] ? (
                      <div className="flex gap-2">
                        <input
                          className="p-2 border rounded text-black"
                          value={skill}
                          onChange={(e) =>
                            handleEdit("skills", index, null, e.target.value)
                          }
                          onBlur={() =>
                            setEditMode({
                              ...editMode,
                              [`skill-${index}`]: false,
                            })
                          }
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="bg-blue-50 text-black px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{skill}</span>
                        <button
                          onClick={() =>
                            setEditMode({
                              ...editMode,
                              [`skill-${index}`]: true,
                            })
                          }
                          className="opacity-0 group-hover:opacity-100 text-blue-600"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete("skills", index)}
                          className="opacity-0 group-hover:opacity-100 text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Experience</h2>
                <button
                  onClick={() =>
                    addNew("experiences", {
                      title: "",
                      company: "",
                      starts_at: { month: 1, year: new Date().getFullYear() },
                      ends_at: null,
                    })
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
              {data.experiences?.map((exp, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  {editMode[`experience-${index}`] ? (
                    <div className="space-y-4">
                      <input
                        className="w-full p-2 border rounded text-black"
                        value={exp.title}
                        onChange={(e) =>
                          handleEdit(
                            "experiences",
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Title"
                      />
                      <input
                        className="w-full p-2 border rounded text-black"
                        value={exp.company}
                        onChange={(e) =>
                          handleEdit(
                            "experiences",
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="Company"
                      />
                      <div className="flex gap-4">
                        <input
                          type="number"
                          className="p-2 border rounded text-black"
                          value={exp.starts_at?.year}
                          onChange={(e) =>
                            handleEdit("experiences", index, "starts_at", {
                              ...exp.starts_at,
                              year: parseInt(e.target.value),
                            })
                          }
                          placeholder="Start Year"
                        />
                        <input
                          type="number"
                          className="p-2 border rounded text-black"
                          value={exp.starts_at?.month}
                          onChange={(e) =>
                            handleEdit("experiences", index, "starts_at", {
                              ...exp.starts_at,
                              month: parseInt(e.target.value),
                            })
                          }
                          placeholder="Start Month"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-black">
                          {exp.title}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setEditMode({
                                ...editMode,
                                [`experience-${index}`]: true,
                              })
                            }
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete("experiences", index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-black">{exp.company}</p>
                      <p className="text-black">
                        {exp.starts_at?.month}/{exp.starts_at?.year} -{" "}
                        {exp.ends_at
                          ? `${exp.ends_at.month}/${exp.ends_at.year}`
                          : "Present"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">
                  Professional Summary
                </h2>
                <button
                  onClick={() =>
                    setEditMode({ ...editMode, summary: !editMode.summary })
                  }
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Pencil size={16} />
                </button>
              </div>
              {editMode.summary ? (
                <textarea
                  className="w-full p-4 border rounded min-h-[200px] text-black"
                  value={data.summary}
                  onChange={(e) =>
                    handleEdit("summary", null, null, e.target.value)
                  }
                  placeholder="Write your professional summary..."
                />
              ) : (
                <p className="whitespace-pre-line text-black">{data.summary}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
