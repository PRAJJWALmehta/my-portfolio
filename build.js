const yaml = require("js-yaml");
const fs = require("fs");
const ejs = require("ejs");

const fileContents = fs.readFileSync("resume.yaml", "utf8");

const data = yaml.load(fileContents);
const template = fs.readFileSync("views/template.ejs", "utf8");

const BASE_URL = process.env.NODE_ENV === "production" ? "/my-portfolio/" : "/";

const htmlOutput = ejs.render(template, { ...data, base_url: BASE_URL });

const outputDir = "dist";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(`${outputDir}/index.html`, htmlOutput);
fs.copyFileSync("script.js", `${outputDir}/script.js`);
