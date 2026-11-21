const fs = require("fs");
const path = require("path");

const publicDir = path.resolve(__dirname, "../public");
const buildDir = path.resolve(__dirname, "../build");
const templatePath = path.join(publicDir, "index.html");

// Preserve the generated HTML containing webpack's production script tags.
fs.cpSync(publicDir, buildDir, {
  recursive: true,
  filter: source => source !== templatePath
});

console.log("Public assets copied to build.");
