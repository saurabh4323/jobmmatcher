# Job Matcher Project Summary

## 1. Project Overview

**Job Matcher** is a career-support web application for technology job seekers and recruiters. It combines profile analysis, resume creation, job publishing, job browsing, interview preparation, learning resources, and experimental machine-learning features in one platform.

The application is designed to help a candidate:

- Import professional information from a LinkedIn profile.
- Review experience, education, skills, certifications, and profile summary.
- Create a resume using selectable templates.
- Improve resume content with generative AI.
- Practice technical interview questions with an AI interview companion.
- Get feedback on code or written interview answers.
- Browse or apply for jobs.
- Follow technical learning paths based on identified skills.

Recruiters can:

- Register and log in.
- Create job postings.
- Search and view jobs.
- View basic recruiter dashboard information.

## 2. Main Goals

The project addresses several common problems in the job-search process:

1. Candidate information is spread across resumes, LinkedIn, and other documents.
2. Resume writing and tailoring can be time-consuming.
3. Candidates often lack structured technical interview practice.
4. Recruiters need a simple way to publish and manage openings.
5. Candidates need recommendations for skills and learning topics.

The application attempts to make these activities available through a single web interface.

## 3. Technology Stack

### Frontend and web application

- **Next.js 15** using the App Router.
- **React 19** for user interfaces.
- **JavaScript and JSX**.
- **Tailwind CSS** and DaisyUI for styling.
- **Lucide React** for icons.
- **Framer Motion** for animations where used.
- **Axios** and the native `fetch` API for HTTP requests.

### Backend and data

- Next.js route handlers provide the application API.
- **MongoDB** is accessed through **Mongoose**.
- `config/connect.js` manages a cached MongoDB connection.
- `bcryptjs` is included for password hashing.
- Recruiter and candidate data are represented with Mongoose schemas.

### AI and external services

- **Google Gemini** is called through `app/api/gemini/route.js`.
- **Proxycurl** is used to retrieve LinkedIn profile information.
- **Puppeteer** is used by the LinkedIn scraping route.
- **JDoodle** is used by the programming practice route to execute submitted code.
- **Resend** is included for email functionality.

### Machine learning service

- A separate **FastAPI** service runs on port `8000`.
- **scikit-learn** provides a `LogisticRegression` model.
- NumPy and pandas support the ML service.
- The current demo trains on a synthetic dataset.

## 4. High-Level Architecture

```text
Browser
  |
  v
Next.js pages and React components
  |
  +--> Next.js API route handlers
  |      +--> MongoDB through Mongoose
  |      +--> Gemini API
  |      +--> Proxycurl API
  |      +--> JDoodle API
  |      +--> LinkedIn through Puppeteer
  |
  +--> FastAPI ML service on localhost:8000
         +--> scikit-learn training and prediction
```

The browser normally communicates with Next.js routes rather than calling most third-party services directly. The Next.js routes act as a proxy and return JSON responses to the frontend.

## 5. Candidate Features

### 5.1 LinkedIn profile analysis

The home experience accepts a LinkedIn profile URL. The application:

1. Removes the protocol from the submitted URL.
2. Validates the expected LinkedIn profile format.
3. Calls the Proxycurl LinkedIn endpoint.
4. Stores the returned profile data in browser `localStorage` under `profiledata`.
5. Redirects the user to the dashboard.

The dashboard displays profile information such as:

- Name and headline.
- Profile picture.
- Location.
- Number of connections.
- Company.
- Work experience.
- Education.
- Skills.
- Certifications.
- Professional summary.

### 5.2 Profile dashboard

The dashboard reads the imported profile from `localStorage` and presents it in expandable sections. It is intended to give the candidate a centralized view of professional information before creating a resume or selecting a learning path.

### 5.3 Resume builder

The resume builder offers multiple templates:

1. Modern Minimal.
2. Creative Bold.
3. Classic Elegant.
4. Tech Forward.
5. Minimalist Grid.

The resume pages use stored profile information and allow the candidate to generate or edit resume content. Resume output is intended to be printable or exportable through the resume UI.

### 5.4 Job browsing and matching

The job area supports:

- Job listings.
- Search by recruiter or search term.
- Job title, company, location, salary, description, and skills.
- Job type and experience level.
- Application deadline.

The current interface presents job cards and a job-board style view. The project branding describes intelligent job recommendations, but a complete production-grade matching algorithm is not yet evident in the current implementation.

### 5.5 Recruiter workflow

Recruiters have separate registration and login routes and can:

- View a recruiter dashboard.
- See the number of active jobs.
- Create a job posting.
- Search or view jobs associated with a recruiter.

The job creation form collects:

- Job title.
- Company name.
- Location.
- Description.
- Required skills.
- Experience level.
- Job type.
- Salary range.
- Application deadline.

### 5.6 Interview preparation

The interview section provides technical topics including:

- Arrays and strings.
- Linked lists.
- Stacks and queues.
- Bit manipulation.
- Heaps and priority queues.
- Segment trees.
- JavaScript.
- TypeScript.
- Python.
- C++.
- Java.
- Go.
- Rust.
- PHP.
- React.
- C#.

Each topic can provide external video tutorials and reading materials. A practice flow can open an interactive session for the selected topic.

## 6. How AI Is Used

AI is used as an assistant for content generation, personalization, and feedback. It is not a replacement for human review or professional hiring decisions.

### 6.1 Resume writing assistance

The resume template pages call the Gemini route to:

- Rewrite a professional summary into a concise two-to-three-line version.
- Convert an experience title and company into a polished three-to-four-line description.
- Improve the wording and presentation of resume content.

This helps candidates transform raw profile data into clearer, more professional resume language.

### 6.2 AI interview questions

The interview practice route sends the selected topic to Gemini and asks for one interview question. The returned question is shown in the interview companion and added to interview history.

This helps candidates practice questions that are relevant to the selected technology or data-structure topic.

### 6.3 Code and answer feedback

The programming practice page can send code or written notes to Gemini with a request for analysis. The prompt includes the current question and either:

- The submitted code, or
- The candidate's written response.

The result is displayed as feedback to help the candidate identify mistakes and improve reasoning.

### 6.4 Profile-based learning recommendations

The Learning Hub presents an AI-powered curriculum concept based on the candidate's LinkedIn profile and skills. The current UI highlights a recommended scikit-learn path. This is currently presented as a guided recommendation experience; a complete dynamic recommendation engine is not clearly implemented in the inspected code.

### 6.5 ATS and resume analysis

There is an implementation path for sending extracted resume text to Gemini and requesting an ATS score. The PDF extraction component is currently commented out, so this should be considered an experimental or incomplete feature rather than a guaranteed production workflow.

## 7. ML Service and Prediction Flow

The repository contains a separate FastAPI service in `python_backend/main.py`.

### Available endpoints

#### `GET /`

Returns a service status message.

#### `POST /train`

Creates a synthetic classification dataset with four features and trains a logistic-regression model.

#### `POST /predict`

Accepts a JSON object containing a list of numeric features. If the model has not been trained, it trains automatically, then returns:

- A predicted class.
- A confidence value.
- The names of the expected features.

#### `GET /model-info`

Returns the model type, training status, and feature names.

### Current ML features

The model describes its feature names as:

- Skill Score.
- Experience Years.
- Interview Performance.
- Education Level.

The current training data is synthetic and is not connected to real candidate outcomes. Therefore, the prediction endpoint is best understood as a demonstration of the ML integration architecture, not as a validated hiring or job-matching model.

The Next.js routes `app/api/ml/train/route.js` and `app/api/ml/predict/route.js` proxy requests to the FastAPI service.

## 8. Data Models

The main Mongoose schemas include:

### User

Stores candidate account information:

- Full name.
- Email.
- Password.
- Creation date.

### UserProfile

Stores profile-related information where used by the application.

### Job

Stores job information:

- Title.
- Company name.
- Location.
- Description.
- Skills.
- Experience.
- Job type.
- Salary.
- Application deadline.
- Creation date.

### JobsApplied

Represents job application state such as:

- Applied.
- Interviewed.
- Offered.
- Rejected.

### UserJobrec

Supports recruiter-related user/job records.

## 9. Important API Routes

### Candidate and profile routes

- `/api/register` - candidate registration.
- `/api/login` - candidate login.
- `/api/profile` - profile operations.
- `/api/profile/[phone]` - profile lookup/update path.
- `/api/proxycurl/[linkedinUrl]` - LinkedIn profile enrichment.

### Recruiter routes

- `/api/rec/register` - recruiter registration.
- `/api/rec/login` - recruiter login.
- `/api/rec/find/[email]` - recruiter lookup.
- `/api/rec/job` - create and manage jobs.
- `/api/rec/job/[name]` - retrieve jobs for a recruiter/search value.

### AI and practice routes

- `/api/gemini` - Gemini text generation proxy.
- `/api/code` - JDoodle code execution proxy.
- `/api/scrape` - Puppeteer-based LinkedIn job scraping route.

### ML routes

- `/api/ml/train` - proxy to FastAPI model training.
- `/api/ml/predict` - proxy to FastAPI prediction.

## 10. Typical User Journey

1. The user opens the application and selects a candidate or recruiter workflow.
2. A candidate submits a LinkedIn profile URL.
3. The application retrieves profile data and stores it locally.
4. The candidate reviews the dashboard.
5. The candidate selects a resume template.
6. Gemini improves the summary and experience descriptions.
7. The candidate reviews or prints the resume.
8. The candidate practices interview topics.
9. Gemini generates questions and provides code or answer feedback.
10. The candidate browses jobs and tracks applications where supported.

## 11. Configuration and Running the Project

### Next.js application

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### FastAPI service

The Python service can be started from the `python_backend` directory using the project's Python environment:

```bash
python main.py
```

The service listens on:

```text
http://localhost:8000
```

### Environment values

The application expects configuration such as:

- `MONGODB_URI`.
- `NEXT_PUBLIC_GEMINI_API_KEY`.
- LinkedIn credentials for the scraping route, if that route is used.
- Other email or third-party service configuration as required.

Secrets should be stored in a local environment file and must not be committed to source control or exposed to the browser.

## 12. Current Limitations and Risks

The following points are important before using this as a production hiring platform:

1. The ML model is trained on synthetic data and has not been evaluated against real hiring outcomes.
2. The ML prediction should not be used as the sole basis for hiring, rejection, or candidate ranking.
3. Some AI features are prototypes and may depend on exact Gemini response formatting.
4. PDF ATS analysis code is commented out and may require additional integration work.
5. LinkedIn and Proxycurl access depends on third-party availability, authorization, quotas, and terms of service.
6. Credentials and third-party API keys must be moved fully into secure environment variables.
7. Authentication, authorization, input validation, rate limiting, and session management should be hardened before deployment.
8. Profile information is stored in browser `localStorage`; sensitive data should be handled with a clear privacy policy and stronger server-side controls where appropriate.
9. External URLs, embedded videos, and code execution require validation and abuse protection.
10. Some dashboard statistics and recommendation labels are currently static or illustrative.
11. The scraping route relies on LinkedIn page selectors, which can change and cause failures.
12. AI-generated text must be reviewed by the candidate for accuracy, truthfulness, and privacy.

## 13. Recommended Future Improvements

### Product improvements

- Add a real job-matching engine based on skills, experience, location, and preferences.
- Add filters for salary, work mode, experience, job type, and location.
- Add candidate application tracking with status updates.
- Add recruiter candidate search and talent-pool management.
- Add resume download/export options with consistent formatting.
- Add candidate and recruiter notification flows.

### AI improvements

- Use structured JSON schemas for Gemini responses.
- Add prompt versioning and response validation.
- Show explanations and source fields for recommendations.
- Add resume-to-job comparison with matched and missing skills.
- Add human-review controls for generated resume text.
- Record model feedback and quality metrics without storing unnecessary personal data.

### ML improvements

- Replace synthetic data with consented, representative, and quality-checked data.
- Define fairness, accuracy, calibration, and drift metrics.
- Keep hiring decisions human-reviewed.
- Version and persist trained models.
- Add input validation and model monitoring.
- Provide understandable explanations for predictions.

### Engineering and security improvements

- Remove all hard-coded API keys and credentials.
- Add authentication middleware and route authorization.
- Validate request bodies with shared schemas.
- Add rate limiting and abuse protection.
- Add automated tests for API routes and critical user flows.
- Add error monitoring and structured logging.
- Add privacy controls for imported profile data.
- Document deployment, database indexes, and environment setup.

## 14. Report Classification

This document is a **technical project summary and system report**. It can be used as:

- A project documentation report.
- A software architecture report.
- An AI/ML integration report.
- A feature and workflow report.
- A project presentation or viva reference.
- A starting point for a final-year project report.

It describes the current implementation as observed in the repository. Features marked as experimental, illustrative, commented out, or future work should not be presented as fully production-ready without additional implementation and testing.

## 15. Final Summary

Job Matcher is a full-stack career platform that combines a Next.js user experience, MongoDB-backed application data, external professional-profile enrichment, generative AI assistance, coding practice, interview preparation, recruiter workflows, and a separate FastAPI/scikit-learn demonstration service.

AI is most useful in this project for reducing repetitive career-preparation work: improving resume language, generating topic-specific interview questions, reviewing code and answers, and supporting personalized learning ideas. The ML service demonstrates how predictive functionality can be connected to the web application, but its synthetic training data means it is not yet a reliable real-world job-ranking system.

The strongest next step is to secure third-party integrations, replace illustrative data and static claims with measured functionality, validate the matching model using appropriate data, and keep human judgment central to all employment decisions.
