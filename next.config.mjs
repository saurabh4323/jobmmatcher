/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lint with `npm run lint`; Next 15's build-time lint bridge is incompatible
  // with this repository's ESLint 9 flat configuration.
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    // Legacy URLs from the previous layout — keep old bookmarks and shared links working.
    return [
      { source: "/choose", destination: "/register", permanent: false },
      { source: "/student/home", destination: "/dashboard", permanent: false },
      { source: "/home", destination: "/recruiter", permanent: false },
      { source: "/jobsrec", destination: "/recruiter/jobs", permanent: false },
      { source: "/jobsrec/:id", destination: "/recruiter/jobs/:id", permanent: false },
      { source: "/createJob", destination: "/recruiter/jobs/new", permanent: false },
      { source: "/candidates", destination: "/recruiter/candidates", permanent: false },
      { source: "/interviewlive", destination: "/recruiter/interview", permanent: false },
      { source: "/recruiter/register", destination: "/register?role=recruiter", permanent: false },
      { source: "/index/:topic", destination: "/interview/:topic", permanent: false },
    ];
  },
};

export default nextConfig;
