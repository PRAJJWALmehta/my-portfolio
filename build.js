const yaml = require("js-yaml");
const fs = require("fs");
const ejs = require("ejs");

const fileContents = fs.readFileSync("resume.yaml", "utf8");

const data = yaml.load(fileContents);
const template = fs.readFileSync("views/template.ejs", "utf8");

const htmlOutput = ejs.render(template, data);

const outputDir = "dist";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFileSync(`${outputDir}/index.html`, htmlOutput);
