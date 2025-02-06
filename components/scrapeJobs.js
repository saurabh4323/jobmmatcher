// import puppeteer from "puppeteer";
// import dotenv from "dotenv";

// dotenv.config();

// async function scrapeLinkedInJobs() {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   // Navigate to LinkedIn Login Page
//   await page.goto("https://www.linkedin.com/login");

//   // Fill in login details
//   await page.type("#username", process.env.LINKEDIN_EMAIL);
//   await page.type("#password", process.env.LINKEDIN_PASSWORD);
//   await page.click('[type="submit"]');

//   // Wait for successful login
//   await page.waitForNavigation();

//   // Navigate to LinkedIn Jobs Search Page
//   await page.goto(
//     "https://www.linkedin.com/jobs/search/?keywords=software%20developer"
//   );

//   // Wait for job listings to load
//   await page.waitForSelector(".jobs-search-results__list-item");

//   // Extract job data
//   const jobs = await page.evaluate(() => {
//     let jobElements = document.querySelectorAll(
//       ".jobs-search-results__list-item"
//     );

//     let jobData = [];
//     jobElements.forEach((job) => {
//       let title =
//         job.querySelector(".job-card-list__title")?.innerText || "No Title";
//       let company =
//         job.querySelector(".job-card-container__company-name")?.innerText ||
//         "No Company";
//       let location =
//         job.querySelector(".job-card-container__metadata-item")?.innerText ||
//         "No Location";
//       let link = job.querySelector("a.job-card-container__link")?.href || "#";

//       jobData.push({ title, company, location, link });
//     });

//     return jobData;
//   });

//   console.log("Scraped Jobs:", jobs); // Display scraped jobs in console

//   await browser.close();
//   return jobs;
// }

// // Run the scraper
// scrapeLinkedInJobs();
