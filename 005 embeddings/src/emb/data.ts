/** @format */

import { readFileSync, write, writeFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Embeddings = {
  input: string;
  embedding: number[];
};

async function generateEmbeddings(input: string | string[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });
  console.log(response.data[0].embedding);
  return response.data[0].embedding;
}

function loadJSONData<T>(fileName: string): T {
  const path = join(__dirname, fileName);
  const rawData = readFileSync(path);
  return JSON.parse(rawData.toString());
}

function saveDataToJsonFile(data: any, fileName: string) {
  const dataString = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataString);
  const path = join(__dirname, fileName);
  writeFileSync(path, dataBuffer);
  console.log(`Data saved to ${fileName}`);
}

async function main() {
  const data = loadJSONData<string[]>("data.json");
  const embeddings = await generateEmbeddings(data);
  const dataWithEmbeddings: Embeddings[] = [];
  for (let i = 0; i < data.length; i++) {
    dataWithEmbeddings.push({ input: data[i], embedding: embeddings.data[i] });
  }
  saveDataToJsonFile(dataWithEmbeddings, "dataWithEmbeddings.json");
}

// generateEmbeddings("CAT");
