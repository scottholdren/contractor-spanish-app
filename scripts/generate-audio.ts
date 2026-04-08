import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = JSON.parse(fs.readFileSync(path.join(process.env.HOME!, ".gstack/openai.json"), "utf-8"));
const API_KEY = config.api_key;

const terms = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/terms.json"), "utf-8")).terms;

const AUDIO_DIR_ES = path.join(__dirname, "../public/audio/es");
const AUDIO_DIR_EN = path.join(__dirname, "../public/audio/en");

async function generateAudio(text: string, outPath: string, voice: string): Promise<boolean> {
  if (fs.existsSync(outPath)) {
    return true;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice,
        response_format: "mp3",
        speed: 0.9,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      if (res.status === 429) {
        return false; // rate limited, retry later
      }
      console.error(`    FAIL: ${res.status} ${err.slice(0, 100)}`);
      return false;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outPath, buf);
    return true;
  } catch (err: any) {
    console.error(`    FAIL: ${err.message}`);
    return false;
  }
}

async function processterm(term: any): Promise<{ esOk: boolean; enOk: boolean }> {
  const esPath = path.join(AUDIO_DIR_ES, `${term.id}.mp3`);
  const enPath = path.join(AUDIO_DIR_EN, `${term.id}.mp3`);

  const esExists = fs.existsSync(esPath);
  const enExists = fs.existsSync(enPath);

  if (esExists && enExists) {
    console.log(`  SKIP ${term.id}`);
    return { esOk: true, enOk: true };
  }

  let esOk = esExists;
  let enOk = enExists;

  if (!esExists) {
    esOk = await generateAudio(term.es, esPath, "nova");
    console.log(`  ${esOk ? "OK  " : "FAIL"} ${term.id} [ES] "${term.es}"`);
  }

  if (!enExists) {
    enOk = await generateAudio(term.en, enPath, "onyx");
    console.log(`  ${enOk ? "OK  " : "FAIL"} ${term.id} [EN] "${term.en}"`);
  }

  return { esOk, enOk };
}

async function main() {
  fs.mkdirSync(AUDIO_DIR_ES, { recursive: true });
  fs.mkdirSync(AUDIO_DIR_EN, { recursive: true });

  console.log(`Generating audio for ${terms.length} terms (ES + EN = ${terms.length * 2} files)...`);
  console.log(`Output: ${path.join(__dirname, "../public/audio/")}\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  // Process one at a time with small delay to avoid rate limits
  // OpenAI TTS rate limit is much more generous than image gen
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    console.log(`[${i + 1}/${terms.length}]`);

    const result = await processterm(term);

    if (result.esOk && result.enOk) {
      if (fs.existsSync(path.join(AUDIO_DIR_ES, `${term.id}.mp3`)) &&
          fs.existsSync(path.join(AUDIO_DIR_EN, `${term.id}.mp3`))) {
        generated++;
      }
    } else {
      failed++;
      // If rate limited, wait 30s and retry
      if (!result.esOk || !result.enOk) {
        console.log(`  Waiting 30s for rate limit...`);
        await new Promise((r) => setTimeout(r, 30000));
        // Retry
        const retry = await processterm(term);
        if (retry.esOk && retry.enOk) {
          generated++;
          failed--;
        }
      }
    }

    // Small delay between terms
    if (i < terms.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const esCount = fs.readdirSync(AUDIO_DIR_ES).filter(f => f.endsWith(".mp3")).length;
  const enCount = fs.readdirSync(AUDIO_DIR_EN).filter(f => f.endsWith(".mp3")).length;

  console.log(`\nDone: ${esCount} Spanish + ${enCount} English audio files.`);
  if (failed > 0) console.log(`${failed} terms had failures. Re-run to retry.`);
}

main();
