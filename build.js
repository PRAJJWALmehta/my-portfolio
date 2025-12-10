const yaml = require("js-yaml");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
// 👇 Import capability to run terminal commands (like pdflatex)
const { execSync } = require("child_process");

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

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.toLowerCase() === "present") return "Present";
  const yyyyMmRegex = /^\d{4}-\d{2}$/;
  if (yyyyMmRegex.test(dateStr)) {
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  return dateStr;
};

const renderData = { ...data, base_url: BASE_URL, escapeLatex, formatDate };

// ---------------------------------------------------------
// PHASE A: Generate HTML
// ---------------------------------------------------------
console.log("📄 Generating HTML...");
const htmlTemplate = fs.readFileSync("views/template.ejs", "utf8");
const htmlOutput = ejs.render(htmlTemplate, renderData);

fs.writeFileSync(`${outputDir}/index.html`, htmlOutput);
if (fs.existsSync("script.js")) {
  fs.copyFileSync("script.js", `${outputDir}/script.js`);
}

// ---------------------------------------------------------
// PHASE B: Generate LaTeX (Resume)
// ---------------------------------------------------------
console.log("📄 Generating LaTeX...");

const texTemplatePath = path.join("views", "resume.tex.ejs");

// 👇 OPEN IF CHECK
if (fs.existsSync(texTemplatePath)) {
  const texTemplate = fs.readFileSync(texTemplatePath, "utf8");
  const texOutput = ejs.render(texTemplate, renderData).trim();

  // Define the specific filename you want
  const pdfName = "prajjwal_mehta_resume";

  // Save the .tex file with that name
  fs.writeFileSync(`${outputDir}/${pdfName}.tex`, texOutput);
  console.log(`✅ LaTeX source created at dist/${pdfName}.tex`);

  // ---------------------------------------------------------
  // PHASE C: Compile PDF Locally
  // ---------------------------------------------------------
  console.log("🔄 Attempting to generate PDF locally...");

  // 👇 OPEN TRY BLOCK
  try {
    // Run pdflatex on the specific file name
    const cmd = `pdflatex -output-directory=${outputDir} -interaction=nonstopmode ${outputDir}/${pdfName}.tex`;

    execSync(cmd, { stdio: "pipe" }); // Run 1
    execSync(cmd, { stdio: "pipe" }); // Run 2 (ensure layout matches)

    console.log(`✅ SUCCESS: dist/${pdfName}.pdf generated locally!`);
  } catch (err) {
    console.warn("⚠️  Could not generate PDF locally.");
    console.warn(`   Error details: ${err.message}`);
    console.warn("   (This is normal if you don't have 'pdflatex' installed.)");
  }
} else {
  console.warn("⚠️  Skipping LaTeX: views/resume.tex.ejs not found.");
}
