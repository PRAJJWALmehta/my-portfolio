const yaml = require("js-yaml");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

// 1. Load Data
const fileContents = fs.readFileSync("resume.yaml", "utf8");
const data = yaml.load(fileContents);

// 2. Setup Directories
const BASE_URL = process.env.NODE_ENV === "production" ? "/my-portfolio/" : "/";
const outputDir = "dist";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

// Helper: Escape special LaTeX characters
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

// Helper: Format Dates (YYYY-MM -> Month YYYY)
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  // If it says "Present", leave it alone
  if (dateStr.toLowerCase() === "present") return "Present";

  // Check for YYYY-MM format (e.g. 2024-07)
  const yyyyMmRegex = /^\d{4}-\d{2}$/;
  if (yyyyMmRegex.test(dateStr)) {
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  // Fallback: return as-is (handles just "2024")
  return dateStr;
};

// Combine data with helpers
const renderData = { ...data, base_url: BASE_URL, escapeLatex, formatDate };

// ---------------------------------------------------------
// PHASE A: Generate HTML
// ---------------------------------------------------------
console.log("📄 Generating HTML...");
const htmlTemplate = fs.readFileSync("views/template.ejs", "utf8");
const htmlOutput = ejs.render(htmlTemplate, renderData); // Use renderData here

fs.writeFileSync(`${outputDir}/index.html`, htmlOutput);
fs.copyFileSync("script.js", `${outputDir}/script.js`);

// ---------------------------------------------------------
// PHASE B: Generate LaTeX (Resume)
// ---------------------------------------------------------
console.log("📄 Generating LaTeX...");

try {
  const texTemplatePath = path.join("views", "resume.tex.ejs");
  if (fs.existsSync(texTemplatePath)) {
    const texTemplate = fs.readFileSync(texTemplatePath, "utf8");
    // We trim() to ensure no whitespace at the top of the file
    const texOutput = ejs.render(texTemplate, renderData).trim();
    fs.writeFileSync(`${outputDir}/resume.tex`, texOutput);
    console.log("✅ LaTeX file created at dist/resume.tex");
  } else {
    console.warn("⚠️  Skipping LaTeX: views/resume.tex.ejs not found.");
  }
} catch (err) {
  console.error("❌ Error generating LaTeX:", err);
}
