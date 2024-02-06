import type BlockEntry from "./BlockEntry.ts";
import { join } from "$std/path/mod.ts";
import { DIR_RP, NAMESPACE } from "../store/_config.ts";
import { Image } from "imagescript/mod.ts";

const NOTES_FREQUENCIES: Record<string, number> = {
  "C": 261.63,
  "C#": 277.18,
  "D": 293.66,
  "D#": 311.13,
  "E": 329.63,
  "F": 349.23,
  "F#": 369.99,
  "G": 392.00,
  "G#": 415.30,
  "A": 440.00,
  "A#": 466.16,
  "B": 493.88,
};

// Convert a note to its major triad frequencies
function noteToMajorTriad(note: string): number[] {
  const notes = Object.keys(NOTES_FREQUENCIES);
  const index = notes.indexOf(note);
  if (index === -1) throw new Error("Note not found");

  const third = notes[(index + 4) % 12];
  const fifth = notes[(index + 7) % 12];

  return [
    NOTES_FREQUENCIES[note],
    NOTES_FREQUENCIES[third],
    NOTES_FREQUENCIES[fifth],
  ];
}

// Generate tone using FFmpeg and save as OGG
async function generateAndSave(
  filename: string,
  chordFrequencies: number[],
  duration: number,
) {
  if (chordFrequencies.some((f) => isNaN(f))) {
    throw new Error("Frequency must be a number");
  }

  const audioSources = chordFrequencies.map((freq, idx) =>
    `aevalsrc=0.5*sin(2*PI*${freq}*t):d=${duration}[a${idx}]`
  ).join(";");

  const process = new Deno.Command("ffmpeg.exe", {
    args: [
      "-filter_complex",
      `${audioSources};${
        chordFrequencies.map((_, idx) => `[a${idx}]`).join("")
      }amix=inputs=${chordFrequencies.length}`,
      "-c:a",
      "libopus",
      `${filename}.ogg`,
    ],
  });

  const { stdout, stderr } = await process.output();

  const decoder = new TextDecoder();
  if (stderr) {
    console.error(decoder.decode(stderr));
  }

  if (stdout) {
    console.log(decoder.decode(stdout));
  }
}

async function hexColorToAudioChord(block: BlockEntry) {
  const hexColor = block.hexColor().toUpperCase().replace("#", "");
  const noteIndex = parseInt(hexColor, 16) % 12;

  // Change octave based on material
  //   const octave = Math.floor(block.material.minimumLevel / 100) + 1;

  const note = Object.keys(NOTES_FREQUENCIES)[noteIndex];
  //   let note = Object.keys(NOTES_FREQUENCIES)[noteIndex];
  //   if (octave > 1) {
  //     note = `${note}${octave}`;
  //   }

  // Convert note to major triad chord frequencies
  const chordFrequencies = noteToMajorTriad(note);

  const duration = Math.max(1, Math.min(3, ((block.level / 900) / 100) * 2));

  // Generate and save audio for the chord
  await generateAndSave(
    join(DIR_RP, "sounds", "blocks", `${block.resourceId}`),
    chordFrequencies,
    duration,
  );
}

function audioChordToHexColor(chord: string[]): string {
  const frequencies = chord.map((c) => {
    const notes = c.split(",").map((n) => n.trim());

    const freqs = notes.map((n) => {
      const noteIndex = Object.keys(NOTES_FREQUENCIES).indexOf(n);
      if (noteIndex !== -1) {
        return Object.values(NOTES_FREQUENCIES)[noteIndex];
      }

      return 0;
    });

    return freqs.reduce((a, b) => a + b, 0);
  });

  const color = frequencies.reduce((a, b) => a + b, 0).toString(16);

  return color;
}

function imageFromChords(chords: string[][]) {
  const image = (new Image(100, 100)).fill(0x000000);

  chords.forEach((chord, idx) => {
    const color = audioChordToHexColor(chord);

    image.setPixelAt(idx, 0, parseInt(color, 16));
  });

  return image.encode();
}

export default async function generateSounds(res: BlockEntry[]) {
  const defs: Record<string, {
    category: string;
    sounds: Array<{
      name: string;
      volume: number;
    }>;
  }> = {};

  res.forEach(async (block) => {
    const id = block.behaviorId.replace(":", ".");

    if (!defs[id]) {
      defs[id] = {
        category: "block",
        sounds: [],
      };
    }

    defs[id].sounds.push({
      name: `blocks/${block.resourceId}`,
      volume: Math.max(0.01, +((block.level / 900) / 100).toFixed(3)),
    });

    await hexColorToAudioChord(block);
  });

  await Deno.writeTextFile(
    join(DIR_RP, "sounds", "sound_definitions.json"),
    JSON.stringify(
      {
        format_version: "1.14.0",
        sound_definitions: defs,
      },
      null,
      2,
    ),
  );
}

if (import.meta.main) {
  // Generate image of "Mary had a little lamb"
  const chords = [
    [
      "E,G#,B",
      "D,G,B",
      "C,E,G",
      "D,G,B",
      "E,G,B",
      "E,G,B",
      "E,G,B",
      "D,G,B",
      "D,G,B",
      "D,G,B",
      "E,G,B",
      "G,B,D",
      "G,B,D",
      "E,G,B",
      "D,G,B",
      "C,E,G",
    ],
    [
      "E,G,B",
      "D,G,B",
      "C,E,G",
      "D,G,B",
      "E,G,B",
      "E,G,B",
      "E,G,B",
      "D,G,B",
      "D,G,B",
      "D,G,B",
      "E,G,B",
      "G,B,D",
      "G,B,D",
      "E,G,B",
      "D,G,B",
      "C,E,G",
    ],
  ];

  const image = await imageFromChords(chords);
  await Deno.writeFile("test.png", image);
}
