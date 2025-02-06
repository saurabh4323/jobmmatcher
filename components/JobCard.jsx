import React from "react";
import { ArrowUpRight, Briefcase, Calendar, Tags } from "lucide-react";

const JobCard = ({ job }) => {
  // Sanitize description to remove potential HTML and truncate
  const sanitizeDescription = (desc) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = desc;
    return tempDiv.textContent.length > 200
      ? `${tempDiv.textContent.slice(0, 200)}...`
      : tempDiv.textContent;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-700/50 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-4xl">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          {job.logo ? (
            <img
              src={job.logo}
              alt={`${job.company} logo`}
              className="w-20 h-20 rounded-lg object-cover border-2 border-blue-600/50"
            />
          ) : (
            <div className="w-20 h-20 bg-blue-800/30 rounded-lg flex items-center justify-center">
              <Briefcase className="text-blue-400" size={32} />
            </div>
          )}

          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-blue-300 mb-1">
              {job.position}
            </h2>
            <div className="flex items-center space-x-2">
              <p className="text-gray-400">{job.company}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Tags className="mr-2 text-blue-500" size={16} />
            <div className="flex flex-wrap gap-2">
              {job.tags?.slice(0, 10).map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4 text-gray-300 text-sm">
          {sanitizeDescription(job.description)}
        </div>

        <div className="flex justify-between items-center">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>Apply Now</span>
            <ArrowUpRight size={16} />
          </a>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2 text-blue-500" />
            {new Date(job.date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
