const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.post("/converter", async (req, res) => {
  const link = req.body.link;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://ytmp3.mobi/pt16/", { waitUntil: "networkidle2" });

  await page.type("#input", link);
  await page.click("#submit");
  await page.waitForSelector("#file", { visible: true, timeout: 30000 });
  await page.click("#file");

  await page.waitForSelector("#file", {
    visible: true,
    timeout: 30000,
  });

  const downloadButton = await page.$("#file");
  const downloadLink = await downloadButton.evaluate((el) =>
    el.getAttribute("href")
  );

  await browser.close();

  res.send({ link: downloadLink });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
