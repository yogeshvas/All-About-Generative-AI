/** @format */

import { readFileSync, writeFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type Movie = {
  id: number;
  title: string;
  genre: string[];
  description: string;
  rating: number;
  year: number;
};

export type Embeddings = {
  id: number;
  text: string;
  embedding: number[];
};

export function loadJSONData<T>(fileName: string): T {
  const path = join(__dirname, fileName);
  const rawData = readFileSync(path);
  return JSON.parse(rawData.toString());
}

export async function generateEmbeddings(input: string | string[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002", // you could also use "text-embedding-3-small" or "text-embedding-3-large"
    input,
  });
  return response;
}

export function SaveDataToJsonFile(data: any, fileName: string) {
  const dataString = JSON.stringify(data, null, 2);
  const path = join(__dirname, fileName);
  writeFileSync(path, dataString);
  console.log(`Data saved to ${fileName}`);
}

async function main() {
  const movies = loadJSONData<Movie[]>("movies.json");

  // Create a text representation for each movie
  const texts = movies.map(
    (m) =>
      `Title: ${m.title}\nGenres: ${m.genre.join(", ")}\nDescription: ${
        m.description
      }\nYear: ${m.year}\nRating: ${m.rating}`
  );

  const embeddings = await generateEmbeddings(texts);

  const dataWithEmbeddings: Embeddings[] = movies.map((m, i) => ({
    id: m.id,
    text: texts[i],
    embedding: embeddings.data[i].embedding,
  }));

  SaveDataToJsonFile(dataWithEmbeddings, "dataWithEmbeddings.json");
}

main();
