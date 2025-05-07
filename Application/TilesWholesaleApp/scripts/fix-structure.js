const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Paths - using process.cwd() instead of __dirname to avoid linter errors
const ROOT_DIR = process.cwd();
const NESTED_DIR = path.join(ROOT_DIR, "TilesWholesaleApp");

console.log("Fixing project folder structure...");
console.log(`Root directory: ${ROOT_DIR}`);
console.log(`Nested directory: ${NESTED_DIR}`);

// Check if nested directory exists
if (fs.existsSync(NESTED_DIR) && fs.statSync(NESTED_DIR).isDirectory()) {
  try {
    // Get the list of all items in the nested directory
    const items = fs.readdirSync(NESTED_DIR);

    console.log(`Found ${items.length} items in nested directory.`);

    // Move each item to the root directory
    items.forEach((item) => {
      const sourcePath = path.join(NESTED_DIR, item);
      const destPath = path.join(ROOT_DIR, item);

      // Skip if destination already exists
      if (fs.existsSync(destPath)) {
        console.log(`Skipping ${item}: already exists in target directory.`);
        return;
      }

      // Move the item
      if (process.platform === "win32") {
        // Windows requires a different command for moving directories
        execSync(`xcopy "${sourcePath}" "${destPath}" /E /I /H /Y`);
        console.log(`Moved ${item} to root directory.`);
      } else {
        // Unix-based systems can use mv
        execSync(`mv "${sourcePath}" "${destPath}"`);
        console.log(`Moved ${item} to root directory.`);
      }
    });

    // After successful copy, remove the nested directory
    fs.rmSync(NESTED_DIR, { recursive: true, force: true });
    console.log("Removed nested TilesWholesaleApp directory.");

    console.log("Project structure fixed successfully!");
  } catch (error) {
    console.error("Error fixing project structure:", error);
  }
} else {
  console.log("No nested directory found, structure looks good!");
}
