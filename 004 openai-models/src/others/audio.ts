/** @format */

import OpenAI from "openai";
import { createReadStream, writeFileSync } from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. Transcribe audio (Whisper)
async function transcribeAudio() {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream("audio.mp3"),
      model: "gpt-4o-transcribe",
      // language: "en",
    });

    console.log("Transcription:", transcription.text);
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
}

// 2. Convert text to speech (TTS)
async function textToSpeech() {
  try {
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: "Hello! This is a test of OpenAI’s text-to-speech model.",
      format: "mp3",
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync("output.mp3", buffer);

    console.log("TTS saved as output.mp3");
  } catch (error) {
    console.error("Error generating TTS:", error);
  }
}

// transcribeAudio();
// textToSpeech();
