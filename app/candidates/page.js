"use client";
import React, { useState } from "react";
import {
  Phone,
  Mail,
  User,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

export default function CandidatePage() {
  // Sample candidate data
  const [candidates, setCandidates] = useState([
    {
      id: "USR78429",
      email: "candidate78429@example.com",
      phone: "+1 (555) 123-4567",
      marks: {
        codingTest: 85,
        technicalInterview: 78,
        behavioralInterview: 92,
      },
      status: "Shortlisted",
      profileImage: "/api/placeholder/100/100",
    },
    {
      id: "USR54321",
      email: "candidate54321@example.com",
      phone: "+1 (555) 987-6543",
      marks: {
        codingTest: 92,
        technicalInterview: 88,
        behavioralInterview: 85,
      },
      status: "Selected",
      profileImage: "/api/placeholder/100/100",
    },
    {
      id: "USR92654",
      email: "candidate92654@example.com",
      phone: "+1 (555) 234-5678",
      marks: {
        codingTest: 68,
        technicalInterview: 72,
        behavioralInterview: 80,
      },
      status: "Under Review",
      profileImage: "/api/placeholder/100/100",
    },
    {
      id: "USR36587",
      email: "candidate36587@example.com",
      phone: "+1 (555) 345-6789",
      marks: {
        codingTest: 75,
        technicalInterview: 82,
        behavioralInterview: 78,
      },
      status: "Shortlisted",
      profileImage: "/api/placeholder/100/100",
    },
    {
      id: "USR15980",
      email: "candidate15980@example.com",
      phone: "+1 (555) 456-7890",
      marks: {
        codingTest: 60,
        technicalInterview: 65,
        behavioralInterview: 70,
      },
      status: "Rejected",
      profileImage: "/api/placeholder/100/100",
    },
  ]);

  // State for search and sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(
      (candidate) =>
        candidate.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let compareA, compareB;

      if (
        sortField === "id" ||
        sortField === "email" ||
        sortField === "status"
      ) {
        compareA = a[sortField].toLowerCase();
        compareB = b[sortField].toLowerCase();
      } else if (sortField === "totalMarks") {
        compareA = Object.values(a.marks).reduce((sum, mark) => sum + mark, 0);
        compareB = Object.values(b.marks).reduce((sum, mark) => sum + mark, 0);
      } else {
        compareA = a.marks[sortField];
        compareB = b.marks[sortField];
      }

      if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  // Calculate total marks and percentage
  const calculateTotal = (marks) => {
    const total = Object.values(marks).reduce((sum, mark) => sum + mark, 0);
    const percentage = Math.round(
      (total / (Object.keys(marks).length * 100)) * 100
    );
    return { total, percentage };
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-800";
      case "Shortlisted":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle contact button click
  const handleContactClick = (candidate) => {
    setSelectedCandidate(candidate);
    setContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Candidate Results</h1>

        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by user ID or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Sort by:
              </span>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={sortField}
                onChange={(e) => {
                  setSortField(e.target.value);
                  setSortDirection("asc");
                }}
              >
                <option value="id">User ID</option>
                <option value="totalMarks">Total Marks</option>
                <option value="codingTest">Coding Marks</option>
                <option value="technicalInterview">Technical Marks</option>
                <option value="behavioralInterview">Behavioral Marks</option>
                <option value="status">Status</option>
              </select>

              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {sortDirection === "asc" ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Candidates list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Coding Test
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Technical
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Behavioral
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => {
                  const { total, percentage } = calculateTotal(candidate.marks);
                  return (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={candidate.profileImage}
                              alt="Candidate"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {candidate.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {candidate.marks.codingTest}/100
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${candidate.marks.codingTest >= 70 ? "bg-green-500" : "bg-yellow-500"}`}
                            style={{ width: `${candidate.marks.codingTest}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {candidate.marks.technicalInterview}/100
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${candidate.marks.technicalInterview >= 70 ? "bg-green-500" : "bg-yellow-500"}`}
                            style={{
                              width: `${candidate.marks.technicalInterview}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {candidate.marks.behavioralInterview}/100
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${candidate.marks.behavioralInterview >= 70 ? "bg-green-500" : "bg-yellow-500"}`}
                            style={{
                              width: `${candidate.marks.behavioralInterview}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {total}/{Object.keys(candidate.marks).length * 100}
                        </div>
                        <div className="text-sm text-gray-500">
                          {percentage}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidate.status)}`}
                        >
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleContactClick(candidate)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm"
                        >
                          Contact
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredCandidates.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No candidates found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Modal */}
        {contactModalOpen && selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">
                Contact {selectedCandidate.id}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Email
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedCandidate.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Phone
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedCandidate.phone}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        (window.location.href = `mailto:${selectedCandidate.email}`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm flex justify-center items-center"
                    >
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `tel:${selectedCandidate.phone}`)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm flex justify-center items-center"
                    >
                      <Phone className="h-4 w-4 mr-1" /> Call
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-800 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
