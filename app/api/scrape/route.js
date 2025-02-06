import puppeteer from "puppeteer";

export async function GET(req) {
  try {
    console.log("Scraping started...");
    const browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    console.log("Navigating to LinkedIn...");
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });

    // Wait for the login form to be visible, not for navigation
    await page.waitForSelector("#username", { timeout: 60000 });

    console.log("Filling login details...");
    await page.type("#username", process.env.LINKEDIN_EMAIL);
    await page.type("#password", process.env.LINKEDIN_PASSWORD);
    await page.click('[type="submit"]');

    console.log("Waiting for job search page...");
    // Instead of waitForNavigation, we wait for the job search page to load by waiting for a specific selector
    await page.waitForSelector(".jobs-search-results__list-item", {
      timeout: 120000,
    });

    console.log("Navigating to job search...");
    await page.goto(
      "https://www.linkedin.com/jobs/search/?keywords=software%20developer",
      { waitUntil: "domcontentloaded", timeout: 120000 }
    );

    console.log("Waiting for job listings...");
    await page.waitForSelector(".jobs-search-results__list-item", {
      timeout: 10000,
    });

    console.log("Extracting job data...");
    const jobs = await page.evaluate(() => {
      let jobElements = document.querySelectorAll(
        ".jobs-search-results__list-item"
      );

      let jobData = [];
      jobElements.forEach((job) => {
        let title =
          job.querySelector(".job-card-list__title")?.innerText || "No Title";
        let company =
          job.querySelector(".job-card-container__company-name")?.innerText ||
          "No Company";
        let location =
          job.querySelector(".job-card-container__metadata-item")?.innerText ||
          "No Location";
        let link = job.querySelector("a.job-card-container__link")?.href || "#";

        jobData.push({ title, company, location, link });
      });

      return jobData;
    });

    console.log("Scraping completed:", jobs);
    await browser.close();
    return Response.json({ jobs });
  } catch (error) {
    console.error("Scraping failed:", error);
    return Response.json(
      { error: "Scraping failed", details: error.message },
      { status: 500 }
    );
  }
}
