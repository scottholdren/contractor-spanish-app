import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = JSON.parse(fs.readFileSync(path.join(process.env.HOME!, ".gstack/openai.json"), "utf-8"));
const API_KEY = config.api_key;

const terms = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/terms.json"), "utf-8")).terms;

const PHOTOS_DIR = path.join(__dirname, "../public/photos");

async function generateImage(term: { id: string; en: string; category: string }): Promise<void> {
  const outPath = path.join(PHOTOS_DIR, `${term.id}.webp`);

  if (fs.existsSync(outPath)) {
    console.log(`  SKIP ${term.id} (already exists)`);
    return;
  }

  const prompt = `A clean, simple illustration of a ${term.en.toLowerCase()} used in house painting/construction. White background, no text, no labels. Flat illustration style with warm colors. The object should be centered and clearly recognizable. Tool/item only, no people, no scene.`;

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "low",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`  FAIL ${term.id}: ${res.status} ${err.slice(0, 200)}`);
      return;
    }

    const data = await res.json();
    const b64 = data.data[0]?.b64_json;

    if (!b64) {
      // Try URL-based response
      const url = data.data[0]?.url;
      if (url) {
        const imgRes = await fetch(url);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        fs.writeFileSync(outPath, buf);
        console.log(`  OK   ${term.id} (from URL)`);
        return;
      }
      console.error(`  FAIL ${term.id}: no image data in response`);
      return;
    }

    const buf = Buffer.from(b64, "base64");
    fs.writeFileSync(outPath, buf);
    console.log(`  OK   ${term.id}`);
  } catch (err: any) {
    console.error(`  FAIL ${term.id}: ${err.message}`);
  }
}

async function main() {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });

  console.log(`Generating illustrations for ${terms.length} terms...`);
  console.log(`Output: ${PHOTOS_DIR}\n`);

  // Process in batches of 4 with 75s delays to stay under 5/min rate limit
  for (let i = 0; i < terms.length; i += 4) {
    const batch = terms.slice(i, i + 4);
    console.log(`Batch ${Math.floor(i / 4) + 1}/${Math.ceil(terms.length / 4)}:`);
    await Promise.all(batch.map(generateImage));

    if (i + 4 < terms.length) {
      const remaining = terms.slice(i + 4).filter((t: any) => !fs.existsSync(path.join(PHOTOS_DIR, `${t.id}.webp`))).length;
      if (remaining > 0) {
        console.log(`  Waiting 75s for rate limit... (${remaining} remaining)\n`);
        await new Promise((r) => setTimeout(r, 75000));
      }
    }
  }

  // Count results
  const generated = terms.filter((t: any) => fs.existsSync(path.join(PHOTOS_DIR, `${t.id}.webp`))).length;
  console.log(`\nDone: ${generated}/${terms.length} illustrations generated.`);
}

main();
