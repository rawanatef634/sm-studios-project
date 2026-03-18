// scripts/resize-public-assets.js
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const publicAssetsDir = path.join(__dirname, "..", "public", "assets");
const sizes = [480, 800, 1200, 1600];
const extsToProcess = [".jpg", ".jpeg", ".png", ".webp"];

if (!fs.existsSync(publicAssetsDir)) {
  console.error("Directory not found:", publicAssetsDir);
  process.exit(1);
}

const files = fs.readdirSync(publicAssetsDir).filter((f) => {
  const ext = path.extname(f).toLowerCase();
  return extsToProcess.includes(ext);
});

(async () => {
  for (const file of files) {
    const inputPath = path.join(publicAssetsDir, file);
    const ext = path.extname(file);
    const name = file.slice(0, -ext.length);

    // skip already-generated variants (if name ends with -480 etc)
    if (/-\d{3,4}$/.test(name)) {
      continue;
    }

    try {
      for (const w of sizes) {
        const outJpg = path.join(publicAssetsDir, `${name}-${w}.jpg`);
        const outWebp = path.join(publicAssetsDir, `${name}-${w}.webp`);

        // create jpeg
        await sharp(inputPath)
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(outJpg);

        // create webp
        await sharp(inputPath)
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(outWebp);

        console.log(`→ ${name}-${w}.jpg / .webp`);
      }
    } catch (err) {
      console.error(`Error processing ${file}`, err);
    }
  }
  console.log("Done.");
})();
