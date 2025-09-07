/** @format */

import { ChromaClient } from "chromadb";
import OpenAI from "openai";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

const embeddingFunction = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY || "",
  modelName: "text-embedding-3-small",
});
const chroma = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});

const studentInfo = `Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
in her free time in hopes of working at a tech company after graduating from the University of Washington.`;

const clubInfo = `The university chess club provides an outlet for students to come together and enjoy playing
the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
participate in tournaments, analyze famous chess matches, and improve members' skills.`;

const universityInfo = `The University of Washington, founded in 1861 in Seattle, is a public research university
with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
As the flagship institution of the six public universities in Washington state,
UW encompasses over 500 buildings and 20 million square feet of space,
including one of the largest library systems in the world.`;

const collectionName = "personal-infos-2";

async function createCollectionIfNotExists() {
  try {
    await chroma.createCollection({ name: collectionName });
    console.log("Collection created.");
  } catch (err: any) {
    if (err.message.includes("already exists")) {
      console.log("Collection already exists, skipping creation.");
    } else {
      throw err;
    }
  }
}

async function getCollection() {
  return await chroma.getCollection({
    name: collectionName,
    embeddingFunction,
  });
}

async function populateCollection() {
  const collection = await getCollection();
  await collection.add({
    documents: [studentInfo, clubInfo, universityInfo],
    ids: ["id1", "id2", "id3"],
  });
  console.log("Collection populated with documents.");
}

async function askQuestion() {
  const question = "when was University of Washington, Seattle founded?";
  const collection = await getCollection();

  const result = await collection.query({
    queryTexts: [question],
    nResults: 1,
  });

  const relevantInfo = result.documents?.[0]?.[0];
  console.log("Relevant info:", relevantInfo);

  if (relevantInfo) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant. Use this info: ${relevantInfo}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    console.log("Answer:", response.choices[0].message?.content);
  } else {
    console.log("No relevant info found in collection.");
  }
}

async function main() {
  await createCollectionIfNotExists(); // Run once
  await populateCollection(); // Add docs
  await askQuestion(); // Query
}

main().catch(console.error);
// Collection already exists, skipping creation.
// Collection populated with documents.
// Relevant info: The University of Washington, founded in 1861 in Seattle, is a public research university
// with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
// As the flagship institution of the six public universities in Washington state,
// UW encompasses over 500 buildings and 20 million square feet of space,
// including one of the largest library systems in the world.
// Answer: The University of Washington, Seattle was founded in 1861.
