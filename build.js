const yaml = require("js-yaml");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

// 1. Load Data
const fileContents = fs.readFileSync("resume.yaml", "utf8");
const data = yaml.load(fileContents);

// 2. Setup Directories & Base Config
const BASE_URL = process.env.NODE_ENV === "production" ? "/my-portfolio/" : "/";
const outputDir = "dist";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ---------------------------------------------------------
// PHASE A: Generate HTML
// ---------------------------------------------------------
console.log("📄 Generating HTML...");
const htmlTemplate = fs.readFileSync("views/template.ejs", "utf8");
const htmlOutput = ejs.render(htmlTemplate, { ...data, base_url: BASE_URL });

fs.writeFileSync(`${outputDir}/index.html`, htmlOutput);
fs.copyFileSync("script.js", `${outputDir}/script.js`);

// ---------------------------------------------------------
// PHASE B: Generate LaTeX (Resume)
// ---------------------------------------------------------
console.log("📄 Generating LaTeX...");

// Helper: Escape special LaTeX characters to prevent compile errors
const escapeLatex = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\textasciicircum{}");
};

// Inject the helper into the data object
const dataWithHelper = { ...data, escapeLatex };

try {
  const texTemplatePath = path.join("views", "resume.tex.ejs");
  // Check if template exists before trying to render
  if (fs.existsSync(texTemplatePath)) {
    const texTemplate = fs.readFileSync(texTemplatePath, "utf8");
    const texOutput = ejs.render(texTemplate, dataWithHelper);
    fs.writeFileSync(`${outputDir}/resume.tex`, texOutput);
    console.log("✅ LaTeX file created at dist/resume.tex");
  } else {
    console.warn("⚠️  Skipping LaTeX: views/resume.tex.ejs not found.");
  }
} catch (err) {
  console.error("❌ Error generating LaTeX:", err);
}
