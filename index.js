const puppet = require("puppeteer");
const creds = require("./creds.json");
const fs = require("fs");

const linkedinUrl =
  "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin";

(async () => {
  const browser = await puppet.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(linkedinUrl);
  await page.waitForTimeout(1000);

  await page.type("#username", creds.Username);
  await page.waitForTimeout(1000);
  await page.type("#password", creds.Password);

  await page.waitForTimeout(1000);
  await page.click("[type=submit]");
  await page.waitForTimeout(3000);

  const geoId = YOURGEOID;
  const location = YOURLOCATION;
  let keyword = YOURKEYWORD;
  let count = 0;

  await page.goto(
    `https://www.linkedin.com/jobs/search/?distance=25&geoId=${geoId}&keywords=${keyword}&location=${location}&start=${count}`
  );

  await page.waitForTimeout(1000);
  await autoScroll(page);
  let links = await page.evaluate(() => {
    let queryResults = document.querySelectorAll(
      ".jobs-search-results__list-item"
    );
    let urls = Array.from(queryResults).map((r) => {
      rTitle = r.querySelectorAll(".job-card-list__title")[0].innerText;
      rLink = r.querySelectorAll(".job-card-container__link")[0].href;
      rName = r.querySelectorAll(".job-card-container__company-name")[0]
        .innerText;
      return {
        title: rTitle,
        name: rName,
        link: rLink,
      };
    });
    return urls;
  });
  await page.waitForTimeout(3000);
  console.log(links);

  fs.writeFile("data.json", JSON.stringify(links), (err) => {
    if (err) {
      console.log(err);
    }
  });
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
